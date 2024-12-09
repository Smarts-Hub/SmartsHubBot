import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import Tickets from '../../models/Tickets.js';
import pkg from 'discord-html-transcripts';



export const execute = async (client, interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'license-ticket') {
            await interaction.reply({ content: 'Creating your ticket...', ephemeral: true });


            const ticketCount = await Tickets.countDocuments();
            const ticketNumber = ticketCount + 1;

            const channel = await interaction.guild.channels.create({
                name: `licenses-${ticketNumber}`,
                type: ChannelType.GuildText,
                parent: '1273030223188721665',
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: '1228618861356519435',
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            });

            await channel.send(`<@&1271395014781440071>, ${interaction.user}`);

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`Ticket #${ticketNumber} - Created by ${interaction.user.tag}`)
                .setDescription(`Our staff members will be shortly with you. Meanwhile you can send the image that proofs your purchase.`)
                .addFields(
                    { name: 'Ticket number', value: `${ticketNumber}`, inline: true },
                    { name: 'Ticket type', value: 'License', inline: true },
                    { name: 'Creation date', value: new Date().toLocaleString(), inline: true },
                    { name: 'User roles', value: `${interaction.member.roles.cache.map(r => r.name).join(', ')}`, inline: false }
                )
                .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
                .setColor('00ff9d');

            const closeBtn = new ButtonBuilder()
                .setCustomId('close-ticket')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Close Ticket')
            
            const row = new ActionRowBuilder()
                .addComponents(closeBtn);

            channel.send({ embeds: [ticketEmbed], components: [row] });


            const newTicket = new Tickets({
                channelId: channel.id,
                ticketNumber,
                creatorId: interaction.user.id,
                status: 1,
                claimed: false,
                createdAt: new Date()
            });
            await newTicket.save();

            // Send to support channel
            const supportChannel = interaction.guild.channels.cache.get('1311725170230300742');
            const supportEmbed = new EmbedBuilder()
                .setTitle('New license ticket')
                .setDescription(`The user <@${interaction.user.id}> has created a new ticket (<#${channel.id}>).`)
                .setTimestamp()
                .setColor('Yellow');

            await supportChannel.send({ embeds: [supportEmbed] });
            await interaction.editReply('Your ticket is ready!')
        }else if (interaction.customId === 'support-ticket') {
            await interaction.reply({ content: 'Creating your ticket...', ephemeral: true });


            const ticketCount = await Tickets.countDocuments();
            const ticketNumber = ticketCount + 1;

            const channel = await interaction.guild.channels.create({
                name: `support-${ticketNumber}`,
                type: ChannelType.GuildText,
                parent: '1273030223188721665',
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: '1228618861356519435',
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            }); 

            await channel.send(`<@&1271395014781440071>, ${interaction.user}`);

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`Ticket #${ticketNumber} - Created by ${interaction.user.tag}`)
                .setDescription(`Our staff members will be shortly with you. Meanwhile you can describe what is happening.`)
                .addFields(
                    { name: 'Ticket number', value: `${ticketNumber}`, inline: true },
                    { name: 'Ticket type', value: 'Support', inline: true },
                    { name: 'Creation date', value: new Date().toLocaleString(), inline: true },
                    { name: 'User roles', value: `${interaction.member.roles.cache.map(r => r.name).join(', ')}`, inline: false }
                )
                .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
                .setColor('00ff9d');

            const closeBtn = new ButtonBuilder()
                .setCustomId('close-ticket')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Close Ticket')
            
            const row = new ActionRowBuilder()
                .addComponents(closeBtn);

            channel.send({ embeds: [ticketEmbed], components: [row] });


            const newTicket = new Tickets({
                channelId: channel.id,
                ticketNumber,
                creatorId: interaction.user.id,
                status: 1,
                claimed: false,
                createdAt: new Date()
            });
            await newTicket.save();

            // Send to support channel
            const supportChannel = interaction.guild.channels.cache.get('1311725170230300742');
            const supportEmbed = new EmbedBuilder()
                .setTitle('New support ticket')
                .setDescription(`The user <@${interaction.user.id}> has created a new ticket (<#${channel.id}>).`)
                .setTimestamp()
                .setColor('Yellow');

            await supportChannel.send({ embeds: [supportEmbed] });
            await interaction.editReply('Your ticket is ready!')

            ////////////////////////////////////////////////



        }else if (interaction.customId === 'close-ticket') {
            await interaction.deferReply();
            const ticketChannel = interaction.channel;
            
            const ticketNumber = ticketChannel.name.split('-')[1];

            const ticket = await Tickets.findOne({ ticketNumber})
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
                .setDescription(`Ticket #${ticketNumber} has been closed by ${user.tag}.`)
                .setTimestamp()
                .setColor('Green');

            await supportChannel.send({ embeds: [supportEmbed], files: [transcript] });
        } else if (interaction.customId === 'delete-ticket-channel') {
            // Step 6: Delete the ticket channel when the button is pressed
            const ticketChannel = interaction.channel;
            await ticketChannel.delete();
        }
    }
  };
  