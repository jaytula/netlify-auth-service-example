import { MongoClient } from "mongodb";
require('saslprep');

const dbName = "jwt-authentication-example";

function createClient() {
  const client = new MongoClient(
    // REPLACE WITH YOUR CONNECTION STRING
    process.env.MONGODB_URL as string,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  return client;
}

const usersCollection = (client: MongoClient) => {
  return client.db(dbName).collection("users");
}

export { createClient, usersCollection };
