"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRouter = void 0;
var router_1 = require("./router");
var mongoose_1 = __importDefault(require("mongoose"));
var restify_errors_1 = require("restify-errors");
var ModelRouter = /** @class */ (function (_super) {
    __extends(ModelRouter, _super);
    function ModelRouter(model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pageSize = 4;
        _this.validateId = function (req, res, next) {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                next();
            }
        };
        _this.findAll = function (req, res, next) {
            var page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            var skip = (page - 1) * _this.pageSize;
            _this.model.countDocuments({}).exec().then(function (count) { return _this.model
                .find()
                .skip(skip)
                .limit(_this.pageSize)
                .then(_this.renderAll(res, next, { page: page, count: count, pageSize: _this.pageSize, url: req.url })); })
                .catch(next);
        };
        //this.model.findById(req.params.id)
        _this.findById = function (req, res, next) {
            _this.prepareOne(_this.model.findById(req.params.id)).then(_this.render(res, next)).catch(next);
        };
        _this.save = function (req, res, next) {
            var document = new _this.model(req.body);
            //user.name = req.body.name
            //user.email = req.body.email
            document.save().then(_this.render(res, next)).catch(next);
        };
        _this.replace = function (req, res, next) {
            var options = {
                runValidators: true,
                overwrite: true
            };
            _this.model.replaceOne({ _id: req.params.id }, req.body).exec().then(function (result) {
                if (result.n) {
                    return _this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(_this.render(res, next)).catch(next);
        };
        _this.update = function (req, res, next) {
            var options = { runValidators: true, new: true };
            _this.model.findByIdAndUpdate(req.params.id, req.body, options).then(_this.render(res, next)).catch(next);
        };
        _this.delete = function (req, res, next) {
            _this.model.deleteOne({ _id: req.params.id }).exec().then(function (cmdResult) {
                if (cmdResult.n) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
        };
        _this.basePath = "/" + model.collection.name;
        return _this;
    }
    // protected prepareOne(query: mongoose.DocumentQuery<D[], D>): mongoose.DocumentQuery<D[], D> {
    //     return query
    // }
    ModelRouter.prototype.prepareOne = function (query) {
        return query;
    };
    ModelRouter.prototype.envelope = function (document) {
        var resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = this.basePath + "/" + resource._id;
        return resource;
    };
    ModelRouter.prototype.envelopeAll = function (documents, options) {
        if (options === void 0) { options = {}; }
        var resource = {
            _links: {
                self: "" + options.url
            },
            items: documents
        };
        if (options.page && options.countDocuments && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = this.basePath + "?_page=" + (options.page - 1);
            }
            var remaining = options.countDocuments - (options.page * options.pageSize);
            if (remaining > 0) {
                resource._links.next = this.basePath + "?_page=" + (options.page + 1);
            }
        }
        return resource;
    };
    return ModelRouter;
}(router_1.Router));
exports.ModelRouter = ModelRouter;
