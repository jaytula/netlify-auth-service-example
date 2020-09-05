# Netlify Auth Service Example

- Tutorial: https://dev.to/soeholm/build-an-authentication-service-with-netlify-functions-41hi
- Repo: https://github.com/mathiassoeholm/jwt-authentication-example

## JSON Web Token (JWT)

- Stateless authentication
- Hard to revoke JWTs
- Revoking requires making it stateful

## The web app

- We wwill create a `useAuth` hook

**Snippet of usage**

```jsx
import React from "react"
import { UnauthenticatedApp } from "./UnauthenticatedApp"
import { AuthenticatedApp } from "./AuthenticatedApp"
import { useAuth } from "./providers/auth-provider"

function App() {
  const { user } = useAuth()
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default App
```

```jsx
export function Login() {
  const { login } = useAuth()

  const inputs = [
    {
      name: "email",
      type: "email",
    },
    {
      name: "password",
      type: "password",
    },
  ]

  return (
    <div>
      <Form title="Login" onSubmit={login} inputs={inputs} />
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  )
}
```

## Getting started

### Initialize the repo with create-react-app

```
npx react-react-app netlify-auth-service-example
```

### Set up Netlify Functions workflow

- Create `netlify.toml` and add section `[build]` with `functions = "built-lambda"`
- Install npm packages as devDependencies: `npm i netlify-lambda npm-run-all -D`
- Update package.json build scripts:

```json
{
  "build": "run-p build:**",
  "build:app": "react-scripts build",
  "build:lambda": "netlify-lambda build src/lambda"
}
```

- Create folder at `src/lambda`
- Add lambda function at `src/lambda/hello.js`:

```js
export async function handler() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
    },
    body: "Hello There!",
  }
}
```
- Add `/build-lambda` to `.gitignore`
- Check the endpoint `/.netlify/functions/hello` is working

## Creating the API

### Signup

- Created `docker-compose.yml` with a mongodb service
- Add env var `MONGODB_URL` to `.env`: `mongodb://username:password@localhost:37017/auth-service-example`
- `npm i mongodb`
- Create file `src/helpers/db-helper.js` to connect to database which is common need for signup and login

```js
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
```

- Create lambda function `src/lambda/signup.js`:

```js
export async function handler(event) {
  let errorStatusCode = 500

  try {
  } catch (err) {
    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({ msg: err.message }),
    }
  } finally {
  }
}
```

- Update the `signup.js` to use the helper as follows:

```js
import { createClient } from "../helpers/db-helper";

export async function handler(event) {
  const dbClient = createClient()
  let errorStatusCode = 500

  try {
    // 1. Connect to the database and get a reference to the `users` collection
    await dbClient.connect()
    const users = dbClient.usersCollection()
  } catch (err) {
    ...
  } finally {
    // Remember to close the database connection
    dbClient.close()
  }
}
```

- Step 2 is to get email and password from the request.body

```js
const { email, password } = JSON.parse(event.body)
```

- Step 3 is to check if user already exists

```js
// 3. Check to see if the user already exists, if so return error (409 Conflict)
const existingUser = await users.findOne({ email })
if (existingUser !== null) {
  errorStatusCode = 409
  throw new Error(`A user already exists with the email: ${email}`)
}
```

- Install bcryptjs with `npm i bcryptjs`

- Step 4 is hashing the password

```js
// 4. Get a salted hash of the password
const passwordHash = await bcrypt.hash(password, 10);
```

- Step 5 is insert into the 'users' collection

```js
// 5. Insert the email and the hashed password in the `users` collection
const { insertedId } = await users.insertOne({
  email,
  password: passwordHash,
})
```

- Figure out base64 encoding and decoding for environment variables:

Refer to here: https://github.com/jaytula/netlify-functions-workshop/blob/c4b2ccf32a2f5130c5036e0b210650bb8435b28c/lessons/core-concepts/6-using-a-database/NOTES.md#google-sheets

**Decoding**

```js
var cert = new Buffer(process.env.HTTPS_CA_CERTIFICATE, 'base64').toString('ascii');
```

- Create public/private keypair

```shell
ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

**From command-line**

```shell
base64 -w 0 somefile.key
base64 -w 0 somefile.key | base64 --decode
```

- Store base64-encoded private key in env var `JWT_SECRET_KEY`
- Create new file `src/helpers/jwt-helper.js`
- install npm packages: `jsonwebtoken` `cookie`
- Create helper function `createJwtCookie(userId, email)` in new file and export it as a named export

Steps 6, 7, 8 are in `jwt-helper.js`

### Login

```
// 1. Connect to the database and get a reference to the `users` collection
// 2. Get the email and password from the request body
// 3. Check to see if the user exists, if not return error (401 Unauthorized)
// 4. Compare the password, if it doesn't match return error (401 Unauthorized)
// 5. Create a JWT and serialize as a secure http-only cookie
// 6. Return the user id and a Set-Cookie header with the JWT cookie
```

#### Testing with Postman

- Startup mongodb container with `docker-compose up`
- Check with Compass what is in it
- Setup up tunnel with `lt -h https://serverless.social -p 8888 some-fixed-name
- Run `netlify dev`
- Endpoint is `/.netlify/functions/login` Send JSON body with `email` and `password`

### Logout

create `clearCookie` in `jwt-helper.js`

```js
const clearCookie = () => {
  return "jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}
```

**src/lambda/logout.js**

```js
import { clearCookie } from '../helpers/jwt-helper'

export const handler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": clearCookie(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: "Logged out successfully" })
  }
}
```

### A protected endpoint

The users endpoint at `src/lambda/users.js`:

**/.netlify/functions/users**

```js
import cookie from "cookie";
import { publicKey } from "./jwt-helpers";
import jwt from "jsonwebtoken";

export const handler = async event => {
  const cookies = event.headers.cookie && cookie.parse(event.headers.cookie);

  if (!cookies || !cookies.jwt) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        msg: "There is no jwt cookie, so the request is unauthorized",
      }),
    };
  }

  try {
    const payload = jwt.verify(cookies.jwt, publicKey);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        body: JSON.stringify({
          userId: payload.userId,
          email: payload.email,
        }),
      },
    };
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ msg: err.message }) };
  }
};
```

## Getting user information locally

## Creating a simple client in React

## Conclusion

## References