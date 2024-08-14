import { INextFunction, IRequest, IResponse } from "../types/vendors";
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  async LoginValidator(req: IRequest, res: IResponse, next: INextFunction) {
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

  async CreateAdmin(req: IRequest, res: IResponse, next: INextFunction) {
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

  async RegisterValidator(req: IRequest, res: IResponse, next: INextFunction) {
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

  async ChurchOfficerValidator(
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ) {
    const schema = Joi.object().keys({
      first_name: Joi.string(),
      last_name: Joi.string(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().min(3).max(12).required(),
      role: Joi.string().valid("elder", "deacon", "media", "intern", "guest"),
      can_preach: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(400).send(`${error.details[0].message}`);
    } else {
      return next();
    }
  },

  async ReadingPlanValidator(
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ) {
    const schema = Joi.object().pattern(
      Joi.string(),
      Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string()))
    );

    const { error } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(400).send(`${error.details[0].message}`);
    } else {
      return next();
    }
  },
};
