import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodbUri: process.env.MONGODB_URI!,
  port: parseInt(process.env.PORT || '3001', 10),
};
