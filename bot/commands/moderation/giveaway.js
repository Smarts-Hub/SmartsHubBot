import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('Manage giveaways')
  .addSubcommand(subcommand =>
    subcommand
        .setName('create')
        .setDescription('Create a new giveaway')
        .addStringOption(option =>
            option
             .setName('title')
             .setDescription('The title of the giveaway')
             .setRequired(true)
        )
        .addStringOption(option =>
            option
             .setName('description')
             .setDescription('The description of the giveaway')
             .setRequired(true)
        )
        .addIntegerOption(option => option
             .setName('duration')
             .setDescription('How many days will the giveaway be available')
             .setRequired(true)
        )
        .addIntegerOption(option =>
            option
             .setName('winners')
             .setDescription('How many winners the giveaway will have')
             .setRequired(true)
        )
        .addStringOption(option =>
            option
             .setName('prize')
             .setDescription('The prize of the giveaway')
             .setRequired(true)
        )
  );

export const execute = async (interaction) => {
  if(interaction.options.getSubcommand() === 'create') {
    const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  const duration = interaction.options.getInteger('duration') || 7;
  const winners = interaction.options.getInteger('winners') || 1;
  const prize = interaction.options.getString('prize');


  const giveaway = new Giveaways({
    name: title,
    description,
    duration,
    winners,
    prize,
    startedAt: new Date(),
    endedAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
    winnerIds: [],
  })

  await giveaway.save();

  const embed = new EmbedBuilder()
    .setTitle('title')
    .setDescription('description')
    .addFields(
        { name: 'Winners', description: winners, inline: true },
        { name: 'Duration', description: duration, inline: true },
        { name: 'Prize', description: prize, inline: true },
    )

    await interaction.channel.send({ embeds: [embed] })
    await interaction.reply({ content: 'giveaway created', ephemeral: true })

  }

};
