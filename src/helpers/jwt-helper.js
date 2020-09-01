import jwt from "jsonwebtoken";
import cookie from "cookie";

const createJwtCookie = (userId, email) => {
  // 6. Get the secret key, used to sign the JWT, from an environment variable
  const secretKey = new Buffer(process.env.JWT_SECRET_KEY, "base64").toString(
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

export { createJwtCookie };
