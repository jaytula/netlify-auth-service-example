import { createClient } from "../helpers/db-helper";
import bcrypt from "bcryptjs";
import { createJwtCookie } from "../helpers/jwt-helper";

export const handler = async event => {
  const dbClient = createClient();
  let errorStatusCode = 500;
  try {
    // 1. Connect to the database and get a reference to the `users` collection
    await dbClient.connect();
    const users = dbClient.usersCollection();

    // 2. Get the email and password from the request body
    const { email, password } = JSON.parse(event.body);

    // 3. Check to see if the user exists, if not return error (401 Unauthorized)
    const existingUser = await users.findOne({ email });
    if (existingUser == null) {
      errorStatusCode = 401;
      throw new Error("Invalid password or email");
    }

    // 4. Compare the password, if it doesn't match return error (401 Unauthorized)
    const matches = await bcrypt.compare(password, existingUser.password);
    if (!matches) {
      console.log('got in here');
      errorStatusCode = 401;
      throw new Error("Invalid password or email");
    }

    // 5. Create a JWT and serialize as a secure http-only cookie
    const userId = existingUser._id;
    const jwtCookie = createJwtCookie(userId, email);

    // 6. Return the user id and a Set-Cookie header with the JWT cookie
    return {
      headers: {
        "Set-Cookie": jwtCookie,
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      body: JSON.stringify({ id: userId, email }),
    };
  } catch (err) {
    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
