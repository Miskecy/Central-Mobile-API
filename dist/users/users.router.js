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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
var restify = __importStar(require("restify"));
var users_model_1 = require("./users.model");
var model_router_1 = require("../common/model-router");
var auth_handler_1 = require("../security/auth.handler");
var authz_handler_1 = require("../security/authz.handler");
var UsersRouter = /** @class */ (function (_super) {
    __extends(UsersRouter, _super);
    function UsersRouter() {
        var _this = _super.call(this, users_model_1.User) || this;
        _this.findByEmail = function (req, res, next) {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email).then(function (user) {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                }).then(_this.renderAll(res, next, {
                    pageSize: _this.pageSize,
                    url: req.url
                })).catch(next);
            }
            else {
                next();
            }
        };
        _this.on('beforeRender', function (document) {
            document.password = undefined;
        });
        return _this;
    }
    UsersRouter.prototype.applyRoutes = function (application) {
        //application.get('/users', callback)
        application.get("" + this.basePath, restify.plugins.conditionalHandler([
            {
                version: '2.0.0', handler: [
                    authz_handler_1.authorize('admin'),
                    this.findByEmail,
                    this.findAll
                ]
            },
            { version: '1.0.0', handler: [authz_handler_1.authorize('admin'), this.findAll] }
        ]));
        //application.get('/users/:id', callback)
        application.get(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        application.post("" + this.basePath, [authz_handler_1.authorize('admin'), this.save]);
        application.put(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.replace]); //user nao pode alterar proprio cadastro
        application.patch(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.post(this.basePath + "/authenticate", auth_handler_1.authenticate);
    };
    return UsersRouter;
}(model_router_1.ModelRouter));
exports.usersRouter = new UsersRouter();
