import * as aws from 'aws-sdk'
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
import * as uuid from 'uuid'


interface IAwsS3BucketService {
    uploadFileToS3(fileKey: string, fileContent: Buffer, contentType: string): Promise<string>;
    deleteFileFromS3(fileKey: string): void
    generateUploadUrl: (path: string) => { key: string, url: string }
    generateDownloadUrl: (key: string) => { key: string, url: string }
}

export class AwsS3BucketService implements IAwsS3BucketService {
    private s3;
    private bucketName;
    private signedUrlExpiryInSeconds: number;

    constructor(accessKeyId: string, secretAccessKey: string, region: string, bucketName: string, url_expiry_in_mins: number) {
        this.s3 = new aws.S3({
            accessKeyId,
            secretAccessKey,
            region,
            signatureVersion: 'v4'
        })
        this.bucketName = bucketName;
        this.signedUrlExpiryInSeconds = 60 * url_expiry_in_mins
    }

    async uploadFileToS3(fileKey: string, fileContent: Buffer, contentType: string): Promise<string> {
        try {
            const params: aws.S3.PutObjectRequest = {
                Bucket: this.bucketName,
                Key: fileKey,
                Body: fileContent,
                ContentType: contentType,
                ACL: 'public-read',
            };

            const uploadResult: aws.S3.ManagedUpload.SendData = await this.s3.upload(params).promise();
            return uploadResult.Location;
        } catch (error: any) {
            throw new Error('Error uploading file to s3', error.message);
        }
    }

    async deleteFileFromS3(fileKey: string) {
        try {
            const params: aws.S3.DeleteObjectRequest = {
                Bucket: this.bucketName,
                Key: fileKey,
            };

            const deleteResponse: aws.S3.DeleteObjectOutput = await this.s3.deleteObject(params).promise();
            return deleteResponse;
        } catch (error) {
            console.error('Error deleting file from s3', error);
            throw error;
        }
    }

    generateUploadUrl(path: string) {
        path = path ?? ""  //course-1
        const key = `${path}/${uuid.v4()}`;

        const url = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: this.signedUrlExpiryInSeconds,
            ContentType: "application/octet-stream"
        })
        return { key, url }
    }

    generateDownloadUrl(key: string) {
        const url = this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: this.signedUrlExpiryInSeconds
        })
        return { key, url }
    }
}