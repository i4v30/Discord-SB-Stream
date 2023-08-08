const { Client } = require('discord.js-selfbot-v13');
const { DiscordStreamClient } = require('discord-stream-client');
require('dotenv').config();

const fs = require('fs');

const client = new Client();
const StreamClient = new DiscordStreamClient(client);

StreamClient.setResolution('720p');

const commands = new Map();

client.login(process.env.TOKEN);

client.on('ready', async () => {
	console.log(`--- ${client.user.tag} is ready ---`);
	fs.readdirSync('./Commands')
		.filter((file) => file.endsWith('.js'))
		.forEach((file) => {
			try {
				const command = require(`./Commands/${file}`);
				commands.set(command.name, command);
                console.log(`Loaded ${command.name}`);
			} catch (err) {
				console.log(err);
			}
		});
});

client.on('messageCreate', async (msg) => {
	if (msg.author.bot) return;
	if (![process.env.OWNER, client.user.id].includes(msg.author.id)) return;
	if (!msg.content?.startsWith(process.env.PREFIX)) return;
	const args = msg.content.trim().slice(process.env.PREFIX.length).split(' ');
	const command = args.shift().toLowerCase();
	if (commands.has(command)) {
        try {
            await commands.get(command).run(client, msg, args);
        } catch (err) {
            console.log(err);
        }
    }
});
