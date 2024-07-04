import express, { Response } from "express";
import Path from "path";
import { Context, OpenAPIBackend, Request } from "openapi-backend";

export function appFactory() {
  const app = express();

  app.use(express.json());

  function validationFailHandler(c: Context, req: Request, res: Response) {
    const errors = c.validation.errors;
    return res.status(400).json({ status: 400, errors });
  }

  // api.register("validationFail", validationFailHandler);
  const api = new OpenAPIBackend({
    definition: Path.join(__dirname, `../public/openapi.yaml`),
    handlers: {
      validationFail: validationFailHandler,
      hello: (c, req: Request, res: Response) => {
        return res.send("Hello, World!");
      },
      enterData: (c, req: Request, res: Response) => {
        return res.send(req.body);
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.use((req, res) => api.handleRequest(req as Request, req, res));

  return app;
}
