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

  it("responds with data entered if payload is valid", async () => {
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
        unit: "DEGREES_FAHRENHEIT",
      },
    };

    const response = await server.post("/enterData").send(requestBody);
    expect(response.body).toEqual(requestBody);
  });

  it("responds with 400 and appropriate message if the request body 'distance' is not a number", async () => {
    const requestBody = {
      distance: {
        value: "ten",
        unit: "MILES",
      },
      weight: {
        value: 150,
        unit: "POUNDS",
      },
      temperature: {
        value: 85,
        unit: "DEGREES_FAHRENHEIT",
      },
    };

    const response = await server.post("/enterData").send(requestBody);
    expect(response.status).toEqual(400);
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "must be number",
          instancePath: "/requestBody/distance/value",
          schemaPath:
            "#/properties/requestBody/properties/distance/properties/value/type",
        }),
      ]),
    );
  });

  it("responds with 400 and appropriate error if the request body 'weight' is not a number", async () => {
    const requestBody = {
      distance: {
        value: 10,
        unit: "MILES",
      },
      weight: {
        value: "one-hundred-fifty",
        unit: "POUNDS",
      },
      temperature: {
        value: 85,
        unit: "DEGREES_FAHRENHEIT",
      },
    };

    const response = await server.post("/enterData").send(requestBody);
    expect(response.status).toEqual(400);
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "must be number",
          instancePath: "/requestBody/weight/value",
          schemaPath:
            "#/properties/requestBody/properties/weight/properties/value/type",
        }),
      ]),
    );
  });

  it("responds with 400 and appropriate errors if the request body 'weight' and 'temperature' are not numbers", async () => {
    const requestBody = {
      distance: {
        value: 10,
        unit: "MILES",
      },
      weight: {
        value: "one-hundred-fifty",
        unit: "POUNDS",
      },
      temperature: {
        value: "eighty-five",
        unit: "DEGREES_FAHRENHEIT",
      },
    };

    const response = await server.post("/enterData").send(requestBody);
    expect(response.status).toEqual(400);
    expect(response.body.errors.length).toBe(2);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "must be number",
          instancePath: "/requestBody/weight/value",
          schemaPath:
            "#/properties/requestBody/properties/weight/properties/value/type",
        }),
        expect.objectContaining({
          message: "must be number",
          instancePath: "/requestBody/temperature/value",
          schemaPath:
            "#/properties/requestBody/properties/temperature/properties/value/type",
        }),
      ]),
    );
  });
});
