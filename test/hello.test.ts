import supertest from "supertest";
import { appFactory } from "../src/appFactory.js";

describe("GET /hello", () => {
  const app = appFactory();
  const server = supertest(app);

  it("responds with greeting", async () => {
    const response = await server.get("/hello");
    expect(response.text).toBe("Hello, World!");
  });
});

describe("POST /enterData", () => {
  const app = appFactory();
  const server = supertest(app);

  it("responds with data entered", async () => {
    const requestBody = {
      distance: {
        value: 10,
        unit: "MILES",
      },
      weight: {
        value: 150,
        unit: "POUNDS",
      },
      temperature: {
        value: 85,
        unit: "FAHRENHEIT",
      },
    };

    const response = await server.post("/enterData").send(requestBody);
    expect(response.body).toEqual(requestBody);
  });
});
