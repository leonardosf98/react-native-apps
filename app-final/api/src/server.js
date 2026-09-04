import { serve } from "@hono/node-server";
import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3001);
const app = await createApp();

serve({ fetch: app.fetch, port }, () => {
  console.log(`Aether Desk API em http://localhost:${port}`);
});
