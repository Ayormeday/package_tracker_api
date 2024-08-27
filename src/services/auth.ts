import bcrypt from "bcrypt";
import UserModel from "../models/auth";
import { generateJWT } from "../utils/tokenHandler";
import { transporter } from "../utils/transporter";

async function registerSuperAdmin(
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  password: string
) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: any = await UserModel.create({
      first_name,
      last_name,
      role: "superAdmin",
      email,
      phone_number,
      password: hashedPassword,
    });

    const token = generateJWT(newUser._id);

    return { user: newUser, token };
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      throw new Error("Email address or phone number is already in use");
    }
    throw new Error("Failed to register super admin");
  }
}

async function register(
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  password: string,
  role: string
) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: any = await UserModel.create({
      first_name,
      last_name,
      role,
      email,
      phone_number,
      password: hashedPassword,
    });

    const token = generateJWT(newUser._id);

    return { user: newUser, token };
  } catch (error: any) {
    console.error("Error Registering user:", error.message);
    throw error;
  }
}

async function loginUser(email: string, password: string) {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate JWT token for the logged-in user
    const token = generateJWT(user._id);

    return { user, token };
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    throw error;
  }
}

async function forgotPassword(email: string) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = generateJWT(user._id);

  user.resetToken = resetToken;
  user.resetTokenExpiration = new Date(Date.now() + 3600000); // Token expires in 1 hour

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.RESET_EMAIL,
    to: (user as any).email,
    subject: "Password Reset Request",
    html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
  };

  await transporter.sendMail(mailOptions);
}

async function resetPassword(token: string, newPassword: string) {
  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  await user.save();
}

async function updateProfileService(
  userId: any,
  update: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    password?: any;
  }
) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (update.phone_number) {
    const existingUser = await UserModel.findOne({
      phone_number: update.phone_number,
    });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error("Phone number already in use by another user");
    }
    user.phone_number = update.phone_number;
  }

  if (update.first_name) user.first_name = update.first_name;
  if (update.last_name) user.last_name = update.last_name;
  if (update.phone_number) user.phone_number = update.phone_number;
  if (update.password) {
    const hashedPassword = await bcrypt.hash(update.password, 10);
    user.password = hashedPassword;
  }

  await user.save();

  return user;
}

export {
  registerSuperAdmin,
  register,
  loginUser,
  generateJWT,
  forgotPassword,
  resetPassword,
  updateProfileService,
};
