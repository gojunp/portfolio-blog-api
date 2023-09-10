export interface IDataStorageService {
  getS3Instance(): AWS.S3;
}

export const IDataStorageServiceToken = Symbol('IDataStorageService');
