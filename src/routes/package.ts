import { Router } from 'express';
import * as PackageController from '../controllers/package';
const router = Router();

router.get('/:packageId', PackageController.trackPackage);


export default router;
