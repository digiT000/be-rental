import { beforeEach, describe, it, expect, jest } from "@jest/globals";

// For ES modules, use unstable_mockModule
const mockQuery = jest.fn();
const mockConnect = jest.fn();
const mockEnd = jest.fn();

jest.unstable_mockModule("../../../src/config/postgres.js", () => ({
  default: {
    query: mockQuery,
    connect: mockConnect,
    end: mockEnd,
  },
}));

const { UserModel } = await import("../../../src/models/user.js");
const { default: db } = await import("../../../src/config/postgres.js");

describe("UserModel", () => {
  let userModel;

  beforeEach(() => {
    userModel = new UserModel();
    jest.clearAllMocks();
  });

  describe("Create New User", () => {
    it("should create a new user successfully", async () => {
      const mockUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
      };

      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await userModel.create(
        "John Doe",
        "john@example.com",
        "hashedPassword"
      );

      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        ["John Doe", "john@example.com", "hashedPassword"]
      );
    });

    it("Should return failed if email already used", async () => {
      // PostgreSQL unique violation error code is 23505
      const duplicateError = new Error(
        "duplicate key value violates unique constraint"
      );
      duplicateError.code = "23505";
      duplicateError.detail = "Key (email)=(john@example.com) already exists.";

      mockQuery.mockRejectedValue(duplicateError);

      await expect(
        userModel.create("John Doe", "john@example.com", "hashedPassword")
      ).rejects.toThrow("duplicate key value violates unique constraint");

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        ["John Doe", "john@example.com", "hashedPassword"]
      );
    });

    it("should throw error when database operation fails", async () => {
      const dbError = new Error("Database connection failed");
      mockQuery.mockRejectedValue(dbError);

      await expect(
        userModel.create("John", "john@example.com", "hashedPassword")
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("findUserByEmail", () => {
    it("should find user by email", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
      };

      mockQuery.mockResolvedValue({ rows: [mockUser] });

      const result = await userModel.findUserByEmail("john@example.com");

      expect(result).toEqual(mockUser);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users WHERE email"),
        ["john@example.com"]
      );
    });

    it("should return undefined when user not found", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await userModel.findUserByEmail("notfound@example.com");

      expect(result).toBeUndefined();
    });

    it("should throw error when database operation fails", async () => {
      const dbError = new Error("Database connection failed");
      mockQuery.mockRejectedValue(dbError);

      await expect(
        userModel.findUserByEmail("john@example.com")
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("findUserById", () => {
    it("should find user by id", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      mockQuery.mockResolvedValue({ rows: [mockUser] });

      const result = await userModel.findUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users WHERE id"),
        [1]
      );
    });
    it("should throw error when database operation fails", async () => {
      const dbError = new Error("Database connection failed");
      mockQuery.mockRejectedValue(dbError);

      await expect(userModel.findUserById(1)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("saveRefreshToken", () => {
    it("should save refresh token successfully", async () => {
      const validUntil = new Date("2025-12-31");
      const mockToken = {
        refresh_token: "token123",
        user_id: 1,
        valid_until: validUntil,
        revoked: false,
        created_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockToken] });

      const result = await userModel.saveRefreshToken(
        1,
        "token123",
        validUntil,
        "Chrome/Windows"
      );

      expect(result).toEqual(mockToken);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO user_token"),
        ["token123", 1, validUntil, false, "Chrome/Windows"]
      );
    });
    it("should throw error when database operation fails", async () => {
      const dbError = new Error("Database connection failed");
      mockQuery.mockRejectedValue(dbError);

      await expect(
        userModel.saveRefreshToken(1, "token123", new Date(), "Chrome/Windows")
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("userRevoke", () => {
    it("should revoke user token successfully", async () => {
      mockQuery.mockResolvedValue({ rowCount: 1 });

      const result = await userModel.userRevoke(1, "token123", "logout");

      expect(result.rowCount).toBe(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE user_token"),
        [1, "token123", "logout"]
      );
    });
    it("should return rowCount 0 when token not found", async () => {
      mockQuery.mockResolvedValue({ rowCount: 0 });

      const result = await userModel.userRevoke(1, "invalid-token", "logout");

      expect(result.rowCount).toBe(0);
    });

    it("should throw error when database operation fails", async () => {
      const dbError = new Error("Database connection failed");
      mockQuery.mockRejectedValue(dbError);

      await expect(
        userModel.userRevoke(1, "token123", "logout")
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify refresh token successfully", async () => {
      const mockUser = {
        id: 1,
        email: "john@example.com",
        name: "John Doe",
        refresh_token: "token123",
        refresh_token_valid_until: new Date("2025-12-31"),
        revoked: false,
      };

      mockQuery.mockResolvedValue({ rows: [mockUser] });

      const result = await userModel.verifyRefreshToken(1, "token123");

      expect(result).toEqual(mockUser);
    });

    it("should return undefined for invalid token", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await userModel.verifyRefreshToken(1, "invalid-token");

      expect(result).toBeUndefined();
    });
    it("should throw error when database operation fails", async () => {
      const dbError = new Error("Database connection failed");
      mockQuery.mockRejectedValue(dbError);

      await expect(userModel.verifyRefreshToken(1, "token123")).rejects.toThrow(
        "Database connection failed"
      );
    });
  });
});
