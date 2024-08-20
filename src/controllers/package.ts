import { Request, Response } from "express";
import * as PackageService from "../services/package";

// Get all packages
export const getAllPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await PackageService.getAllPackages();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get package by ID
export const getPackageById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const packageData = await PackageService.getPackageById(id);
    if (!packageData) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json(packageData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create new package
export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const packageData = req.body;
    const newPackage = await PackageService.createPackage(packageData);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create many package
export const createManyPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packageData = req.body;
    const newPackage = await PackageService.createManyPackages(packageData);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update package
export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    console.log(id)
    console.log( req.body)
    const updateData = req.body;
    const updatedPackage = await PackageService.updatePackage(id, updateData);
    if (!updatedPackage) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete package
export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    console.log(id)
    const deletedPackage = await PackageService.deletePackage(id);
    if (!deletedPackage) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};