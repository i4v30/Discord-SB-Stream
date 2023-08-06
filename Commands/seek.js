const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
	name: 'seek',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
		if (!client.player) return message.reply('Not playing anything');
        if (!args[0]) return message.reply('Please provide a time to seek to (in seconds)');
		client.player.seek(parseInt(args[0]));
		message.reply('Seeked');
	},
};
