"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRdsClientV2 = void 0;
var IRdsClientV2 = /** @class */ (function () {
    function IRdsClientV2() {
    }
    IRdsClientV2.$transaction = function (transactions) {
        return Promise.resolve({ success: true, data: [] });
    };
    return IRdsClientV2;
}());
exports.IRdsClientV2 = IRdsClientV2;
