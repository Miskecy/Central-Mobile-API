"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server/server");
var users_router_1 = require("./users/users.router");
var server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter
]).then(function (server) {
    var _a;
    console.log('Server is listening on:', (_a = server.application) === null || _a === void 0 ? void 0 : _a.address());
}).catch(function (error) {
    console.log('Server failed to start');
    console.log(error);
    process.exit(1);
});
