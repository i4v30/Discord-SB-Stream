const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
	name: 'stop',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
		if (!client.player) return message.reply('Not playing anything');
        client.player.stop();
        client.player = null;        
        message.reply('Stopped playing');
	},
};
