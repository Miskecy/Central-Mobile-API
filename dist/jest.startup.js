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
var jestCli = __importStar(require("jest-cli"));
var server_1 = require("./server/server");
var environment_1 = require("./common/environment");
var users_model_1 = require("./users/users.model");
var users_router_1 = require("./users/users.router");
var server;
var beforeAllTests = function () {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/central-mobile-api-test';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter
    ])
        .then(function () { return users_model_1.User.deleteMany({}).exec(); })
        .then(function () {
        var admin = new users_model_1.User();
        admin.name = 'admin',
            admin.email = 'admin@email.com',
            admin.password = '123456',
            admin.profiles = ['admin', 'user'];
        return admin.save();
    });
};
var afterAllTests = function () {
    return server.shutdown();
};
//Dynamic find tests
beforeAllTests().then(function () { return jestCli.run(); }).then(function () { return afterAllTests(); }).catch(console.error);
