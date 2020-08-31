import jwt from "jsonwebtoken";
import cookie from "cookie";

const createJwtCookie = (userId, email) => {
  // 6. Get the secret key, used to sign the JWT, from an environment variable
  const secretKey = new Buffer(process.env.JWT_SECRET_KEY, "base64").toString(
    "ascii"
  );
};

export { createJwtCookie }