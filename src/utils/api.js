// Creating a new instance of axios for custom API config.
import axios from "axios";

import { API_BASE_URL } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  responseType: "json",
});

api.defaults.headers.common["Content-Type"] = "application/json";

export default api;
