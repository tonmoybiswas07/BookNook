
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(mongoURI);
const db = client.db("BookNookDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    jwt({
      jwt: {
        issuer:
          process.env.JWT_ISSUER ||
          "http://localhost:3000",

        audience:
          process.env.JWT_AUDIENCE ||
          "booknook-api",
      },
    }),
  ],
});
