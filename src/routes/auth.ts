import { Router } from "express";
import * as AuthController from "../controllers/auth";
import {
  superAdminLoginMiddleware,
  authMiddleware,
} from "../utils/loginMiddleware";
const {
  RegisterValidator,
  LoginValidator,
  CreateAdmin,
} = require("../utils/inputValidator");
const router = Router();

router.post("/createSuperAdmin", CreateAdmin, AuthController.createSuperAdmin); // superAdmin login
router.post(
  "/createAdmin",
  CreateAdmin,
  superAdminLoginMiddleware("superAdmin"),
  AuthController.createAdmin
);
router.post("/register", RegisterValidator, AuthController.register);
router.post("/login", LoginValidator, AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/logout", AuthController.logout);
router.put("/updateProfile", authMiddleware(), AuthController.updateProfile);

export default router;
