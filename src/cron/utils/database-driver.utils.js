"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var kysely_1 = require("kysely");
// class RDSDriver implements Driver {
// }
exports.db = new kysely_1.Kysely({
    dialect: {
        createAdapter: function () { return new kysely_1.PostgresAdapter(); },
        createDriver: function () { return new kysely_1.DummyDriver(); },
        createIntrospector: function (db) { return new kysely_1.PostgresIntrospector(db); },
        createQueryCompiler: function () { return new kysely_1.PostgresQueryCompiler(); },
    },
});
/*
what are hot kysely instances and cold kysely instances

*/ 
