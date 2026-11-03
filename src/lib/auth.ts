import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db("frameora");

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://frameora-delta.vercel.app";
  }
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "frameora_secret_session_key_2026",
  baseURL: getBaseURL(),
  trustedOrigins: [
    "https://frameora-delta.vercel.app",
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL || "",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ].filter(Boolean),
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
