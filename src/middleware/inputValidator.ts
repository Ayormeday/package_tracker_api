import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const PackageValidator = {
  async LoginValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
      })
      .with("email", "password");

    const { error } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(400).send(`${error.details[0].message}`);
    } else {
      return next();
    }
  },

  async CreateAdmin(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      first_name: Joi.string(),
      last_name: Joi.string(),
      role: Joi.string(),
      phone_number: Joi.string().min(3).max(12).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(400).send(`${error.details[0].message}`);
    } else {
      return next();
    }
  },

  async RegisterValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      first_name: Joi.string(),
      last_name: Joi.string(),
      phone_number: Joi.string().min(3).max(12).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(400).send(`${error.details[0].message}`);
    } else {
      return next();
    }
  },
  async validateCreatePackage(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
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
  },
  async validateCreateDelivery(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      packageId: Joi.string().required().messages({
        'string.base': 'Package ID must be a string.',
        'any.required': 'Package ID is required.',
      }),
      pickupTime: Joi.date().iso().optional().messages({
        'date.base': 'Pickup Time must be a valid date.',
        'date.iso': 'Pickup Time must be in ISO format.',
      }),
      startTime: Joi.date().iso().optional().messages({
        'date.base': 'Start Time must be a valid date.',
        'date.iso': 'Start Time must be in ISO format.',
      }),
      endTime: Joi.date().iso().optional().messages({
        'date.base': 'End Time must be a valid date.',
        'date.iso': 'End Time must be in ISO format.',
      }),
      location: Joi.object({
        lat: Joi.number().required().messages({
          'number.base': 'Latitude must be a number.',
          'any.required': 'Latitude is required.',
        }),
        lng: Joi.number().required().messages({
          'number.base': 'Longitude must be a number.',
          'any.required': 'Longitude is required.',
        }),
      }).required().messages({
        'any.required': 'Location is required.',
      }),
      status: Joi.string().valid('open', 'picked-up', 'in-transit', 'delivered', 'failed').required().messages({
        'string.base': 'Status must be a string.',
        'any.required': 'Status is required.',
        'any.only': 'Status must be one of open, picked-up, in-transit, delivered, failed',
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