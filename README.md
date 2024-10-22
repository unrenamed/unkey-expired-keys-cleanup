# Batch Management of Expired Unkey API Keys

This lightweight toolkit enables you to seed your [Unkey API](https://www.unkey.com/docs/api-reference/keys/create) with expired keys and showcases how to effortlessly clean them up in one swift command. Enhanced with a visually appealing terminal progress bar, it offers real-time feedback during the cleanup process, ensuring you can manage expired API keys efficiently.

## Quickstart Guide

### Create a Unkey Root Key

1. Navigate to [Unkey Root Keys](https://app.unkey.com/settings/root-key) and click **"Create New Root Key"**.
2. Name your root key.
3. Select the following workspace permissions:
   - `create_key`
   - `read_key`
   - `encrypt_key`
   - `decrypt_key`
4. Click **"Create"** and save your root key securely.

### Create a Unkey API

1. Go to [Unkey APIs](https://app.unkey.com/apis) and click **"Create New API"**.
2. Enter a name for the API.
3. Click **"Create"**.

### Run the example locally

1. Clone the repository to your local machine:

   ```bash
   git clone git@github.com:unrenamed/unkey-expired-keys-cleanup
   cd unkey-expired-keys-cleanup
   ```

2. Create a `.env` file in the root directory and populate it with the following environment variables:

   ```env
   UNKEY_ROOT_KEY=your-unkey-root-key
   UNKEY_API_ID=your-unkey-api-id
   ```

   Ensure you replace `your-unkey-*` with your actual Unkey credentials.

3. Seed your API with **500** expired API keys in batches:

   ```bashF
   pnpm dev:seed
   ```

   Open [seed.ts](./src/seed.ts) to refine the batch size and total keys number.

4. Delete all expired keys from your API in batches:

   ```bashF
   pnpm dev:cleanup
   ```

   Open [cleanup.ts](./src/cleanup.ts) to refine the batch size.
