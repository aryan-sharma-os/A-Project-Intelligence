import Joi from 'joi';

export const validate = (schema) => (req, res, next) => {
  const validSchema = Joi.object(schema);
  const { error } = validSchema.validate(req.body);
  
  if (error) {
    return next(error); // Passes to global error handler
  }
  
  next();
};
