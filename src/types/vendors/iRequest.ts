import { Request } from 'express';
import { IFilterQuery } from '../common/iQuery';

interface IRequest<T1 = IFilterQuery, T2 = {}, T3 = {}>
  extends Request<T3, unknown, T2, T1> {
  files?: any;
  user: {
    email: string;
    _id: string;
    role: string;
  };
  body: any;
  sessionAuth_id?: string;
  file?: Express.Multer.File; 
}

export { IRequest };
