"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergePatchBodyParser = void 0;
var mpContentType = 'application/merge-patch+json';
exports.mergePatchBodyParser = function (req, res, next) {
    if (req.getContentType() === mpContentType && req.method === 'PATCH') {
        req.rawBody = req.body;
        try {
            req.body = JSON.parse(req.body);
        }
        catch (e) {
            return next(new Error("Invalid content: " + e.message));
        }
    }
    return next();
};
