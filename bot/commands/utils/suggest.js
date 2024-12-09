import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('suggest')
  .setDescription('Create a suggestion')
  .addStringOption(option =>
    option
     .setName('suggestion')
     .setDescription('Your suggestion')
     .setRequired(true)
  );

export const execute = async (interaction) => {
    const suggestion = interaction.options.getString('suggestion');
    const embed = new EmbedBuilder()
        .setTitle(`New suggestion by ${interaction.user.username}`)
        .setDescription(suggestion)
        .addFields(
            { name: `Suggestion creator`, value: `${interaction.user}`, inline: true }
        )
        .setColor('00ff9d')
        .setThumbnail(interaction.user.displayAvatarURL())
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setFooter({ text: 'SmartsHub', iconURL: `https://cdn.discordapp.com/attachments/1136275750538981426/1311395662667059320/Mesa_de_trabajo_12.png?ex=6748b3e2&is=67476262&hm=32e4ec78bc97cf506b5c2d2f9bb740a9dc7b709bbafa290b915966612d151f1f&` })

    
    await interaction.reply({ content: 'Thanks for your suggestion!', ephemeral: true })

    const suggestionsChannel = interaction.guild.channels.cache.get('1271781524441923644');
    const msg = await suggestionsChannel.send({ embeds: [embed] });
    await msg.react('✅');
    await msg.react('❌');
};
