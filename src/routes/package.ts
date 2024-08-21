import { Router } from 'express';
import * as PackageController from '../controllers/package';
import { PackageValidator } from '../middleware/inputValidator';

const router = Router();

router.get("/", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);
router.post("/", PackageValidator.validateCreatePackage, PackageController.createPackage);
router.put("/:id", PackageController.updatePackage);
router.delete("/:id", PackageController.deletePackage);

export default router;