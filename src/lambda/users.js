import cookie from "cookie";
import { publicKey } from "../helpers/jwt-helper";
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
