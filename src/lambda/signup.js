import { createClient } from "../helpers/db-helper";
import bcrypt from "bcryptjs";

export async function handler(event) {
  const dbClient = createClient();
  let errorStatusCode = 500;

  try {
    // 1. Connect to the database and get a reference to the `users` collection
    await dbClient.connect();
    const users = dbClient.usersCollection();

    // 2. Get the email and password from the request body
    const { email, password } = JSON.parse(event.body);

    // 3. Check to see if the user already exists, if so return error (409 Conflict)
    const existingUser = await users.findOne({ email });
    if (existingUser !== null) {
      errorStatusCode = 409;
      throw new Error(`A user already exists with the email: ${email}`);
    }

    // 4. Create password hash
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Insert user into collection
    const { insertedId } = await users.insertOne({
      email,
      password: passwordHash,
    });
  } catch (err) {
    // ...
  } finally {
    // Remember to close the database connection
    dbClient.close();
  }
}
