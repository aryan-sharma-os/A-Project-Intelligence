import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(8000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  MONGO_URI: Joi.string().required().description('MongoDB Connection URI'),
  GOOGLE_API_KEY: Joi.string().required().description('Gemini 2.5 Pro API Key'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
  },
  ai: {
    googleApiKey: envVars.GOOGLE_API_KEY,
  },
};
