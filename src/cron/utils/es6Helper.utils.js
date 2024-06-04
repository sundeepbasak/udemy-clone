"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumerate = exports.pick = exports.safeParseJSON = exports.ConvertTupleToSingleValue = exports.ES6MapToObject = void 0;
function ES6MapToObject(map) {
    var obj = {};
    map.forEach(function (val, key) {
        if (val instanceof Map)
            obj[key] = ES6MapToObject(val);
        else if (typeof val === 'object')
            obj[key] = ConvertTupleToSingleValue(val);
        else
            obj[key] = val;
    });
    return obj;
}
exports.ES6MapToObject = ES6MapToObject;
function ConvertTupleToSingleValue(val) {
    if (typeof val === 'object' && !val.length && !(val instanceof Date))
        return ConvertTupleToSingleValue(val);
    else if (typeof val === 'object' && val.length && val.length === 1)
        return val[0];
    else
        return val;
}
exports.ConvertTupleToSingleValue = ConvertTupleToSingleValue;
/**
 * @description Tries to parse a string to a POJO using `JSON.parse()`. If `JSON.parse()` throws an error it returns the input string,
 * otherwise returns the parsed object.
 * @param str String to be parsed as JSON
 * @example
 * ```ts
 *  let res = safeParseJSON("undefined"); // res = "undefined"
 *  res = safeParseJSON("a string literal"); // res = "a string literal";
 *  res = safeParseJSON("1"); // res = 1
 *  res = safeParseJSON('{ "a" : 1, "b": "val"}'); // res = { a : 1, b : "val"}
 *  res = safeParseJSON("[1,2,3]"); // res = [1,2,3]
 * ```
 */
function safeParseJSON(str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    }
    catch (e) {
        return str;
    }
}
exports.safeParseJSON = safeParseJSON;
function pick(obj, keys) {
    var obj_0 = {};
    keys.forEach(function (key) {
        if (key in obj)
            obj_0[key] = obj[key];
    });
    return obj_0;
}
exports.pick = pick;
function enumerate(arr) {
    var enumerated_array = [];
    for (var index in arr) {
        enumerated_array.push([Number(index), arr[index]]);
    }
    return enumerated_array;
}
exports.enumerate = enumerate;
