import { EmbedBuilder } from "discord.js";

export const execute = async (client, message) => {
  if (message.partial) {
    // Intenta obtener el mensaje completo si es parcial
    try {
      await message.fetch();
    } catch (error) {
      console.error("Error al recuperar el mensaje parcial:", error);
      return;
    }
  }

  // Crea un embed para mostrar el mensaje eliminado
  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Deleted Message")
    .addFields(
      { name: "Author", value: `${message.author}`, inline: true },
      { name: "Channel", value: `${message.channel}`, inline: true },
      { name: "Content", value: message.content || "*Empty*", inline: false }
    )
    .setTimestamp();

  // Enviar el embed al canal donde ocurrió el evento
  if (message.guild) {
    const logChannel = message.guild.channels.cache.get('1231713816966856875');
    if (logChannel) {
      logChannel.send({ embeds: [embed] });
    } else {
      console.warn("Canal de logs no encontrado.");
    }
  }
};
