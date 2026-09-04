import { handle } from "@hono/node-server/vercel";
import { createApp } from "../src/app.js";

export const config = { maxDuration: 30 };

let handlerPromise;

function getHandler() {
  if (!handlerPromise) {
    handlerPromise = createApp().then((app) => handle(app));
  }
  return handlerPromise;
}

export default async function handler(req, res) {
  const h = await getHandler();
  return h(req, res);
}
