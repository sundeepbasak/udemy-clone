import { ACCESS_KEY_ID_2, BUCKET_NAME_2, REGION_2, SECRET_ACCESS_KEY_2, URL_EXPIRY_MINS } from "@/constants/config.constants";
import { AwsS3BucketService } from "@/lib/s3.aws.lib";
import * as uuid from 'uuid';

const s3BucketService = new AwsS3BucketService(ACCESS_KEY_ID_2, SECRET_ACCESS_KEY_2, REGION_2, BUCKET_NAME_2, URL_EXPIRY_MINS);

class FileService {
    //get pre-signed url for upload
    async getPresignedUrlForUpload(folderName: string) {
        try {
            return s3BucketService.generateUploadUrl(folderName);
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    //get pre-signed url for viewing
    async getPresignedUrlForDownload(key: string) {
        try {
            return s3BucketService.generateDownloadUrl(key);
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    //upload file directly to S3
    async uploadFile(file: File) {
        const fileSize = file.size;
        const fileContent = file.type;
        const fileKey = uuid.v4() + file.name.split(" ").join("-").toLowerCase();
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes);

        try {
            const fileUrl = await s3BucketService.uploadFileToS3(fileKey, buffer, fileContent);
            console.log('fileURl', fileUrl)
            return fileUrl;
        } catch (error) {
            console.error(error)
        }
    }

    //delete file from s3
    async deleteFile(fileKey: string) {
        try {
            const result = await s3BucketService.deleteFileFromS3(fileKey);
            console.log({ result })
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}

export const fileService = new FileService()