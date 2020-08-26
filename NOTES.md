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

## Creating the API

## Getting user information locally

## Creating a simple client in React

## Conclusion

## References