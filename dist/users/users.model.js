"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var users = [
    { id: '1', name: 'Miskecy', email: 'miskecy@gmail.com' },
    { id: '2', name: 'Miskecy2', email: 'miskecy2@gmail.com' }
];
var User = /** @class */ (function () {
    function User() {
    }
    User.findAll = function () {
        return Promise.resolve(users);
    };
    User.findById = function (id) {
        return new Promise(function (resolve) {
            var filtered = users.filter(function (user) { return user.id === id; });
            var user = undefined;
            if (filtered.length > 0) {
                user = filtered[0];
            }
            resolve(user);
        });
    };
    return User;
}());
exports.User = User;
