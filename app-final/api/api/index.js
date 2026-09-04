import { getApp } from "../src/app.js";

export default {
  async fetch(request) {
    const app = await getApp();
    return app.fetch(request);
  },
};
