const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
	name: 'leave',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
		if (!client.streamClient.connection) return message.reply('Not in a voice channel');
        client.streamClient.leaveVoiceChannel();
        message.reply('Left voice channel');
	},
};
