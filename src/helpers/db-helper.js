import { MongoClient } from "mongodb"

const dbName = "jwt-authentication-example"

function createClient() {
  const client = new MongoClient(
    // REPLACE WITH YOUR CONNECTION STRING
    `mongodb+srv://your-username:${process.env.MONGODB_PASSWORD}@cluster0-abcdef.mongodb.net/test?retryWrites=true&w=majority`,
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