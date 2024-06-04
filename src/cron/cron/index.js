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
// import { CronJob } from "cron";
var cron_1 = require("cron");
var ioredis_1 = require("ioredis");
var RdsClient_1 = require("../utils/RdsClient");
var rds = new RdsClient_1.RdsClientV2();
var redis = new ioredis_1.default("redis://default:354b59765ecc416d978dd717cfe64394@usw1-learning-teal-33630.upstash.io:33630");
//helper function to write progress data from the db
var writeProgressToDB = function (videoProgress) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, course_id, video_id, progress, completed, last_watched_at, paramsObj, _a, result, error, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log('write progress to db hit');
                user_id = videoProgress.user_id, course_id = videoProgress.course_id, video_id = videoProgress.video_id, progress = videoProgress.progress, completed = videoProgress.completed, last_watched_at = videoProgress.last_watched_at;
                paramsObj = { user_id: user_id, course_id: course_id, video_id: video_id, progress: progress, completed: completed, last_watched_at: last_watched_at };
                return [4 /*yield*/, rds.queryOne({
                        sql: "INSERT INTO misc_db.watch_history (user_id, course_id, video_id, progress, completed, last_watched_at)\n      VALUES (:user_id, :course_id, :video_id, :progress, :completed, :last_watched_at::timestamptz)\n      ON CONFLICT (user_id, video_id)\n      DO UPDATE SET\n        course_id = EXCLUDED.course_id,\n        progress = EXCLUDED.progress,\n        completed = EXCLUDED.completed,\n        last_watched_at = EXCLUDED.last_watched_at;\n      ",
                        params: { user_id: user_id, course_id: course_id, video_id: video_id, progress: progress, completed: completed, last_watched_at: last_watched_at }
                    })];
            case 1:
                _a = _b.sent(), result = _a[0], error = _a[1];
                if (error !== null) {
                    throw new Error("Error quering writing progress to db" + error.message + error.stack);
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                throw new Error(error_1.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
var scheduleCronJob = function () { return __awaiter(void 0, void 0, void 0, function () {
    var job;
    return __generator(this, function (_a) {
        console.log("hit cron");
        job = new cron_1.CronJob("*/5 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
            var keys, _i, keys_1, key, cacheData, videoProgress, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, redis.keys("user:*video:*")];
                    case 1:
                        keys = _a.sent();
                        _i = 0, keys_1 = keys;
                        _a.label = 2;
                    case 2:
                        if (!(_i < keys_1.length)) return [3 /*break*/, 6];
                        key = keys_1[_i];
                        return [4 /*yield*/, redis.get(key)];
                    case 3:
                        cacheData = _a.sent();
                        if (!cacheData) return [3 /*break*/, 5];
                        videoProgress = JSON.parse(cacheData);
                        console.log(videoProgress);
                        return [4 /*yield*/, writeProgressToDB(videoProgress)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        console.error("Error in cron job:", error_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        job.start();
        return [2 /*return*/];
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scheduleCronJob()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
