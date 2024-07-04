import express, { Response } from "express";
import Path from "path";
import { OpenAPIBackend, Request } from "openapi-backend";

export function appFactory() {
  const app = express();

  app.use(express.json());

  const api = new OpenAPIBackend({
    definition: Path.join(__dirname, `../public/openapi.yaml`),
    handlers: {
      hello: (c, req: Request, res: Response) => {
        return res.send("Hello, World!");
      },
      enterData: (c, req: Request, res: Response) => {
        const payloadErrors = !c.validation.valid
          ? c.validation.errors
              ?.map(error => `${error.message || "error"}: ${error.schemaPath}`)
              .join(", ") || "Unknown error"
          : undefined;

        if (payloadErrors) {
          return res.status(400).send({ message: payloadErrors });
        }

        return res.send(req.body);
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.use((req, res) => api.handleRequest(req as Request, req, res));

  return app;
}
