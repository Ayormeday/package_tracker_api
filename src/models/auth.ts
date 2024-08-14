import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  phone_number: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
}

const UserSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "subAdmin", "user"],
    },
    phone_number: { type: String, unique: true },
    username: String,
    password: String,
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
