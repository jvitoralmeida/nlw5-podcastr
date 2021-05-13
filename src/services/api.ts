import axios from "axios";

export const api = axios.create({
  baseURL: "https://nlw5-api-podcastr.herokuapp.com",
});
