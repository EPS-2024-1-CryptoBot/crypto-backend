import { Logger } from '@nestjs/common/services/logger.service';
import { InvalidConfigError } from './app.errors';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as fs from 'fs';

const DOTENV_ROOT = join(process.cwd(), 'env/');

export enum Env {
  dev = 'dev',
  test = 'test',
  prod = 'prod',
}

const getEnvName = (): Env => {
  const { NODE_ENV, HOST_ENV: env } = process.env;

  if (NODE_ENV === Env.test) return Env.test;
  if (!env) return Env.dev;
  if (env in Env) return env as Env;

  throw new InvalidConfigError(`Unknown Environment: ${env}`);
};

const ensurePath = (...parts) => {
  const basePath = join(...parts);
  const fullPath = join(process.cwd(), basePath);

  if (!fs.existsSync(fullPath)) {
    throw new InvalidConfigError(`File not found: ${basePath}`);
  }

  return fullPath;
};

const readFile = (...parts) => {
  const fullPath = ensurePath(...parts);
  return fs.readFileSync(fullPath, { encoding: 'utf8', flag: 'r' });
};

export const loadConfig = () => {
  const env = getEnvName();

  dotenv.config({ path: join(DOTENV_ROOT, `${env}.env`) });
  Logger.log(`Loading ENV: ${env}`, 'Load Config');

  const firebaseServiceAccount = readFile('env', env, 'firebase.json');

  return {
    app: {
      env,
      port: parseInt(process.env.PORT),
      jwt_secret: process.env.JWT_SECRET,
    },
    db: {
      url: process.env.DATABASE_URL,
      synchronize: false,
    },
    google: {
      firebase_service_account: JSON.parse(firebaseServiceAccount || '{}'),
    },
    lib: {
      wallet: process.env.URL_WALLET,
      rsa: process.env.URL_RSA,
      consultant: process.env.URL_CONSULTANT,
      system_pub_k: process.env.SYSTEM_PUB_K,
      system_pvt_k: process.env.SYSTEM_PVT_K,
    },
    integration: {
      stock_compass_api: process.env.STOCK_COMPASS_API_URL,
    },
  };
};

export const appConfig = loadConfig();

export const fetchConfig = (...keys): any =>
  keys.reduce((map, key) => {
    const val = map[key];

    if (val === undefined) {
      throw new InvalidConfigError(`Config not found: ${key} for [${keys}]`);
    }

    return val;
  }, appConfig);
