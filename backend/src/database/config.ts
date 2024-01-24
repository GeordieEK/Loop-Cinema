import { env } from 'process';
import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const databaseConfig = {
  HOST: env.DB_HOST!,
  USER: env.DB_USER!,
  PASSWORD: env.DB_PASSWORD!,
  DB: env.DB!,
  DIALECT: 'mysql' as Dialect,
};

export const sequelize = new Sequelize(
  databaseConfig.DB,
  databaseConfig.USER,
  databaseConfig.PASSWORD,
  {
    host: databaseConfig.HOST,
    dialect: databaseConfig.DIALECT,
  }
);
