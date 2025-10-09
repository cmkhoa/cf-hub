// Cloudflare R2 (S3 compatible) client helper
// Initializes a minimal S3 client using AWS SDK v3
// Environment variables expected:
// R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, (optional) R2_ENDPOINT, R2_ACCOUNT_ID
// Optional: R2_PUBLIC_BASE_URL for constructing public URLs

const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

function getR2Client() {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);
  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error('R2 storage not fully configured (missing access key / secret / endpoint)');
  }
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function uploadBufferToR2({ Key, Body, ContentType }) {
  const Bucket = process.env.R2_BUCKET;
  if (!Bucket) throw new Error('R2_BUCKET not set');
  const client = getR2Client();
  // R2 does not support ACL; bucket policy controls public access
  await client.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
  const url = getPublicUrl(Key);
  return { url, key: Key };
}

async function deleteObjectFromR2({ Key }) {
  const Bucket = process.env.R2_BUCKET;
  if (!Bucket) throw new Error('R2_BUCKET not set');
  const client = getR2Client();
  await client.send(new DeleteObjectCommand({ Bucket, Key }));
  return true;
}

function getPublicUrl(Key) {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (base) {
    return `${base.replace(/\/$/, '')}/${Key}`;
  }
  const endpoint = process.env.R2_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined) || '';
  const bucket = process.env.R2_BUCKET || '';
  return `${endpoint.replace(/\/$/, '')}/${bucket}/${Key}`;
}

async function getObjectFromR2({ Key }) {
  const Bucket = process.env.R2_BUCKET;
  if (!Bucket) throw new Error('R2_BUCKET not set');
  const client = getR2Client();
  const resp = await client.send(new GetObjectCommand({ Bucket, Key }));
  // resp.Body is a stream; ContentType may be present
  return {
    Body: resp.Body,
    ContentType: resp.ContentType || 'application/octet-stream',
    ContentLength: resp.ContentLength,
    ETag: resp.ETag,
  };
}

module.exports = { uploadBufferToR2, deleteObjectFromR2, getPublicUrl, getObjectFromR2 };
