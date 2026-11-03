import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db("frameora");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "frameora_secret_session_key_2026",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.BETTER_CLIENT_ID || "",
      clientSecret: process.env.BETTER_AUTH_CLIENT_SECRET || "",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
