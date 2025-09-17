// Cloudflare R2 (S3 compatible) client helper
// Initializes a minimal S3 client using AWS SDK v3
// Environment variables expected:
// R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, (optional) R2_ENDPOINT, R2_ACCOUNT_ID
// Optional: R2_PUBLIC_BASE_URL for constructing public URLs

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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
  await client.send(new PutObjectCommand({ Bucket, Key, Body, ContentType, ACL: 'public-read' }));
  const base = process.env.R2_PUBLIC_BASE_URL;
  let url;
  if (base) {
    url = `${base.replace(/\/$/, '')}/${Key}`;
  } else {
    // Construct generic R2 URL (may require public bucket or signed URLs)
    // Public access pattern if configured: https://<accountid>.r2.cloudflarestorage.com/<bucket>/<key>
    const endpoint = process.env.R2_ENDPOINT || '';
    url = `${endpoint.replace(/\/$/, '')}/${Bucket}/${Key}`;
  }
  return { url, key: Key };
}

module.exports = { uploadBufferToR2 };
