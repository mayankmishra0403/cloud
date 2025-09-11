import { Client, Account, Storage, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('68c1346300150f2e3683'); // Replace with your project ID

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
