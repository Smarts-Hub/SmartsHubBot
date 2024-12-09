import { startBot } from './bot/index.js';
import logger from './utils/logger.js';
import { config } from './utils/config.js';
import mongoose from 'mongoose';

const startApplication = async () => {
  try {
    logger.info('Starting Bot...');
    await mongoose.connect(config.storage.mongodb)
    await Promise.all([startBot()]);
    logger.info('Bot started successfully!');
  } catch (error) {
    logger.error('Error starting Bot', error);
  }
};

startApplication();
