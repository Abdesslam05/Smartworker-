import AWS from 'aws-sdk';
import { env } from '../config/env';

const s3 = new AWS.S3({
  accessKeyId: env.aws.accessKeyId,
  secretAccessKey: env.aws.secretAccessKey,
  region: env.aws.region,
});

export const uploadBufferToS3 = async (key: string, buffer: Buffer, contentType: string) => {
  if (!env.aws.s3Bucket) {
    throw new Error('S3 bucket is not configured');
  }

  await s3
    .upload({
      Bucket: env.aws.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    })
    .promise();

  return `https://${env.aws.s3Bucket}.s3.${env.aws.region}.amazonaws.com/${key}`;
};
