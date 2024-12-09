import { SlashCommandBuilder } from 'discord.js';
import Remembers from '../../../models/Remembers.js';
import loadActiveReminders from '../../../utils/loadRemembers.js';

export const data = new SlashCommandBuilder()
  .setName('remember')
  .setDescription('Create a new reminder. The bot will ping you at the specified time.')
  .addStringOption(option =>
    option
      .setName('message')
      .setDescription('The message you want to be reminded of')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('time')
      .setDescription('The time in hours before the bot will remind you')
      .setRequired(true)
  );

export const execute = async (interaction) => {
  const message = interaction.options.getString('message');
  const time = interaction.options.getInteger('time');

  if (time <= 0) {
    return interaction.reply({ content: 'Time must be greater than 0 hours.', ephemeral: true });
  }

  // Calculate reminder time
  const reminderTime = Date.now() + time * 60 * 60 * 1000;

  // Save the reminder in the database
  const reminder = await Remembers.create({
    name: message,
    creatorId: interaction.user.id,
    createdAt: new Date(),
    remember: reminderTime,
  });

  interaction.reply(`I will remind you about "${message}" in ${time} hours.`);

  // Schedule the reminder
  scheduleReminder(reminder, interaction.client);
};


const scheduleReminder = (reminder, client) => {
    const timeUntilReminder = reminder.remember - Date.now();
  
    if (timeUntilReminder > 0) {
      setTimeout(async () => {
        const user = await client.users.fetch(reminder.creatorId);
        if (user) {
          user.send(`⏰ Reminder: ${reminder.name}`);
        }
  
        // Remove the reminder from the database after triggering
        await Remembers.findByIdAndDelete(reminder._id);
      }, timeUntilReminder);
    }
  };

  
