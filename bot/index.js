import { Client, GatewayIntentBits, Collection, REST, Routes, ActivityType } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { config } from '../utils/config.js';
import logger from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMembers, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent ] });
client.commands = new Collection();

const getCommandFiles = (dir) => {
  let files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getCommandFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
};

const registerCommands = async () => {
  const commands = [];
  const commandDir = path.join(__dirname, 'commands');
  const commandFiles = getCommandFiles(commandDir);

  for (const file of commandFiles) {
    const command = await import(file);
    if (command?.data?.name) {
      commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
    } else {
      logger.warn(`Skipping invalid command file: ${file}`);
    }
  }

  // Registrar comandos con la API de Discord
  const rest = new REST({ version: '10' }).setToken(config.bot.token);

  try {
    logger.info('Refreshing slash commands...');
    await rest.put(
      Routes.applicationCommands(config.bot.clientId),
      { body: commands }
    );
    logger.info('Slash commands registered successfully.');
  } catch (error) {
    logger.error('Error registering slash commands:', error);
  }
};

const registerEvents = async () => {
  const eventFiles = readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, (...args) => event.execute(client, ...args));
  }
  logger.info('Bot events registered.');
};
function updatePresence(client) {
  let index = 0; // Índice para alternar entre actividades
  const activities = [
      () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users`,
      () => 'High quality resources (our own)',
      () => 'made with Discord.js '

  ];

  // Actualizar presencia cada 10 segundos
  setInterval(() => {
      // Alternar entre actividades
      client.user.setPresence({
          activities: [
              {
                  name: activities[index](),
                  type: ActivityType.Watching,
              },
          ],
      });
      index = (index + 1) % activities.length; // Alternar el índice
  }, 10000);
}



export const startBot = async () => {
  try {
    await registerCommands();
    registerEvents();
    await client.login(config.bot.token);
    updatePresence(client);
    logger.info('Bot logged in successfully!');
  } catch (error) {
    logger.error('Error starting the bot:', error);
  }
};

export const botClient = client;
