"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var fs = __importStar(require("fs"));
var restify = __importStar(require("restify"));
var mongoose_1 = __importDefault(require("mongoose"));
var environment_1 = require("../common/environment");
var merge_patch_parser_1 = require("./merge-patch.parser");
var error_handler_1 = require("./error.handler");
var token_parser_1 = require("../security/token.parser");
var restify_cors_middleware_1 = __importDefault(require("restify-cors-middleware"));
var logger_1 = require("../common/logger");
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.prototype.initializeDb = function () {
        mongoose_1.default.Promise = global.Promise;
        return mongoose_1.default.connect(environment_1.environment.db.url, {
            //useMongoClient: true, //The `useMongoClient` option is no longer necessary in mongoose 5.x
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    };
    Server.prototype.initRoutes = function (routers) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var options = {
                    name: 'central-mobile-api',
                    version: '1.0.0',
                    log: logger_1.logger
                };
                if (environment_1.environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate);
                    options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                _this.application = restify.createServer(options);
                var corsOptions = {
                    preflightMaxAge: 10,
                    origins: ['*'],
                    allowHeaders: ['authorization'],
                    exposeHeaders: ['x-custom-header']
                };
                var cors = restify_cors_middleware_1.default(corsOptions);
                _this.application.pre(cors.preflight);
                _this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger
                }));
                _this.application.use(cors.actual);
                _this.application.use(restify.plugins.queryParser());
                _this.application.use(restify.plugins.bodyParser());
                _this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                _this.application.use(token_parser_1.tokenParser); //auth
                //routes 
                for (var _i = 0, routers_1 = routers; _i < routers_1.length; _i++) {
                    var router = routers_1[_i];
                    router.applyRoutes(_this.application);
                }
                _this.application.listen(environment_1.environment.server.port, function () {
                    resolve(_this.application);
                });
                _this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    Server.prototype.bootstrap = function (routers) {
        var _this = this;
        if (routers === void 0) { routers = []; }
        return this.initializeDb().then(function () { return _this.initRoutes(routers).then(function () { return _this; }); });
    };
    Server.prototype.shutdown = function () {
        var _this = this;
        return mongoose_1.default.disconnect().then(function () { var _a; return (_a = _this.application) === null || _a === void 0 ? void 0 : _a.close(); });
    };
    return Server;
}());
exports.Server = Server;
