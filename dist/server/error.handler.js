"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
exports.handleError = function (req, res, e, done) {
    try {
        switch (e.name) {
            case 'MongoError':
                if (11000 === e.code) {
                    e.statusCode = 400;
                    e.errors = {
                        message: 'E11000 duplicate key error collection'
                    };
                    console.log('MongoError');
                }
                break;
            case 'ValidationError':
                e.statusCode = 400;
                var messages = [];
                for (var name_1 in e.errors) {
                    messages.push({ message: e.errors[name_1].message });
                }
                e.errors = messages;
                console.log('ValidationError');
                break;
        }
    }
    catch (error) { }
    done();
};
