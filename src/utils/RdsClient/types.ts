import * as RdsDataService from 'aws-sdk/clients/rdsdataservice';

export type ExecuteStatementRequest = RdsDataService.ExecuteStatementRequest;
export type ExecuteStatementResponse = RdsDataService.ExecuteStatementResponse;
// export
export type BeginTransactionResponse = RdsDataService.BeginTransactionResponse;
export type CommitTransactionResponse = RdsDataService.CommitTransactionResponse;
export type RollbackTransactionResponse = RdsDataService.RollbackTransactionResponse;
export type SqlParametersList = RdsDataService.SqlParametersList;
export type SqlParameter = RdsDataService.SqlParameter;
export type SqlField = RdsDataService.Field;
export type SqlFieldList = RdsDataService.FieldList;
export type SqlFieldKeys = keyof SqlField;
export type SqlTypeHint = 'JSON' | 'UUID' | 'TIMESTAMP' | 'DATE' | 'TIME' | 'DECIMAL';

export type SqlTypeHintMap<T extends {}> = {
    [key in keyof T]?: SqlTypeHint;
};

export type SQLParams<T extends {}> = Record<keyof T, number | string | boolean | Record<string, any> | null | Array<number | string>>;

export type QueryParams<T extends {}> = {
    params: SQLParams<T>;
    typeHintMap?: SqlTypeHintMap<T>;
    sql: string;
    transactionId?: string;
};

export type RdsClientSuccessResp<T> = {
    data: T;
    count: number;
};

export type QueryParamsNAC<T extends {}> = QueryParams<T> & {
    noAutoCommit: true;
};

type union<T extends {}> = QueryParams<T> | QueryParamsNAC<T>;
// const ut: union<{ num: string}> = {
//     noAutoCommit: true,
// }

export type RdsClientErrorResp = {
    message: string;
    stack?: string;
};

export type TransactionFnResp = {
    success: boolean;
    transactionStatus?: string;
    message?: string;
    stack?: string;
};

export type RdsClientResponse<T> = [RdsClientSuccessResp<T>, null] | [null, RdsClientErrorResp];
export type RdsClientResponseNAC<T> =
    | [RdsClientSuccessResp<T>, null, () => Promise<TransactionFnResp>, () => Promise<TransactionFnResp>]
    | [null, RdsClientErrorResp, null, null];

export abstract class IRdsClientV2 {
    abstract queryOne<S extends {}, T>(params: QueryParams<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponse<T | null>>;
    abstract query<S extends {}, T>(params: QueryParams<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponse<T[]>>;
    abstract mutateOne<S extends {}, T = undefined>(params: QueryParams<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponse<T | null | undefined>>;
    abstract mutateOne<S extends {}, T = undefined>(params: QueryParamsNAC<S>, paramsArray?: readonly unknown[]): Promise<RdsClientResponseNAC<T | null | undefined>>;
    abstract mutateOne<S extends {}, T = undefined>(
        params: QueryParams<S> | QueryParamsNAC<S>, paramsArray?: readonly unknown[]
    ): Promise<RdsClientResponse<T | null | undefined> | RdsClientResponseNAC<T | null | undefined>>;
    abstract mutate<S extends {}, T = undefined>(params: QueryParams<S>): Promise<RdsClientResponse<T[]>>;
    abstract mutate<S extends {}, T = undefined>(params: QueryParamsNAC<S>): Promise<RdsClientResponseNAC<T[]>>;
    abstract mutate<S extends {}, T = undefined>(
        params: QueryParams<S> | QueryParamsNAC<S>,
    ): Promise<RdsClientResponse<T[]> | RdsClientResponseNAC<T[]>>;

    static $transaction(transactions: Promise<RdsClientResponseNAC<any>>): Promise<{ success: boolean, data?: any[] }> {
        return Promise.resolve({ success: true, data: [] })
    }


}

