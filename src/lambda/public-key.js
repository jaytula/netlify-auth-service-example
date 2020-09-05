import { publicKey } from "../helpers/jwt-helper";

export const handler = () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
    },
    body: publicKey,
  };
};
