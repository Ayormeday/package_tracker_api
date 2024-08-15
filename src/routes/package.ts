import { Router } from 'express';
import * as PackageController from '../controllers/package';
const router = Router();

router.get("/", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);
router.post("/", PackageController.createPackage);
router.put("/:id", PackageController.updatePackage);
router.delete("/:id", PackageController.deletePackage);

export default router;
