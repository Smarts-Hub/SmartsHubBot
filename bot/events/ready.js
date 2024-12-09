import logger from '../../utils/logger.js';
import loadActiveReminders from '../../utils/loadRemembers.js';
export const execute = async (client) => {
  logger.info('Bot is online and ready!');
  await loadActiveReminders(client);
};
