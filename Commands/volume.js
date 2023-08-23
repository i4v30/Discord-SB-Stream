const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
	name: 'volume',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
		if (!client.player) return message.reply('Not playing anything');
		if (!args[0])
			return message.reply(
				`Current volume is ${
					client.player.volumeManager.volume * 100
				} %`,
			);
		client.player.volumeManager.setVolume(parseInt(args[0]) / 100);
		message.reply(
			`Current volume is ${client.player.volumeManager.volume * 100} %`,
		);
	},
};
