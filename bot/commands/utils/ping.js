import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Say pong');

export const execute = async (interaction) => {
  await interaction.reply('pong');
};
