export const execute = (client, member) => {
  const channel = member.guild.channels.cache.get('1228618861356519439')
  
  const welcomes = [`A new user has appeared on the server! ${member.user}, welcome to **SmartsHub**!`, 
    `${member.user} we are waiting for your pizza! Welcome to **SmartsHub**!`,
    `${member.user} has joined the party! *Whoops!*`,
    `What is better than a friday? A new user like ${member.user}!`]
  const randomWelcome = welcomes[Math.floor(Math.random() * welcomes.length)];

  channel.send(randomWelcome);
};
    