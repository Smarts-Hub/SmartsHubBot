export async function execute(_, member) {
	const channel = member.guild.channels.cache.get('1228618861356519439');


	let salutation = await fetch(`https://gemini-rest.vercel.app/api/?prompt=${encodeURIComponent(
`
You are a discord bot please salute the new user as they joined the server, to mention them
in here use ${member.user} but the salutation is not direct, it's an analogy that
someone has joined the server in short form.
`
	)}`)
		.then((res) => res.json())
		.then((res) => res.response)
		.catch(() => undefined);
	
	if (!salutation) {
		const predefined_welcomes = [
			`A new user has appeared on the server! ${member.user}, welcome to **SmartsHub**!`, 
			`${member.user} we are waiting for your pizza! Welcome to **SmartsHub**!`,
			`${member.user} has joined the party! *Whoops!*`,
			`What is better than a friday? A new user like ${member.user}!`
		];
		
		salutation = predefined_welcomes[Math.floor(Math.random() * predefined_welcomes.length)];
	}

	channel.send(randomWelcome);
};

