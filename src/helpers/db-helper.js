import { MongoClient } from "mongodb"

const dbName = "jwt-authentication-example"

function createClient() {
  const client = new MongoClient(
    // REPLACE WITH YOUR CONNECTION STRING
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  // We add a usersCollection function to the client object,
  // this way neither login or signup need to know the name
  // of the database or the users collection.
  client.usersCollection = function() {
    return this.db(dbName).collection("users");
  }

  return client
}

export { createClient }