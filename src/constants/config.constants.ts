export const JWT_SECRET = process.env.NEXTAUTH_SECRET

export const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID!;
export const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY!;
export const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
export const REGION = process.env.S3_REGION!
export const URL_EXPIRY_MINS = Number(process.env.S3_URL_EXPIRY_MINS!);

export const SECRET_ARN = process.env.AWS_SECRET_ARN!;
export const RESOURCE_ARN = process.env.AWS_RESOURCE_ARN!;

export const RDS_USERNAME = process.env.RDS_USERNAME!
export const RDS_PASSWORD = process.env.RDS_PASSWORD!
export const RDS_ENGINE = process.env.RDS_ENGINE!
export const RDS_HOST = process.env.RDS_HOST!
export const RDS_PORT = Number(process.env.RDS_PORT!);
export const RDS_DBCLUSTERIDENTIFIER = process.env.RDS_DBCLUSTERIDENTIFIER!
export const RDS_DB_NAME = process.env.RDS_DB_NAME!

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!


//different s3
export const ACCESS_KEY_ID_2 = process.env.S3_ACCESS_KEY_ID_2!;
export const SECRET_ACCESS_KEY_2 = process.env.S3_SECRET_ACCESS_KEY_2!;
export const BUCKET_NAME_2 = process.env.S3_BUCKET_NAME_2!;
export const REGION_2 = process.env.S3_REGION_2!

export const REDIS_URL = process.env.REDIS_URL!;


export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!