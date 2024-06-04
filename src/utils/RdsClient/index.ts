// import * as RdsDataService from 'aws-sdk/clients/rdsdataservice';
import {
    IRdsClientV2,
    QueryParams,
    QueryParamsNAC,
    RdsClientResponse,
    RdsClientErrorResp,
    RdsClientSuccessResp,
    RdsClientResponseNAC,
    SQLParams,
    SqlFieldKeys,
    SqlTypeHintMap,
    SqlParameter,
    ExecuteStatementRequest,
    BeginTransactionResponse,
    CommitTransactionResponse,
    RollbackTransactionResponse,
    TransactionFnResp
} from './types';
import { enumerate } from '../es6Helper.utils';
import { generatePaginationData } from '../paginate.utils';

import * as AWS from 'aws-sdk'
import { prepareStatement } from '../prepareSQL.utils';
import { RDS_DB_NAME, REGION, RESOURCE_ARN, SECRET_ARN } from '@/constants/config.constants';


export type { IRdsClientV2, SQLParams, QueryParams, SqlTypeHintMap, RdsClientResponse, RdsClientErrorResp, RdsClientSuccessResp, RdsClientResponseNAC };


const awsRegion = REGION;
const resourceArn = RESOURCE_ARN;
const secretArn = SECRET_ARN;
const database = RDS_DB_NAME;

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
export class RdsClientV2 implements IRdsClientV2 {
    private rds: AWS.RDSDataService;

    constructor() {
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

    async queryOne<S extends {}, T>(params: QueryParams<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponse<T | null>> {
        try {
            const sqlParams = getSQLParameterFromObject(params.params, params.typeHintMap);
            if (paramsArray) {
                params.sql = prepareStatement(params.sql, Object.keys(params.params));
            }

            const records = await this
                .executeStatement({
                    resourceArn: resourceArn,
                    secretArn: secretArn,
                    database: database,
                    sql: params.sql,
                    includeResultMetadata: true,
                    parameters: sqlParams,
                });



            if (records.length === 0)
                return [{ data: null, count: 0 }, null];

            const recordOne = Object.keys(records[0]).length === 0 ? null : records[0]

            return [{ data: recordOne as T, count: 1 }, null];
        } catch (e) {
            const err = e as Error;
            return [null, { message: err.message, stack: err.stack }];
        }
    }



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
    async query<S extends {}, T>(params: QueryParams<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponse<T[]>> {
        try {
            const sqlParams = getSQLParameterFromObject(params.params);
            if (paramsArray) {
                params.sql = prepareStatement(params.sql, Object.keys(params.params));
            }

            const records = await this.executeStatement({
                resourceArn: resourceArn,
                secretArn: secretArn,
                database: database,
                sql: params.sql,
                includeResultMetadata: true,
                parameters: sqlParams,
            });

            return [{ data: records as T[], count: records.length }, null];
        } catch (e) {
            const err = e as Error;
            return [null, { message: err.message, stack: err.stack }];
        }
    }


    /**
    * @description returns the first result from the result set returned by a mutation query (update, insert, delete, etc). If the query is successful
    * and it returns no fields the data object will be undefined. If the query returns any data, a JS Object representation of the same will be returned. When using the primitives from
    * RdsDataService, mutations need to be part of transaction for them to be commited. This method manages the commits and rollbacks based on result of query execution automatically.
    * In case you wish to opt-out if the auto-commit feature you can set the noAutoCommit flag to true. Do note that the method doesn't check for uniqueness on
    * the mutation it merely returns the first record from the result set
    * @param params The parameters to the method
    * @param params.params A JS Object representing the parameters to the prepapred SQL statement. The name of the keys of this object must match the name of the slots for the prepared query exactly
    * @param params.sql   the prepared SQL Query/Statement
    * @param params.typeHintMap (Optional) A JS Object that has the same keys as the params but the values are type hints for the parameters like `JSON, DATETIME, TIMESTAMP, etc.`
    * @param params.noAutoCommit (Optional) when set to true, queries are not committed by this function. Instead the retunred tuple contain the commit and rollback methods for the query
    *  @returns A tuple with data and error objects. If the query is successful the error object is null, otherwise the data object is null. 
    *  Shape - When `noAutoCommit` flag is not set `[{data: T | undefined, count: number}, null] | [null, {message: string, stack?; string}]`
    *          When `noAutoCommit` is set to true `[{data: T | undefined, count: number, null, () => Promise<{success: boolean, transactionStatus?: string}>, () => Promise<{success: boolean, transactionStatus?: string}>}] | [null, {message: string, stack?; string}]`
    * @example
    * ```ts
    * 
    *      const rds = new RdsClientV2();
    *      const params = {
    *          last_updated: moment().format('YYYY-MM-DD'),
    *          uploadId: 12
    *      }
    * 
    *      const paramsSQL = SQLParams<typeof params> = params;
    * 
    *      //Case I: noAutoCommit flag is not set
    *      //updates the last updated field of an upload_job
    *      const [data, error] = 
    *          await rds.mutateOne<typeof paramsSQL, { 
    *              filename: string
    *          }>({
    *              sql: `
    *                  UPDATE upload_jobs 
    *                  SET last_updated = :last_updated
    *                  where uploadId = :uploadId 
    *                  RETURNING filename
    *              `
    *              params: paramsSQL,
    *              typeHintMap: {
    *                  last_updated: 'DATETIME'
    *              },
    *          })
    * 
    *      //Case II: noAutoCommit is set
    *      const [data, error, commit, rollback] = 
    *          await rds.mutateOne<typeof paramsSQL, { 
    *              filename: string
    *          }>({
    *              sql: `
    *                  UPDATE upload_jobs 
    *                  SET last_updated = :last_updated
    *                  where uploadId = :uploadId 
    *                  RETURNING filename
    *              `
    *              params: paramsSQL,
    *              typeHintMap: {
    *                  last_updated: 'DATETIME'
    *              },
    *              noAutoCommit: true
    *          })
    * 
    *          if(err !== null) {
    *              //do error handling
    *          } else {
    *              //Case I:
    *                  //Process the data and exit
    * 
    *              //Case II;
    *              try {
    *                  //Perform some linked transaction
    *                  await commit();
    *              } catch(e) {
    *                  //rollback incase the linked transaction fails
    *                  await rollback()
    *              }
    *          }
    * //
    * ```
    */
    mutateOne<S extends {}, T = undefined>(params: QueryParams<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponse<T | null | undefined>>;
    mutateOne<S extends {}, T = undefined>(params: QueryParamsNAC<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponseNAC<T | null | undefined>>;
    async mutateOne<S extends {}, T = undefined>(
        params: QueryParams<S> | QueryParamsNAC<S>, paramsArray?: readonly unknown[]
    ): Promise<RdsClientResponse<T | null | undefined> | RdsClientResponseNAC<T | null | undefined>> {
        let transactionId = '';

        if (params.transactionId) transactionId = params.transactionId;
        else transactionId = (await this.beginTransaction()).transactionId ?? '';

        try {
            const sqlParams = getSQLParameterFromObject(params.params, params.typeHintMap);
            if (paramsArray) {
                params.sql = prepareStatement(params.sql, Object.keys(params.params));
                console.log(params.sql)
            }

            const records = await this
                .executeStatement({
                    resourceArn: resourceArn,
                    secretArn: secretArn,
                    database: database,
                    sql: params.sql,
                    includeResultMetadata: true,
                    parameters: sqlParams,
                    transactionId,
                });

            if (!('noAutoCommit' in params)) await this.commitTransaction({ transactionId });

            // if(records.length === 0) 
            //     return [{ count: 1, data: undefined}, null];

            const recordOne = records && records[0] && Object.keys(records).length === 0 ? undefined : records[0];


            if (!('noAutoCommit' in params)) return [{ data: recordOne as T, count: 1 }, null];
            else {
                return [
                    { data: recordOne as T, count: 1 },
                    null,
                    this.transactionFnBuilder(transactionId, 'COMMIT'),
                    this.transactionFnBuilder(transactionId, 'ROLLBACK'),
                ];
            }
        } catch (e) {
            if (!('noAutoCommit' in params)) await this.rollbackTransaction({ transactionId });
            const err = e as Error;
            return [null, { message: err.message, stack: err.stack }];
        }
    }

    /** 
     * @description same as `mutateOne`, just returns the entire result set (array of objects) instead of the first result (single object)
     * @param params The parameters to the method
     * @param params.params A JS Object representing the parameters to the prepapred SQL statement. The name of the keys of this object must match the name of the slots for the prepared query exactly
     * @param params.sql   the prepared SQL Query/Statement
     * @param params.typeHintMap (Optional) A JS Object that has the same keys as the params but the values are type hints for the parameters like `JSON, DATETIME, TIMESTAMP, etc.`
     * @param params.noAutoCommit (Optional) when set to true, queries are not committed by this function. Instead the retunred tuple contain the commit and rollback methods for the query
     *  @returns A tuple with data and error objects. If the query is successful the error object is null, otherwise the data object is null. 
     *  Shape - When `noAutoCommit` flag is not set `[{data: T[] | undefined, count: number}, null] | [null, {message: string, stack?; string}]`
     *          When `noAutoCommit` is set to true `[{data: T[] | undefined, count: number, null, () => Promise<{success: boolean, transactionStatus?: string}>, () => Promise<{success: boolean, transactionStatus?: string}>}] | [null, {message: string, stack?; string}, null, null]`
     * @example
     * ```ts
     * 
     *      const rds = new RdsClientV2();
     *      const params = {
     *          last_updated: moment().format('YYYY-MM-DD'),
     *          uploaded_by: 'name@domain.com'
     *      }
     * 
     *      const paramsSQL = SQLParams<typeof params> = params;
     * 
     *      //Case I: noAutoCommit flag is not set
     *      //updates the last updated field of an upload_job
     *      const [data, error] = 
     *          await rds.mutate<typeof paramsSQL, { 
     *              filename: string;
     *              uploadId: number
     *          }>({
     *              sql: `
     *                  UPDATE upload_jobs 
     *                  SET last_updated = :last_updated
     *                  where uploaded_by = :uploaded_by 
     *                  RETURNING filename, uploadId
     *              `
     *              params: paramsSQL,
     *              typeHintMap: {
     *                  last_updated: 'DATETIME'
     *              },
     *          })
     * 
     *      //Case II: noAutoCommit is set
     *      const [data, error, commit, rollback] = 
     *          await rds.mutate<typeof paramsSQL, { 
     *              filename: string
     *          }>({
     *              sql: `
     *                  UPDATE upload_jobs 
     *                  SET last_updated = :last_updated
     *                  where uploadId = :uploadId 
     *                  RETURNING filename
     *              `
     *              params: paramsSQL,
     *              typeHintMap: {
     *                  last_updated: 'DATETIME'
     *              },
     *              noAutoCommit: true
     *          })
     * 
     *          if(err !== null) {
     *              //do error handling
     *          } else {
     *              //Case I:
     *                  //Process the data and exit
     * 
     *              //Case II;
     *              try {
     *                  //Perform some linked transaction
     *                  await commit();
     *              } catch(e) {
     *                  //rollback incase the linked transaction fails
     *                  await rollback()
     *              }
     *          }
     * //
     * ```
     */
    mutate<S extends {}, T = undefined>(params: QueryParams<S>): Promise<RdsClientResponse<T[]>>;
    mutate<S extends {}, T = undefined>(params: QueryParamsNAC<S>): Promise<RdsClientResponseNAC<T[]>>;
    async mutate<S extends {}, T = undefined>(params: QueryParams<S> | QueryParamsNAC<S>): Promise<RdsClientResponse<T[]> | RdsClientResponseNAC<T[]>> {
        let transactionId = '';

        if (params.transactionId) transactionId = params.transactionId;
        else transactionId = (await this.beginTransaction()).transactionId ?? '';

        try {
            const sqlParams = getSQLParameterFromObject(params.params);
            const records = await this
                .executeStatement({
                    resourceArn: resourceArn,
                    secretArn: secretArn,
                    database: database,
                    sql: params.sql,
                    includeResultMetadata: true,
                    parameters: sqlParams,
                })

            if (!('noAutoCommit' in params)) await this.commitTransaction({ transactionId });

            if (!('noAutoCommit' in params)) {
                return [{ data: records as T[], count: records.length }, null];
            } else {
                return [
                    { data: records as T[], count: records.length },
                    null,
                    this.transactionFnBuilder(transactionId, 'COMMIT'),
                    this.transactionFnBuilder(transactionId, 'ROLLBACK')
                ]
            }

        } catch (e) {
            if (!('noAutoCommit' in params)) await this.rollbackTransaction({ transactionId });
            const err = e as Error;
            return [null, { message: err.message, stack: err.stack }];
        }
    }

    beginTransaction(): Promise<BeginTransactionResponse> {
        return this.rds
            .beginTransaction({
                database,
                resourceArn,
                secretArn: secretArn,
            })
            .promise();
    }

    rollbackTransaction(params: { transactionId: string }): Promise<RollbackTransactionResponse> {
        return this.rds
            .rollbackTransaction({
                resourceArn,
                secretArn,
                transactionId: params.transactionId,
            })
            .promise();
    }

    commitTransaction(params: { transactionId: string }): Promise<CommitTransactionResponse> {
        return this.rds
            .commitTransaction({
                resourceArn: resourceArn,
                secretArn: secretArn,
                transactionId: params.transactionId,
            })
            .promise();
    }

    async executeStatement(params: ExecuteStatementRequest) {
        const response = await this.rds.executeStatement(params).promise();

        const records: Record<string, string | number | boolean | null>[] = [];

        let headers: { label: string; type?: string }[] = [];

        if (response.columnMetadata) headers = response.columnMetadata.map((v) => ({ label: v.label ?? '', type: v.typeName }));

        if (response.records) {
            for (const record of response.records) {
                const tempRecord: Record<string, string | number | boolean | null> = {};

                record.forEach((v, i) => {
                    if (v.isNull) tempRecord[headers[i].label] = null;
                    else {
                        const value = Object.values(v)[0];
                        if (headers[i].type && /json/i.test(headers[i].type ?? '')) tempRecord[headers[i].label] = JSON.parse(value);
                        else tempRecord[headers[i].label] = value;
                    }
                });

                records.push(tempRecord);
            }
        }

        return records;
    }

    private transactionFnBuilder(transactionId: string, type: 'COMMIT' | 'ROLLBACK') {
        return async () => {
            const txnFn = type === 'COMMIT' ? this.commitTransaction.bind(this) : this.rollbackTransaction.bind(this);
            try {
                const res = await txnFn({ transactionId });

                return {
                    success: true,
                    transactionStatus: res.transactionStatus,
                };
            } catch (e) {
                const err = e as Error;
                return {
                    success: false,
                    transactionStatus: 'FAILED',
                    message: err.message,
                    stack: err.stack
                };
            }
        };
    }

    static async $transaction(transactions: Promise<RdsClientResponseNAC<any>>[]): Promise<{ success: boolean, data?: any[] }> {
        let success = true;

        const commitFns: (() => Promise<TransactionFnResp>)[] = [];
        const rollbackFns: (() => Promise<TransactionFnResp>)[] = [];

        const dataVals: RdsClientSuccessResp<any>[] = [];

        for (const [idx, txn] of enumerate(transactions)) {
            const [data, err, commit, rollback] = await txn;
            if (err) {
                success = false;
                const rollback_slice = rollbackFns.slice(0, idx - 1);
                const { batches } = generatePaginationData(rollback_slice, 3);
                for (const batch of batches) {
                    const { slice } = batch;
                    await Promise.allSettled(slice.map(v => v()))
                }
            }
            else {
                dataVals.push(data)
                commitFns.push(commit);
                rollbackFns.push(rollback);
            }
        }

        if (success) {
            const { batches } = generatePaginationData(commitFns, 3);
            for (const batch of batches) {
                const { slice } = batch;
                await Promise.allSettled(slice.map(v => v()))
            }
        }

        return { success, data: dataVals }
    }
}

function getSQLParameterFromObject<T extends {}>(params: SQLParams<T>, typeHintMap: SqlTypeHintMap<T> = {}) {
    const entries = Object.entries(params) as [keyof T, any][];

    const sqlParametersList: SqlParameter[] = [];

    for (let [key, val] of entries) {
        if (typeof key === 'symbol') {
            continue;
        } else {
            const keyName = key as string | number;
            const keyField = getFieldType(val);
            if (keyField !== null) {
                let fieldValue = val;
                if (keyField.Field === 'stringValue') {
                    if (keyField.typeHint === 'JSON') {
                        fieldValue = JSON.stringify(val);
                    }
                }
                if (keyField.Field === 'isNull') fieldValue = true;

                const sqlParaTemp: SqlParameter = {
                    name: keyName + '',
                    value: { [keyField.Field]: fieldValue },
                };

                if (keyField.typeHint) sqlParaTemp.typeHint = 'JSON';
                else if (typeHintMap[key]) sqlParaTemp.typeHint = typeHintMap[key];

                sqlParametersList.push(sqlParaTemp);
            }
        }
    }

    return sqlParametersList;
}

function getFieldType(val: unknown): { Field: SqlFieldKeys; typeHint?: string } | null {
    switch (typeof val) {
        case 'number': {
            const numStr = val.toString();
            if (numStr.indexOf('.') > -1) return { Field: 'doubleValue' };
            else return { Field: 'longValue' };
        }
        case 'boolean':
            return { Field: 'booleanValue' };
        case 'string':
            return { Field: 'stringValue' };
        case 'object': {
            if (val === null) return { Field: 'isNull' };
            else if (Array.isArray(val)) {
                if (val.every((v) => typeof v === 'number' || typeof v === 'string')) return { Field: 'arrayValue' };
                else return { Field: 'stringValue', typeHint: 'JSON' };
            } else return { Field: 'stringValue', typeHint: 'JSON' };
        }
        default:
            return null;
    }
}

(async () => {
    const rds = new RdsClientV2();

    const promise1 = rds.mutateOne({
        sql: ``,
        params: {},
        noAutoCommit: true
    });

    const promise2 = rds.mutateOne({
        sql: ``,
        params: {},
        noAutoCommit: true
    });

    const promise3 = rds.mutateOne({
        sql: ``,
        params: {},
        noAutoCommit: true
    });

    await RdsClientV2.$transaction([promise1, promise2, promise3])

})();
