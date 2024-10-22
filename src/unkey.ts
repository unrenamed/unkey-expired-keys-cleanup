import { Unkey } from "@unkey/api";
import * as dotenv from "dotenv";

dotenv.config();

const unkey = new Unkey({
  rootKey: process.env.UNKEY_ROOT_KEY!,
  cache: "no-cache",
});

export const createExpiredApiKey = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return unkey.keys.create({
    apiId: process.env.UNKEY_API_ID!,
    prefix: "old",
    ownerId: "anonymous",
    expires: yesterday.getTime(),
  });
};

export const getAllApiKeys = async ({
  limit = 10,
  cursor,
}: {
  limit: number;
  cursor?: string;
}) => {
  return unkey.apis.listKeys({
    limit,
    cursor,
    revalidateKeysCache: true,
    apiId: process.env.UNKEY_API_ID!,
  });
};

export const deleteApiKey = async (keyId: string) => {
  return unkey.keys.delete({ keyId });
};
