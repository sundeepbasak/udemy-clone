"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareStatement = void 0;
function prepareStatement(sql, fields) {
    if (fields) {
        for (var i = 0; i < fields.length; i++) {
            var reg = new RegExp('\\$' + (i + 1), "i");
            sql = sql.replace(reg, ":" + (fields === null || fields === void 0 ? void 0 : fields[i]));
        }
        return sql;
    }
    return sql;
}
exports.prepareStatement = prepareStatement;
