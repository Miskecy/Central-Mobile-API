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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var events_1 = require("events");
var restify_errors_1 = require("restify-errors");
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    function Router() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Router.prototype.envelope = function (document) {
        return document;
    };
    Router.prototype.envelopeAll = function (documents, options) {
        if (options === void 0) { options = {}; }
        return documents;
    };
    Router.prototype.render = function (res, next) {
        var _this = this;
        return function (document) {
            if (document) {
                _this.emit('beforeRender', document);
                res.json(_this.envelope(document));
            }
            else {
                throw new restify_errors_1.NotFoundError('Documento não encontrado');
            }
            return next(false);
        };
    };
    Router.prototype.renderAll = function (res, next, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return function (documents) {
            if (documents) {
                documents.forEach(function (document, index, array) {
                    _this.emit('beforeRender', document);
                    array[index] = _this.envelope(document);
                });
                res.json(_this.envelopeAll(documents, options));
            }
            else {
                res.json(_this.envelopeAll([]));
            }
            return next(false);
        };
    };
    return Router;
}(events_1.EventEmitter));
exports.Router = Router;
