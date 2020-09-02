import { createClient } from "../helpers/db-helper";

export const handler = async event => {
  const dbClient = createClient();
  let errorStatusCode = 500;
  try {
    // 1. Connect to the database and get a reference to the `users` collection
    await dbClient.connect();
    const users = dbClient.usersCollection();
  } catch (err) {
    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
