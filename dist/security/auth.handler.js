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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var jwt = __importStar(require("jsonwebtoken"));
var restify_errors_1 = require("restify-errors");
var environment_1 = require("../common/environment");
var users_model_1 = require("../users/users.model");
exports.authenticate = function (req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    users_model_1.User.findByEmail(email, '+password').then(function (user) {
        if (user && user.matches(password)) {
            var token = jwt.sign({ sub: user.email, iss: 'central-mobile-api' }, environment_1.environment.security.apiSecret);
            res.json({ name: user.name, email: user.email, accessToken: token });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
