import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";

type StorageProvider = "s3" | "supabase";

function getStorageProvider(): StorageProvider {
  return (process.env.STORAGE_PROVIDER as StorageProvider | undefined) ?? "supabase";
}

function getS3Config() {
  return {
    bucket: process.env.STORAGE_BUCKET ?? "",
    region: process.env.STORAGE_REGION ?? "auto",
    endpoint: process.env.STORAGE_ENDPOINT,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
  };
}

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL ?? "",
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SECRET_KEY ??
      "",
    bucket: process.env.SUPABASE_STORAGE_BUCKET ?? process.env.STORAGE_BUCKET ?? "",
  };
}

function getS3Client() {
  const config = getS3Config();

  return new S3Client({
    region: config.region,
    endpoint: config.endpoint || undefined,
    credentials:
      config.accessKeyId && config.secretAccessKey
        ? {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          }
        : undefined,
  });
}

function getSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config.url || !config.serviceRoleKey) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getSignedUploadUrl(key: string, contentType: string) {
  if (getStorageProvider() === "supabase") {
    const supabase = getSupabaseClient();
    const config = getSupabaseConfig();

    if (!supabase) {
      throw new Error("Supabase storage is not configured.");
    }

    const { data, error } = await supabase.storage
      .from(config.bucket)
      .createSignedUploadUrl(key, {
        upsert: true,
      });

    if (error || !data) {
      throw error ?? new Error("Unable to create Supabase signed upload URL.");
    }

    return {
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
      contentType,
      provider: "supabase",
    };
  }

  const config = getS3Config();
  const client = getS3Client();

  const signedUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 },
  );

  return {
    signedUrl,
    path: key,
    provider: "s3",
  };
}

export async function getSignedReadUrl(key: string) {
  if (getStorageProvider() === "supabase") {
    const supabase = getSupabaseClient();
    const config = getSupabaseConfig();

    if (!supabase) {
      throw new Error("Supabase storage is not configured.");
    }

    const { data, error } = await supabase.storage
      .from(config.bucket)
      .createSignedUrl(key, 120);

    if (error || !data?.signedUrl) {
      throw error ?? new Error("Unable to create Supabase signed read URL.");
    }

    return data.signedUrl;
  }

  const config = getS3Config();
  const client = getS3Client();

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
    { expiresIn: 120 },
  );
}

export async function deletePrivateObject(key: string) {
  if (getStorageProvider() === "supabase") {
    const supabase = getSupabaseClient();
    const config = getSupabaseConfig();

    if (!supabase) {
      throw new Error("Supabase storage is not configured.");
    }

    const { error } = await supabase.storage.from(config.bucket).remove([key]);

    if (error) {
      throw error;
    }

    return;
  }

  const config = getS3Config();
  const client = getS3Client();

  return client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
}

export function isStorageConfigured() {
  if (getStorageProvider() === "supabase") {
    const config = getSupabaseConfig();
    return Boolean(config.url && config.serviceRoleKey && config.bucket);
  }

  const config = getS3Config();

  return Boolean(
    config.bucket &&
      config.region &&
      config.accessKeyId &&
      config.secretAccessKey,
  );
}
