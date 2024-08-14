import { Request, Response, NextFunction } from "express";
import * as PackageService from "../services/package";

async function trackPackage(req: Request, res: Response, next: NextFunction) {
  const { packageId } = req.params;
  try {
    const pacakgeData = await PackageService.getPackageDetails(packageId);
    return res.status(200).json(pacakgeData);
  } catch (error: any) {
    if (error.message === "Package not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error", error });
  }
}

export { trackPackage };
