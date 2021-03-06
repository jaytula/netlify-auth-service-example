import jwt from "jsonwebtoken";
import cookie from "cookie";

const createJwtCookie = (userId: string, email: string) => {
  // 6. Get the secret key, used to sign the JWT, from an environment variable
  const secretKey = Buffer.from(process.env.JWT_SECRET_KEY as string, "base64").toString(
    "ascii"
  );

  // 7. Create a JWT with the registered user and email as the payload
  const token = jwt.sign({ userId, email }, secretKey, {
    algorithm: "RS256",
    expiresIn: "100 days",
  });

  // 8. Serialize the JWT in a secure http-only cookie
  const jwtCookie = cookie.serialize("jwt", token, {
    secure: true,
    httpOnly: true,
    path: "/"
  })

  return jwtCookie;
};

const clearCookie = () => {
  return "jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

const publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY as string, 'base64').toString('ascii');

export { createJwtCookie, clearCookie, publicKey };
