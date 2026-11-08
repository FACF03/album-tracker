
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [
      react(),
      {
        name: "local-api",
        configureServer(server) {
          server.middlewares.use("/api", async (req, res) => {
            try {
              const url = new URL(req.url, "http://localhost");
              const name = url.pathname.replace(/^\/+|\/+$/g, "");

              if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid API route." }));
                return;
              }

              req.query = Object.fromEntries(url.searchParams.entries());

              if (req.method !== "GET" && req.method !== "HEAD") {
                const chunks = [];

                for await (const chunk of req) {
                  chunks.push(chunk);
                }

                const rawBody = Buffer.concat(chunks).toString("utf8");
                req.body = rawBody ? JSON.parse(rawBody) : {};
              }

              res.status = (code) => {
                res.statusCode = code;
                return res;
              };

              res.json = (data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
              };

              const mod = await server.ssrLoadModule(`/api/${name}.js`);
              await mod.default(req, res);

              if (!res.writableEnded) {
                res.end();
              }
            } catch (error) {
              console.error("API error:", error);

              if (!res.writableEnded) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Internal server error." }));
              }
            }
          });
        },
      },
    ],
  };
});
