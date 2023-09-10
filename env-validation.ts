import { plainToClass } from 'class-transformer';
import { IsNumberString, IsString, validateSync } from 'class-validator';

class EnvValidation {
  @IsString()
  POSTGRES_HOST: string;
  @IsNumberString()
  POSTGRES_PORT: string;
  @IsString()
  POSTGRES_USERNAME: string;
  @IsString()
  POSTGRES_PASSWORD: string;
  @IsString()
  POSTGRES_DATABASE: string;
  @IsString()
  MODE: string;
  @IsString()
  RUN_MIGRATIONS: string;
  @IsString()
  PORT: string;
  @IsString()
  SECRET: string;
  @IsString()
  LOGIN_EXPIRE: string;
  @IsString()
  AWS_ACCESS_KEY_ID: string;
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;
  @IsString()
  AWS_REGION: string;
  @IsString()
  AWS_S3_BUCKET_NAME: string;
  @IsString()
  CDN_DOMAIN: string;
  @IsString()
  CDN_SUFFIX: string;
  @IsString()
  NODE_ENV: string;
}

export const validate = (config: Record<string, unknown>) => {
  // `plainToClass` to converts plain object into Class
  const validatedConfig = plainToClass(EnvValidation, config, {
    enableImplicitConversion: true
  });

  // `validateSync` method validate the class and returns errors
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
