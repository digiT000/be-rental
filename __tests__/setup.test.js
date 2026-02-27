// tests/setup.test.js
import { add, subtract, multiply } from "../src/utils/math.js";

describe("Jest Setup Test", () => {
  test("should run tests successfully", () => {
    expect(true).toBe(true);
  });

  test("should add two numbers", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  test("should subtract two numbers", () => {
    const result = subtract(5, 3);
    expect(result).toBe(2);
  });

  test("should multiply two numbers", () => {
    const result = multiply(4, 5);
    expect(result).toBe(20);
  });

  test("should handle different data types", () => {
    const string = "hello";
    const array = [1, 2, 3];
    const object = { name: "John" };

    expect(string).toBe("hello");
    expect(array).toEqual([1, 2, 3]);
    expect(object).toEqual({ name: "John" });
  });

  test("should work with async functions", async () => {
    const asyncFunction = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve("done"), 100);
      });
    };

    const result = await asyncFunction();
    expect(result).toBe("done");
  });
});
