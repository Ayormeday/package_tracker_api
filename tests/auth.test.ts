import * as authService from "../src/services/auth";
import UserModel from "../src/models/auth";
import bcrypt from "bcrypt";

jest.mock("../src/models/auth");
jest.mock("../src/utils/tokenHandler");
jest.mock("bcrypt");

describe("registerSuperAdmin", () => {
  it("should register a new super admin and return user and token", async () => {
    const mockUser = {
      _id: "userId",
      first_name: "John",
      last_name: "Doe",
      role: "superAdmin",
      email: "johndoe@example.com",
      phone_number: "1234567890",
      password: "hashedPassword",
    };

    jest.spyOn(UserModel, "create").mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementation(() => Promise.resolve("hashedPassword"));

    jest.spyOn(authService, "generateJWT").mockReturnValue("mockToken");

    const result = await authService.registerSuperAdmin(
      "John",
      "Doe",
      "johndoe@example.com",
      "1234567890",
      "password"
    );

    expect(result.user).toEqual(mockUser);
    expect(result.token).toEqual("mockToken");
  });

  it("should throw an error if email or phone number is already in use", async () => {
    const mockError: any = new Error();
    mockError.code = 11000;

    jest.spyOn(UserModel, "create").mockRejectedValue(mockError);

    await expect(
      authService.registerSuperAdmin(
        "John",
        "Doe",
        "johndoe@example.com",
        "1234567890",
        "password"
      )
    ).rejects.toThrow("Email address or phone number is already in use");
  });
});

describe("register", () => {
  it("should register a new user and return user and token", async () => {
    const mockUser = {
      _id: "userId",
      first_name: "Jane",
      last_name: "Doe",
      role: "user",
      email: "janedoe@example.com",
      phone_number: "0987654321",
      password: "hashedPassword",
    };

    jest.spyOn(UserModel, "create").mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementation(() => Promise.resolve("hashedPassword"));
    jest.spyOn(authService, "generateJWT").mockReturnValue("mockToken");

    const result = await authService.register(
      "Jane",
      "Doe",
      "janedoe@example.com",
      "0987654321",
      "password",
      "user"
    );

    expect(result.user).toEqual(mockUser);
    expect(result.token).toEqual("mockToken");
  });

  it("should throw an error if registration fails", async () => {
    const mockError = new Error("Error Registering user");

    jest.spyOn(UserModel, "create").mockRejectedValue(mockError);

    await expect(
      authService.register(
        "Jane",
        "Doe",
        "janedoe@example.com",
        "0987654321",
        "password",
        "user"
      )
    ).rejects.toThrow("Error Registering user");
  });
});

describe("loginUser", () => {
  it("should log in a user and return user and token", async () => {
    const mockUser = {
      _id: "userId",
      email: "johndoe@example.com",
      password: "hashedPassword",
    };

    jest.spyOn(UserModel, "findOne").mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementation(() => Promise.resolve(true));

    jest.spyOn(authService, "generateJWT").mockReturnValue("mockToken");

    const result = await authService.loginUser(
      "johndoe@example.com",
      "password"
    );

    expect(result.user).toEqual(mockUser);
    expect(result.token).toEqual("mockToken");
  });

  it("should throw an error if password is invalid", async () => {
    const mockUser = {
      _id: "userId",
      email: "johndoe@example.com",
      password: "hashedPassword",
    };

    jest.spyOn(UserModel, "findOne").mockResolvedValue(mockUser as any);
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementation(() => Promise.resolve(false));

    await expect(
      authService.loginUser("johndoe@example.com", "password")
    ).rejects.toThrow("Invalid password");
  });

  it("should throw an error if user is not found", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(null);

    await expect(
      authService.loginUser("johndoe@example.com", "password")
    ).rejects.toThrow("User not found");
  });
});


  