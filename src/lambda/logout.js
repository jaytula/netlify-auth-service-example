import { clearCookie } from "../helpers/jwt-helper";

export const handler = () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearCookie(),
    },
    body: JSON.stringify({
      message: "Logged out successfully",
    }),
  };
};
