import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('send-ticket-panel')
  .setDescription('Sends the ticket panel')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = async (interaction) => {
    const embed = new EmbedBuilder()
        .setTitle('📨 Tickets')
        .setDescription('Create a ticket using the buttons below.')
        .addFields(
            { name: '🔐 License', value: 'Create a ticket for claiming your license. You should show a image that proofs you have bought the resource.' },
            { name: '🛠️ Support', value: 'Create a ticket for solving any question with one of our resources. You must be a customer or subcustomer to recieve support.' }
        )
        .setTimestamp()
        .setImage('https://media.discordapp.net/attachments/1136275750538981426/1311723268310568970/panels_tickets_Gradiente.png?ex=6749e4fd&is=6748937d&hm=c76b8146fe1a44bf22cf0508f7c6fb7b4ce136bdae23831b4251fea42a8c967c&=&format=webp&quality=lossless&width=1404&height=366')
        .setFooter({ text: 'SmartsHub', iconURL: `https://cdn.discordapp.com/attachments/1136275750538981426/1311395662667059320/Mesa_de_trabajo_12.png?ex=6748b3e2&is=67476262&hm=32e4ec78bc97cf506b5c2d2f9bb740a9dc7b709bbafa290b915966612d151f1f&` })
        .setColor('00a4ff')


    const licenseBtn = new ButtonBuilder()
        .setCustomId('license-ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🔐')
        .setLabel('License');
    const supportBtn = new ButtonBuilder()
        .setCustomId('support-ticket')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🛠️')
        .setLabel('Support');
    
    const row = new ActionRowBuilder().addComponents(licenseBtn, supportBtn);
    await interaction.channel.send({ embeds: [embed], components: [row] })
    await interaction.reply({ content: 'Ticket panel sent successfully.', ephemeral: true });

};
