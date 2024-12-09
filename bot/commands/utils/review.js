import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('review')
  .setDescription('Leave a review')
  .addStringOption(option =>
    option
     .setName('comment')
     .setDescription('Your comment')
     .setRequired(true)
  )
  .addIntegerOption(option =>
    option
     .setName('rating')
     .setDescription('Your rating (1-5)')
     .setRequired(true)
  );

export const execute = async (interaction) => {
    const comment = interaction.options.getString('comment');
    const rating = interaction.options.getInteger('rating');
    if(rating < 1 || rating > 5) {
        return interaction.reply({ content: 'Invalid rating. Please choose a number between 1 and 5.', ephemeral: true});
    }

    const embed = new EmbedBuilder()
        .setTitle(`New review by ${interaction.user.username}`)
        .setDescription(comment)
        .addFields(
            { name: `Rating`, value: `${'⭐'.repeat(rating)}` }
        )
        .setColor('00ff9d')
        .setThumbnail(interaction.user.displayAvatarURL())
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setFooter({ text: 'SmartsHub', iconURL: `https://cdn.discordapp.com/attachments/1136275750538981426/1311395662667059320/Mesa_de_trabajo_12.png?ex=6748b3e2&is=67476262&hm=32e4ec78bc97cf506b5c2d2f9bb740a9dc7b709bbafa290b915966612d151f1f&` })

    
    await interaction.reply({ content: 'Thanks for your review!', ephemeral: true })

    const suggestionsChannel = interaction.guild.channels.cache.get('1312486382316294256');
    const msg = await suggestionsChannel.send({ embeds: [embed] });
};
