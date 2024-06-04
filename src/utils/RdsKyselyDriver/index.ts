import { DatabaseConnection, Driver } from "kysely";

import { RDS_DB_NAME, REGION, RESOURCE_ARN, SECRET_ARN } from "@/constants/config.constants";
import * as AWS from 'aws-sdk';

export type BeginTransactionResponse = AWS.RDSDataService.BeginTransactionResponse;

const awsRegion = REGION;
const resourceArn = RESOURCE_ARN;
const secretArn = SECRET_ARN
const database = RDS_DB_NAME;


interface IRDSKyselyDriver extends Driver {
    beginTransaction: () => Promise<any>
}

export class RDSKyselyDriver implements IRDSKyselyDriver {
    private rds: AWS.RDSDataService;

    constructor() {
        this.rds = new AWS.RDSDataService({
            region: REGION,
            httpOptions: { connectTimeout: 1 * 60 * 1000, timeout: 3 * 60 * 1000 }
        })
    }

    init(): Promise<void> {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }

    acquireConnection(): Promise<DatabaseConnection> {
        return {} as any
    }

    /**
     * Begins a transaction.
     */
    beginTransaction(): Promise<any> {
        console.log("begin transaction hit....")
        // const { isolationLevel } = settings;

        return this.rds.beginTransaction({
            database,
            resourceArn,
            secretArn
        }).promise()
    }

    /**
     * Commits a transaction.
     */
    commitTransaction(connection: DatabaseConnection): Promise<void> {
        return {} as any
    }
    /**
     * Rolls back a transaction.
     */
    rollbackTransaction(connection: DatabaseConnection): Promise<void> {
        return {} as any
    }
    /**
     * Releases a connection back to the pool.
     */
    releaseConnection(connection: DatabaseConnection): Promise<void> {
        return {} as any
    }
    /**
     * Destroys the driver and releases all resources.
     */
    destroy(): Promise<void> {
        return {} as any
    }
}

