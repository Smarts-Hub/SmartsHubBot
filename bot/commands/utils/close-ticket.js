import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';
import Tickets from '../../../models/Tickets.js';
import pkg from 'discord-html-transcripts';


export const data = new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close the current ticket');

export const execute = async (interaction) => {
    await interaction.deferReply();
    const ticketChannel = interaction.channel;

    const ticketNumber = ticketChannel.name.split('-')[1];

    const ticket = await Tickets.findOne({ ticketNumber })
    const user = await interaction.guild.members.cache.get(ticket.creatorId);
    // Step 1: Send the transcript to the user via DM
    const transcript = await pkg.createTranscript(ticketChannel, {
        footer: `Ticket #${ticketChannel.name.split('-')[1]}`,
        filename: `ticket-${ticketChannel.name.split('-')[1]}.html`,
    });

    const usrEmbed = new EmbedBuilder()
        .setTitle('Ticket closed')
        .setDescription(`The ticket has been closed. Here you have your transcript. **Please, leave a review about the resource of our support with /review!**`)
        .setTimestamp()
        .setFooter({ text: 'SmartsHub', iconURL: `https://cdn.discordapp.com/attachments/1136275750538981426/1311395662667059320/Mesa_de_trabajo_12.png?ex=6748b3e2&is=67476262&hm=32e4ec78bc97cf506b5c2d2f9bb740a9dc7b709bbafa290b915966612d151f1f&` })
        .setColor('00a4ff')
    try {
        await user.send({
            embeds: [usrEmbed],
            files: [transcript],
        });
    } catch (err) {
        console.error(`Error sending DM to ${user?.tag || 'unknown user'}:`, err);
    }

    // Step 2: Remove the user from the ticket channel (revoking permissions)
    await ticketChannel.permissionOverwrites.edit(ticket.creatorId, {
        ViewChannel: false,
    });

    // Step 3: Update the ticket in the database as closed

    await Tickets.updateOne(
        { ticketNumber },
        { status: 0, closedAt: new Date() }
    );

    // Step 4: Send a confirmation message in the ticket channel
    const closeEmbed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setDescription(`The ticket has been successfully closed. A transcript has been sent to user DM.`)
        .setColor('Red');

    const deleteBtn = new ButtonBuilder()
        .setCustomId('delete-ticket-channel')
        .setLabel('Delete Channel')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(deleteBtn);

    await interaction.editReply({
        embeds: [closeEmbed],
        components: [row]
    });

    // Step 5: Send an embed to the support channel notifying the closure
    const supportChannel = interaction.guild.channels.cache.get('1231713816966856875'); // Change with actual support channel ID
    const supportEmbed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setDescription(`Ticket #${ticketNumber} has been closed by ${user}.`)
        .setTimestamp()
        .setColor('Green');

    await supportChannel.send({ embeds: [supportEmbed], files: [transcript] });
};
