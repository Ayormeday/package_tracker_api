import { Request, Response } from "express";
import * as DeliveryService from "../services/delivery";

// Get all deliveries
export const getAllDeliveries = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveries = await DeliveryService.getAllDeliveries();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get delivery by ID
export const getDeliveryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deliveryData = await DeliveryService.getDeliveryById(id);
    if (!deliveryData) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }
    res.status(200).json(deliveryData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create new delivery
export const createDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveryData = req.body;
    const newDelivery = await DeliveryService.createDelivery(deliveryData);
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update delivery
export const updateDelivery = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const updatedDelivery = await DeliveryService.updateDelivery(id, updateData);
    if (!updatedDelivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }
    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete delivery
export const deleteDelivery = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedDelivery = await DeliveryService.deleteDelivery(id);
    if (!deletedDelivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};