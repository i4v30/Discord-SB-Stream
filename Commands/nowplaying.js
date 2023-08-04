const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
	name: 'nowplaying',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
		if (!client.player) return message.reply('Not playing anything');
        message.reply(
			`${client.player.formattedCurrentTime}/${client.player.formattedDuration}`,
		);
	},
};
