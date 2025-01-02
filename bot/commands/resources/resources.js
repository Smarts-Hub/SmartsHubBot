import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, PermissionFlagsBits } from 'discord.js';
import Resources from '../../../models/Resources.js';
import base64 from "base64-encode";
import axios from "axios";
export const data = new SlashCommandBuilder()
    .setName('resource')
    .setDescription('Manage resources')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a new resource')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('The name of the resource')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('description')
                    .setDescription('The description of the resource')
                    .setRequired(true)
            )
            .addUserOption(option =>
                option
                    .setName('author')
                    .setDescription('The main developer (author) of the resource')
                    .setRequired(true)
            )
            .addStringOption(option => 
                option
                    .setName('type')
                    .setDescription('The type')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Spigot/Paper Plugin', value: 'Spigot/Paper Plugin' },
                        { name: 'Bungeecord/Velocity Plugin', value: 'Bungeecord/Velocity Plugin' },
                        { name: 'Discord bot', value: 'Discord bot' },
                        { name: 'Pterodactyl addon/theme', value: 'Pterodactyl addon/theme' },
                        { name: 'Website template', value: 'Website template' },
                        { name: 'Server setup', value: 'Server setup' },
                        { name: 'Other', value: 'Other' }
                    )
            )
            .addStringOption(option =>
                option
                    .setName('price')
                    .setDescription('The current price of the resource (0 for free)')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('builtbybit')
                    .setDescription('The URL to the resource from BuiltByBit.com')
                    .setRequired(true)
            )
            .addAttachmentOption(option => 
                option
                    .setName('cover')
                    .setDescription('The cover image for the resource. Leave empty for no cover')
                    .setRequired(false)
            )

            .addStringOption(option =>
                option
                   .setName('spigot')
                   .setDescription('The URL to the resource from Spigot.org')
                   .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
           .setName('update')
           .setDescription('Post an update to a resource')
           .addStringOption(option =>
                option
                   .setName('name')
                   .setDescription('Wich resource to update')
                   .setRequired(true)
           )
           .addStringOption(option =>
                option
                   .setName('version')
                   .setDescription('The new version')
                   .setRequired(true)
           )
           .addStringOption(option =>
                option
                   .setName('changelog')
                   .setDescription('What changed')
                   .setRequired(true)
           )
        );

export const execute = async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    if(subcommand === 'create') {
        const name = interaction.options.getString('name');
        const cover = interaction.options.getAttachment('cover'); 
        const description = interaction.options.getString('description');
        const author = interaction.options.getUser('author'); 
        const type = interaction.options.getString('type');
        const price = interaction.options.getString('price');
        const platform1 = interaction.options.getString('builtbybit');
        const platform2 = interaction.options.getString('spigot');

        let coverBase64;
        if (cover) {
            try {
                // Descargar el archivo como un Buffer
                const response = await axios.get(cover.url, { responseType: 'arraybuffer' });
                const coverBuffer = Buffer.from(response.data);
            
                // Convertir el Buffer a Base64
                coverBase64 = coverBuffer.toString('base64');
            
            } catch (error) {
                console.error('Error converting attachment to Base64:', error);
                await interaction.reply({ content: 'Failed to process the attachment.', ephemeral: true });
            }
        }
        
        
        const resource = new Resources({
            name,
            description,
            author: author.id,
            type,
            price,
            platforms: [platform1, platform2],
            image: coverBase64,
        })

        const embed = new EmbedBuilder()
            .setTitle(`<:new1:1291768188799029248><:new2:1291768242301435914><:new3:1291768275478515822> ${name}`)
            .setDescription(`${description}`)
            .addFields(
                { name: 'Created by', value: `${author}`, inline: true },
                { name: 'Type', value: `${type}`, inline: true },
                { name: 'Price', value: `$${price}`, inline: true },
                { name: 'BuiltByBit <:builtbybit:1291768699392622674>', value: `[Click here](${platform1})`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'SmartsHub', iconURL: `https://cdn.discordapp.com/attachments/1136275750538981426/1311395662667059320/Mesa_de_trabajo_12.png?ex=6748b3e2&is=67476262&hm=32e4ec78bc97cf506b5c2d2f9bb740a9dc7b709bbafa290b915966612d151f1f&` })
            .setColor('00ff9d')

            if(cover) {
                embed.setImage(cover.url);
            }
            if(platform2) {
                embed.addFields(
                    { name: 'Spigot <:spigot:1291768776014041108>', value: `[Click here](${platform2})`, inline: true }
                )
            }
        
        
        await resource.save();
        const channel = interaction.guild.channels.cache.get('1292523403290480691')
        if(true) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return await channel.send({ embeds: [embed] })
        }

    } else if(subcommand === 'update') {
        const name = interaction.options.getString('name');
        const version = interaction.options.getString('version');
        const changelog = interaction.options.getString('changelog');
        const resource = await Resources.findOne({ name: name });
        if(!resource) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription(`No resource found with the name "${name}"`)
            
            interaction.reply({ embeds: [embed] })
        }
        await Resources.findOneAndUpdate({ name }, { $push: { updates: { version } } }, { new: false });
        

        

        const embed = new EmbedBuilder()
            .setTitle(`<:update1:1291768337361014919><:update2:1291768367916777584><:update3:1291768411302662305> ${name}`)
            .setDescription(` ${name} v${version}`) 
            .setDescription(changelog)
            .addFields(
                { name: 'Update posted by', value: `${interaction.user}`, inline: true },
                { name: 'Price', value: `${resource.price}`, inline: true },
                { name: 'Version', value: `${version}`, inline: true },
                { name: 'BuiltByBit <:builtbybit:1291768699392622674>', value: `[Click here](${resource.platforms[0]}) `, inline: true },
                )
            .setColor('00a4ff')
            .setTimestamp()
            .setFooter({ text: 'SmartsHub', iconURL: `https://cdn.discordapp.com/attachments/1136275750538981426/1311395662667059320/Mesa_de_trabajo_12.png?ex=6748b3e2&is=67476262&hm=32e4ec78bc97cf506b5c2d2f9bb740a9dc7b709bbafa290b915966612d151f1f&` });
            if(resource.platforms[1]) {
                embed.addFields(
                    { name: 'Spigot <:spigot:1291768776014041108>', value: `[Click here](${resource.platforms[1]})`, inline: true }
                )
            }

        

        await resource.save();
        const channel = interaction.guild.channels.cache.get('1255507792329052290')
        if(channel) {
            interaction.reply({ embeds: [embed], ephemeral: true  })
            return await channel.send({ embeds: [embed] })
        }
    }
};
