import { describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../../../src/models/user.js", () => ({
  UserModel: jest.fn().mockImplementation(function () {
    this.create = jest.fn();
    this.findUserByEmail = jest.fn();
    this.saveRefreshToken = jest.fn();
    this.userRevoke = jest.fn();
    this.verifyRefreshToken = jest.fn();
  }),
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

const { UserModel } = await import("../../../src/models/user.js");
const { default: bcrypt } = await import("bcrypt");
const { default: AuthService } = await import(
  "../../../src/service/auth.service.js"
);

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  describe("constructor", () => {
    it("should create an instance of AuthService", () => {
      const authService = new AuthService();
      expect(authService).toBeInstanceOf(AuthService);
    });

    it("should instantiate UserModel and assign it to userModel property", () => {
      UserModel.mockClear(); // reset count before this test

      const authService = new AuthService();
      expect(UserModel).toHaveBeenCalledTimes(1);
      expect(authService.userModel).toBeInstanceOf(UserModel);
    });

    it("should create a new UserModel instance for each AuthService instance", () => {
      UserModel.mockClear(); // reset count before this test

      const firstService = new AuthService();
      const secondService = new AuthService();
      expect(UserModel).toHaveBeenCalledTimes(2);
      expect(firstService.userModel).not.toBe(secondService.userModel);
    });

    it("should have userModel property defined after construction", () => {
      const authService = new AuthService();
      expect(authService.userModel).toBeDefined();
    });
  });

  describe("createUser", () => {
    const mockName = "John Doe";
    const mockEmail = "john@example.com";
    const mockPassword = "plainPassword123";
    const mockHashedPassword = "hashedPassword123";
    const mockUser = {
      id: 1,
      name: mockName,
      email: mockEmail,
      created_at: new Date("2024-01-01T00:00:00.000Z"),
      updated_at: new Date("2024-01-01T00:00:00.000Z"),
    };
    it("should hash the password with salt of 10 before creating user", async () => {
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      authService.userModel.create.mockResolvedValue(mockUser);

      await authService.createUser(mockName, mockEmail, mockPassword);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
    });

    it("should call userModel.create with correct arguments", async () => {
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      authService.userModel.create.mockResolvedValue(mockUser);

      await authService.createUser(mockName, mockEmail, mockPassword);

      expect(authService.userModel.create).toHaveBeenCalledTimes(1);
      expect(authService.userModel.create).toHaveBeenCalledWith(
        mockName,
        mockEmail,
        mockHashedPassword
      );
    });

    it("should return the result from userModel.create", async () => {
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      authService.userModel.create.mockResolvedValue(mockUser);

      const result = await authService.createUser(
        mockName,
        mockEmail,
        mockPassword
      );

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      });
    });

    it("should throw UnauthorizedError when user already exists (error code 23505)", async () => {
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      const duplicateError = new Error("Duplicate entry");
      duplicateError.code = "23505";
      authService.userModel.create.mockRejectedValue(duplicateError);

      await expect(
        authService.createUser(mockName, mockEmail, mockPassword)
      ).rejects.toMatchObject({
        message: "User already exist with this email",
      });
    });

    it("should rethrow error if error code is not 23505", async () => {
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      const genericError = new Error("Database connection error");
      genericError.code = "500";
      authService.userModel.create.mockRejectedValue(genericError);

      await expect(
        authService.createUser(mockName, mockEmail, mockPassword)
      ).rejects.toThrow("Database connection error");
    });

    it("should not call userModel.create with plain password", async () => {
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      authService.userModel.create.mockResolvedValue(mockUser);

      await authService.createUser(mockName, mockEmail, mockPassword);

      expect(authService.userModel.create).not.toHaveBeenCalledWith(
        mockName,
        mockEmail,
        mockPassword
      );
    });
  });
});
