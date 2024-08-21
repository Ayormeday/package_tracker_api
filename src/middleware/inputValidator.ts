import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const PackageValidator = {
  async validateCreatePackage(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      // packageId: Joi.string().required().messages({
      //   'string.base': 'Package ID must be a string.',
      //   'any.required': 'Package ID is required.',
      // }),
      // activeDeliveryId: Joi.string().optional().messages({
      //   'string.base': 'Active Delivery ID must be a string.',
      // }),
      description: Joi.string().required().messages({
        'string.base': 'Description must be a string.',
        'any.required': 'Description is required.',
      }),
      weight: Joi.number().positive().required().messages({
        'number.base': 'Weight must be a number.',
        'number.positive': 'Weight must be a positive number.',
        'any.required': 'Weight is required.',
      }),
      width: Joi.number().positive().required().messages({
        'number.base': 'Width must be a number.',
        'number.positive': 'Width must be a positive number.',
        'any.required': 'Width is required.',
      }),
      height: Joi.number().positive().required().messages({
        'number.base': 'Height must be a number.',
        'number.positive': 'Height must be a positive number.',
        'any.required': 'Height is required.',
      }),
      depth: Joi.number().positive().required().messages({
        'number.base': 'Depth must be a number.',
        'number.positive': 'Depth must be a positive number.',
        'any.required': 'Depth is required.',
      }),
      fromName: Joi.string().required().messages({
        'string.base': 'From Name must be a string.',
        'any.required': 'From Name is required.',
      }),
      fromAddress: Joi.string().required().messages({
        'string.base': 'From Address must be a string.',
        'any.required': 'From Address is required.',
      }),
      fromLocation: Joi.object({
        lat: Joi.number().required().messages({
          'number.base': 'Latitude must be a number.',
          'any.required': 'Latitude is required.',
        }),
        lng: Joi.number().required().messages({
          'number.base': 'Longitude must be a number.',
          'any.required': 'Longitude is required.',
        }),
      }).required().messages({
        'any.required': 'From Location is required.',
      }),
      toName: Joi.string().required().messages({
        'string.base': 'To Name must be a string.',
        'any.required': 'To Name is required.',
      }),
      toAddress: Joi.string().required().messages({
        'string.base': 'To Address must be a string.',
        'any.required': 'To Address is required.',
      }),
      toLocation: Joi.object({
        lat: Joi.number().required().messages({
          'number.base': 'Latitude must be a number.',
          'any.required': 'Latitude is required.',
        }),
        lng: Joi.number().required().messages({
          'number.base': 'Longitude must be a number.',
          'any.required': 'Longitude is required.',
        }),
      }).required().messages({
        'any.required': 'To Location is required.',
      }),
    });

    const { error } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(400).send(`${error.details[0].message}`);
    } else {
      return next();
    }
  }
};