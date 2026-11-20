import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";


const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-cny9clf-shard-00-00.ilfvfer.mongodb.net:27017,ac-cny9clf-shard-00-01.ilfvfer.mongodb.net:27017,ac-cny9clf-shard-00-02.ilfvfer.mongodb.net:27017/?ssl=true&replicaSet=atlas-r83rr3-shard-0&authSource=admin`);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  //...other options
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
       additionalFields: {
          role: {
              type: ["owner" , "customer"],
              input: false,
              defaultValue:"customer"
            } 
        }
    },

  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: { 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  }, 
});