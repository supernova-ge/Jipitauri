import { io } from "socket.io-client";
import { API_ENDPOINT } from "../config/url";

const setUpSocketClient = () => {
  const client = io(`${API_ENDPOINT}`);
  return client;
};

export { setUpSocketClient };
