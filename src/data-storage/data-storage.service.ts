import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { WinstonLoggerService } from '../common/loggers/winston-logger.service';

@Injectable()
export class DataStorageService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {
    AWS.config.update({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION')
    });
  }

  async uploadToStorage(
    key: string,
    file: Express.Multer.File
  ): Promise<string> {
    const s3 = this.getS3Instance();
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const domainName = this.configService.get<string>('CDN_DOMAIN');

    // Define the parameters for S3 upload
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer, // The file data
      ACL: 'public-read', // or 'private' as needed
      ContentType: file.mimetype
    };

    try {
      // Upload the file to S3
      await s3.upload(params).promise();

      // Return the S3 URL for the uploaded file
      return `https://${domainName}/${key}`;
    } catch (error) {
      this.logger.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteFromStorage(key: string): Promise<void> {
    const s3 = this.getS3Instance();
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      this.logger.error('Error deleting object from S3:', error);
      throw new Error('Failed to delete object from S3');
    }
  }

  getS3Instance(): AWS.S3 {
    return new AWS.S3();
  }
}
