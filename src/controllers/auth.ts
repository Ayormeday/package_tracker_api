import { IRequest, IResponse, INextFunction } from "../interfaces/vendors";
import * as AuthService from "../services/auth";
import { Response } from "express";

const createSuperAdmin: any = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
): Promise<void> => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;
    const { user, token } = await AuthService.registerSuperAdmin(
      first_name,
      last_name,
      email,
      phone_number,
      password
    );
    res.status(201).json({
      data: {
        message: "SuperAdmin added successfully",
        user: {
          id: user._id,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
        },
      },
      status: "success",
      statusCode: 201,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const createAdmin: any = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
): Promise<void> => {
  try {
    const { first_name, last_name, email, phone_number, password, role } =
      req.body;
    if (req.user.role !== "superAdmin") {
      throw new Error("Only superAdmin can create other admins");
    }
    const { user, token } = await AuthService.register(
      first_name,
      last_name,
      email,
      phone_number,
      password,
      role
    );
    res.status(201).json({
      data: {
        message: `${role} added successfully`,
        user: {
          id: user._id,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
        },
      },
      status: "success",
      statusCode: 201,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const register: any = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
): Promise<void> => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;
    let role = "user";
    const { user } = await AuthService.register(
      first_name,
      last_name,
      email,
      phone_number,
      password,
      role
    );
    res.status(201).json({
      data: {
        message: `${role} added successfully`,
        user: {
          id: user._id,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
        },
      },
      status: "success",
      statusCode: 201,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
const login: any = async (
  req: IRequest,
  res: Response,
  next: INextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.loginUser(email, password);

    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
        },
        message: "Welcome back " + user.first_name,
        sessionAuth: {
          accessToken: token,
          token_type: "bearer",
          scope: "all.read,all.write",
        },
      },
      status: "success",
      statusCode: 200,
    });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

const logout: any = (req: IRequest, res: Response): void => {
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logout successful" });
};

const updateProfile: any = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
): Promise<void> => {
  try {

    if (req.body.email) {
       res.status(400).json({
        error: "Email changes are not allowed. Please contact support for email changes."
      });
    }
    const userId = req.user._id; 

    const updatedUser = await AuthService.updateProfileService(userId, req.body);

    const sanitizedUser = sanitizeUser(updatedUser);

    res.status(200).json({
      data: {
        message: "Profile updated successfully",
        user: sanitizedUser,
      },
      status: "success",
      statusCode: 200,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const sanitizeUser = (user: any) => {
  const { password, ...sanitizedUser } = user.toObject();
  return sanitizedUser;
};

const forgotPassword: any = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const resetPassword: any = async (
  req: IRequest,
  res: IResponse,
  next: INextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export {
  register,
  createAdmin,
  login,
  forgotPassword,
  resetPassword,
  createSuperAdmin,
  logout,
  updateProfile
};
