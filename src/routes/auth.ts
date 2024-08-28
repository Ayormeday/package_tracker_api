import { Router } from "express";
import * as AuthController from "../controllers/auth";
import {
  superAdminLoginMiddleware,
  authMiddleware,
} from "../middleware/loginMiddleware";
import { PackageValidator } from '../middleware/inputValidator';

const router = Router();

router.post("/createSuperAdmin", PackageValidator.CreateAdmin, AuthController.createSuperAdmin);
router.post(
  "/createAdmin",
  PackageValidator.CreateAdmin,
  superAdminLoginMiddleware("superAdmin"),
  AuthController.createAdmin
);
router.post("/register", PackageValidator.RegisterValidator, AuthController.register);
router.post("/login", PackageValidator.LoginValidator, AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/logout", AuthController.logout);
router.put("/updateProfile", authMiddleware(), AuthController.updateProfile);

export default router;
