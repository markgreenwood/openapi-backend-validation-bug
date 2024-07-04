import express from "express";

export function appFactory() {
  const app = express();

  app.use(express.json());

  app.get("/hello", (req, res) => {
    res.send("Hello, World!");
  });

  app.post("/enterData", (req, res) => {
    res.send(req.body);
  });

  return app;
}
