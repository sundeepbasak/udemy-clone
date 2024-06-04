"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdsClientV2 = void 0;
var es6Helper_utils_1 = require("../es6Helper.utils");
var paginate_utils_1 = require("../paginate.utils");
var AWS = require("aws-sdk");
var prepareSQL_utils_1 = require("../prepareSQL.utils");
var awsRegion = 'us-east-1';
var resourceArn = 'arn:aws:rds:us-east-1:390052798950:cluster:aurora-cluster-frontend-dev';
var secretArn = 'arn:aws:secretsmanager:us-east-1:390052798950:secret:aurora-csv-manager-hfDVrW';
var database = 'clinify';
/**
 * A thin wripper around the RdsDataService Class that exposes four high level functions on top of the primitives that
 * RdsDataService provides. It has slightly modified implementations of the primitives such as `executeStatement`, `beginTransaction`,
 * `commitTransaction` and `rollbackTransaction` that let you perform granular operations, the distinction being that they apply transformations
 * to the returened result set prior to returning it that otherwise would have needed to be applied manually.
 * e.g. The `executeStatement` method of this function returns an array JavaScript objects with key-value pairs and parses any JSON fields into JS Objects,
 * whereas the primitive method returns and array of type `RDSDataService.ExecuteStatementResponse.records` .
 *
 * The high level functions include `queryOne`, `query`, `mutateOne` and `mutate`. These methods accept paramters for the prepared statements as
 * Plain JS Objects instead of `RdsDataService.SqlParametersList` records and perform auto-commits/rollback transactions for mutations, depening on the
 * result of the query that otherwise would have required manual calls to the commit and rollback methods. The autoCommit feature can be opted out of by
 * passing the noAutoCommit flag to the method call
 */
var RdsClientV2 = /** @class */ (function () {
    function RdsClientV2() {
        this.rds = new AWS.RDSDataService({
            region: awsRegion,
            httpOptions: { connectTimeout: 1 * 60 * 1000, timeout: 3 * 60 * 1000 }
        });
    }
    /**
     * @description returns the first response from the result set returned by a query. Do note that the method doesn't peform any uniqueness checks and only returns the first of any number of possible results.
     * In case no data is returned, the data property of the data object will be null. If you have a where clause on an attribue with a unique constraint a null value for the data property indicates that the
     * corresponding record doesn't exist
     * @param params The parameters to the method
     * @param params.params A JS Object representing the parameters to the prepapred SQL statement. The name of the keys of this object must match the name of the slots for the prepared query exactly
     * @param params.sql   the prepared SQL Query/Statement
     * @param params.typeHintMap (Optional) A JS Object that has the same keys as the params but the values are type hints for the parameters like `JSON, DATETIME, TIMESTAMP, etc.`
     * @returns A tuple with data and error objects. If the query is successful the error object is null, otherwise the data object is null. Shape `[{data: T, count: number}, null] | [null, {message: string, stack?; string}]`
     * @example
     * ```ts
     *      const rds = new RdsClientV2();
     *      const params = {
     *          date_of_upload: '2022-08-01'
     *      }
     *
     *      const paramsSQL = SQLParams<typeof params> = params;
     *
     *      //Returns the first file uploaded that day
     *      const [data, error] =
     *          await rds.queryOne<typeof paramsSQL, {
     *              uploadId: number,
     *              name: string,
     *              uploaded_by: string
     *          }>({
     *              sql: `
     *                  SELECT id as uploadId, filename as name, uploaded_by FROM upload_jobs
     *                  where date_of_upload = :date_of_upload
     *                  ORDER BY time_of_upload ASC
     *                  LIMIT 1
     *              `
     *              params: paramsSQL,
     *              typeHintMap: {
     *                  date_of_upload: 'DATETIME'
     *              }
     *          })
     *
     *          if(err !== null) {
     *              //do error handling
     *          } else {
     *              //processed the returned data
     *          }
     * ```
     */
    RdsClientV2.prototype.queryOne = function (params, paramsArray) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlParams, records, recordOne, e_1, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sqlParams = getSQLParameterFromObject(params.params, params.typeHintMap);
                        if (paramsArray) {
                            params.sql = (0, prepareSQL_utils_1.prepareStatement)(params.sql, Object.keys(params.params));
                        }
                        return [4 /*yield*/, this
                                .executeStatement({
                                resourceArn: resourceArn,
                                secretArn: secretArn,
                                database: database,
                                sql: params.sql,
                                includeResultMetadata: true,
                                parameters: sqlParams,
                            })];
                    case 1:
                        records = _a.sent();
                        if (records.length === 0)
                            return [2 /*return*/, [{ data: null, count: 0 }, null]];
                        recordOne = Object.keys(records[0]).length === 0 ? null : records[0];
                        return [2 /*return*/, [{ data: recordOne, count: 1 }, null]];
                    case 2:
                        e_1 = _a.sent();
                        err = e_1;
                        return [2 /*return*/, [null, { message: err.message, stack: err.stack }]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description same as `queryOne` except that it returns the entire result set (array of objects) instead of the first record (a single object)
     * @param params The parameters to the method
     * @param params.params A JS Object representing the parameters to the prepapred SQL statement. The name of the keys of this object must match the name of the slots for the prepared query exactly
     * @param params.sql   the prepared SQL Query/Statement
     * @param params.typeHintMap (Optional) A JS Object that has the same keys as the params but the values are type hints for the parameters like `JSON, DATETIME, TIMESTAMP, etc.`
    *  @returns A tuple with data and error objects. If the query is successful the error object is null, otherwise the data object is null. Shape `[{data: T[], count: number}, null] | [null, {message: string, stack?; string}]`
     * @example
     * ```ts
     *      const rds = new RdsClientV2();
     *      const params = {
     *          date_of_upload: '2022-08-01'
     *      }
     *
     *      const paramsSQL = SQLParams<typeof params> = params;
     *
     *      //Returns the all first 50 files uploaded that day. Here data is an array of objects
     *      const [data, error] =
     *          await rds.query<typeof paramsSQL, {
     *              uploadId: number,
     *              name: string,
     *              uploaded_by: string
     *          }>({
     *              sql: `
     *                  SELECT id as uploadId, filename as name, uploaded_by FROM upload_jobs
     *                  where date_of_upload = :date_of_upload
     *                  LIMIT 50
     *              `
     *              params: paramsSQL,
     *              typeHintMap: {
     *                  date_of_upload: 'DATETIME'
     *              }
     *          })
     *
     *          if(err !== null) {
     *              //do error handling
     *          } else {
     *              //processed the returned data
     *          }
     * ```
     */
    RdsClientV2.prototype.query = function (params, paramsArray) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlParams, records, e_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sqlParams = getSQLParameterFromObject(params.params);
                        if (paramsArray) {
                            params.sql = (0, prepareSQL_utils_1.prepareStatement)(params.sql, Object.keys(params.params));
                        }
                        return [4 /*yield*/, this.executeStatement({
                                resourceArn: resourceArn,
                                secretArn: secretArn,
                                database: database,
                                sql: params.sql,
                                includeResultMetadata: true,
                                parameters: sqlParams,
                            })];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, [{ data: records, count: records.length }, null]];
                    case 2:
                        e_2 = _a.sent();
                        err = e_2;
                        return [2 /*return*/, [null, { message: err.message, stack: err.stack }]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RdsClientV2.prototype.mutateOne = function (params, paramsArray) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var transactionId, sqlParams, records, recordOne, e_3, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transactionId = '';
                        if (!params.transactionId) return [3 /*break*/, 1];
                        transactionId = params.transactionId;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.beginTransaction()];
                    case 2:
                        transactionId = (_a = (_b.sent()).transactionId) !== null && _a !== void 0 ? _a : '';
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 7, , 10]);
                        sqlParams = getSQLParameterFromObject(params.params, params.typeHintMap);
                        if (paramsArray) {
                            params.sql = (0, prepareSQL_utils_1.prepareStatement)(params.sql, Object.keys(params.params));
                            console.log(params.sql);
                        }
                        return [4 /*yield*/, this
                                .executeStatement({
                                resourceArn: resourceArn,
                                secretArn: secretArn,
                                database: database,
                                sql: params.sql,
                                includeResultMetadata: true,
                                parameters: sqlParams,
                                transactionId: transactionId,
                            })];
                    case 4:
                        records = _b.sent();
                        if (!!('noAutoCommit' in params)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.commitTransaction({ transactionId: transactionId })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        recordOne = records && records[0] && Object.keys(records).length === 0 ? undefined : records[0];
                        if (!('noAutoCommit' in params))
                            return [2 /*return*/, [{ data: recordOne, count: 1 }, null]];
                        else {
                            return [2 /*return*/, [
                                    { data: recordOne, count: 1 },
                                    null,
                                    this.transactionFnBuilder(transactionId, 'COMMIT'),
                                    this.transactionFnBuilder(transactionId, 'ROLLBACK'),
                                ]];
                        }
                        return [3 /*break*/, 10];
                    case 7:
                        e_3 = _b.sent();
                        if (!!('noAutoCommit' in params)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.rollbackTransaction({ transactionId: transactionId })];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        err = e_3;
                        return [2 /*return*/, [null, { message: err.message, stack: err.stack }]];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    RdsClientV2.prototype.mutate = function (params) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var transactionId, sqlParams, records, e_4, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transactionId = '';
                        if (!params.transactionId) return [3 /*break*/, 1];
                        transactionId = params.transactionId;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.beginTransaction()];
                    case 2:
                        transactionId = (_a = (_b.sent()).transactionId) !== null && _a !== void 0 ? _a : '';
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 7, , 10]);
                        sqlParams = getSQLParameterFromObject(params.params);
                        return [4 /*yield*/, this
                                .executeStatement({
                                resourceArn: resourceArn,
                                secretArn: secretArn,
                                database: database,
                                sql: params.sql,
                                includeResultMetadata: true,
                                parameters: sqlParams,
                            })];
                    case 4:
                        records = _b.sent();
                        if (!!('noAutoCommit' in params)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.commitTransaction({ transactionId: transactionId })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        if (!('noAutoCommit' in params)) {
                            return [2 /*return*/, [{ data: records, count: records.length }, null]];
                        }
                        else {
                            return [2 /*return*/, [
                                    { data: records, count: records.length },
                                    null,
                                    this.transactionFnBuilder(transactionId, 'COMMIT'),
                                    this.transactionFnBuilder(transactionId, 'ROLLBACK')
                                ]];
                        }
                        return [3 /*break*/, 10];
                    case 7:
                        e_4 = _b.sent();
                        if (!!('noAutoCommit' in params)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.rollbackTransaction({ transactionId: transactionId })];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        err = e_4;
                        return [2 /*return*/, [null, { message: err.message, stack: err.stack }]];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    RdsClientV2.prototype.beginTransaction = function () {
        return this.rds
            .beginTransaction({
            database: database,
            resourceArn: resourceArn,
            secretArn: secretArn,
        })
            .promise();
    };
    RdsClientV2.prototype.rollbackTransaction = function (params) {
        return this.rds
            .rollbackTransaction({
            resourceArn: resourceArn,
            secretArn: secretArn,
            transactionId: params.transactionId,
        })
            .promise();
    };
    RdsClientV2.prototype.commitTransaction = function (params) {
        return this.rds
            .commitTransaction({
            resourceArn: resourceArn,
            secretArn: secretArn,
            transactionId: params.transactionId,
        })
            .promise();
    };
    RdsClientV2.prototype.executeStatement = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var response, records, headers, _loop_1, _i, _a, record;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.rds.executeStatement(params).promise()];
                    case 1:
                        response = _b.sent();
                        records = [];
                        headers = [];
                        if (response.columnMetadata)
                            headers = response.columnMetadata.map(function (v) { var _a; return ({ label: (_a = v.label) !== null && _a !== void 0 ? _a : '', type: v.typeName }); });
                        if (response.records) {
                            _loop_1 = function (record) {
                                var tempRecord = {};
                                record.forEach(function (v, i) {
                                    var _a;
                                    if (v.isNull)
                                        tempRecord[headers[i].label] = null;
                                    else {
                                        var value = Object.values(v)[0];
                                        if (headers[i].type && /json/i.test((_a = headers[i].type) !== null && _a !== void 0 ? _a : ''))
                                            tempRecord[headers[i].label] = JSON.parse(value);
                                        else
                                            tempRecord[headers[i].label] = value;
                                    }
                                });
                                records.push(tempRecord);
                            };
                            for (_i = 0, _a = response.records; _i < _a.length; _i++) {
                                record = _a[_i];
                                _loop_1(record);
                            }
                        }
                        return [2 /*return*/, records];
                }
            });
        });
    };
    RdsClientV2.prototype.transactionFnBuilder = function (transactionId, type) {
        var _this = this;
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var txnFn, res, e_5, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txnFn = type === 'COMMIT' ? this.commitTransaction.bind(this) : this.rollbackTransaction.bind(this);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, txnFn({ transactionId: transactionId })];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                transactionStatus: res.transactionStatus,
                            }];
                    case 3:
                        e_5 = _a.sent();
                        err = e_5;
                        return [2 /*return*/, {
                                success: false,
                                transactionStatus: 'FAILED',
                                message: err.message,
                                stack: err.stack
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    };
    RdsClientV2.$transaction = function (transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var success, commitFns, rollbackFns, dataVals, _i, _a, _b, idx, txn, _c, data, err, commit, rollback, rollback_slice, batches, _d, batches_1, batch, slice, batches, _e, batches_2, batch, slice;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        success = true;
                        commitFns = [];
                        rollbackFns = [];
                        dataVals = [];
                        _i = 0, _a = (0, es6Helper_utils_1.enumerate)(transactions);
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        _b = _a[_i], idx = _b[0], txn = _b[1];
                        return [4 /*yield*/, txn];
                    case 2:
                        _c = _f.sent(), data = _c[0], err = _c[1], commit = _c[2], rollback = _c[3];
                        if (!err) return [3 /*break*/, 7];
                        success = false;
                        rollback_slice = rollbackFns.slice(0, idx - 1);
                        batches = (0, paginate_utils_1.generatePaginationData)(rollback_slice, 3).batches;
                        _d = 0, batches_1 = batches;
                        _f.label = 3;
                    case 3:
                        if (!(_d < batches_1.length)) return [3 /*break*/, 6];
                        batch = batches_1[_d];
                        slice = batch.slice;
                        return [4 /*yield*/, Promise.allSettled(slice.map(function (v) { return v(); }))];
                    case 4:
                        _f.sent();
                        _f.label = 5;
                    case 5:
                        _d++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        dataVals.push(data);
                        commitFns.push(commit);
                        rollbackFns.push(rollback);
                        _f.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9:
                        if (!success) return [3 /*break*/, 13];
                        batches = (0, paginate_utils_1.generatePaginationData)(commitFns, 3).batches;
                        _e = 0, batches_2 = batches;
                        _f.label = 10;
                    case 10:
                        if (!(_e < batches_2.length)) return [3 /*break*/, 13];
                        batch = batches_2[_e];
                        slice = batch.slice;
                        return [4 /*yield*/, Promise.allSettled(slice.map(function (v) { return v(); }))];
                    case 11:
                        _f.sent();
                        _f.label = 12;
                    case 12:
                        _e++;
                        return [3 /*break*/, 10];
                    case 13: return [2 /*return*/, { success: success, data: dataVals }];
                }
            });
        });
    };
    return RdsClientV2;
}());
exports.RdsClientV2 = RdsClientV2;
function getSQLParameterFromObject(params, typeHintMap) {
    var _a;
    if (typeHintMap === void 0) { typeHintMap = {}; }
    var entries = Object.entries(params);
    var sqlParametersList = [];
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _b = entries_1[_i], key = _b[0], val = _b[1];
        if (typeof key === 'symbol') {
            continue;
        }
        else {
            var keyName = key;
            var keyField = getFieldType(val);
            if (keyField !== null) {
                var fieldValue = val;
                if (keyField.Field === 'stringValue') {
                    if (keyField.typeHint === 'JSON') {
                        fieldValue = JSON.stringify(val);
                    }
                }
                if (keyField.Field === 'isNull')
                    fieldValue = true;
                var sqlParaTemp = {
                    name: keyName + '',
                    value: (_a = {}, _a[keyField.Field] = fieldValue, _a),
                };
                if (keyField.typeHint)
                    sqlParaTemp.typeHint = 'JSON';
                else if (typeHintMap[key])
                    sqlParaTemp.typeHint = typeHintMap[key];
                sqlParametersList.push(sqlParaTemp);
            }
        }
    }
    return sqlParametersList;
}
function getFieldType(val) {
    switch (typeof val) {
        case 'number': {
            var numStr = val.toString();
            if (numStr.indexOf('.') > -1)
                return { Field: 'doubleValue' };
            else
                return { Field: 'longValue' };
        }
        case 'boolean':
            return { Field: 'booleanValue' };
        case 'string':
            return { Field: 'stringValue' };
        case 'object': {
            if (val === null)
                return { Field: 'isNull' };
            else if (Array.isArray(val)) {
                if (val.every(function (v) { return typeof v === 'number' || typeof v === 'string'; }))
                    return { Field: 'arrayValue' };
                else
                    return { Field: 'stringValue', typeHint: 'JSON' };
            }
            else
                return { Field: 'stringValue', typeHint: 'JSON' };
        }
        default:
            return null;
    }
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var rds, promise1, promise2, promise3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rds = new RdsClientV2();
                promise1 = rds.mutateOne({
                    sql: "",
                    params: {},
                    noAutoCommit: true
                });
                promise2 = rds.mutateOne({
                    sql: "",
                    params: {},
                    noAutoCommit: true
                });
                promise3 = rds.mutateOne({
                    sql: "",
                    params: {},
                    noAutoCommit: true
                });
                return [4 /*yield*/, RdsClientV2.$transaction([promise1, promise2, promise3])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
