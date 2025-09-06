import request from "supertest";
import app from "../app.js"; // Import our Express app

// This is a test suite, a collection of related tests
describe("GET /api/health", () => {
  // This is a single test case
  it("should respond with a 200 status and a success message", async () => {
    const response = await request(app)
      .get("/api/health")
      .expect("Content-Type", /json/) // Check that the content type is JSON
      .expect(200); // Check for a 200 OK status code

    // Check that the response body is exactly what we expect
    expect(response.body).toEqual({ message: "Server is running!" });
  });

  it("should respond with a 404 for a non-existent route", async () => {
    const response = await request(app)
      .get("/api/this-route-does-not-exist")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toEqual({ error: "Not Found" });
  });
});
