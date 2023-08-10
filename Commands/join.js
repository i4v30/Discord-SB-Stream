const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
	name: 'join',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
		const channel = message.member?.voice?.channel || message.channel;
		if (
			!['DM', 'GROUP_DM', 'GUILD_VOICE', 'GUILD_STAGE_VOICE'].includes(
				channel.type,
			)
		)
			return message.reply(
				'Channel type must be `DM`, `GROUP_DM`, `GUILD_VOICE` or `GUILD_STAGE_VOICE`',
			);
		const type = args[0]?.toLowerCase();
		if (!['cam', 'golive'].includes(type))
			return message.reply('Type must be `cam` or `golive`');
		await client.streamClient.joinVoiceChannel(channel, {
			selfDeaf: true,
			selfMute: false,
			selfVideo: type !== 'golive',
		});
		if (type !== 'cam') {
			await client.streamClient.connection.createStream();
		}
		if (channel.type == 'GUILD_STAGE_VOICE') {
			try {
				await message.guild.members.me.voice.setSuppressed(false);
			} catch {
				try {
					await message.guild.members.me.voice.setRequestToSpeak(
						true,
					);
					message.reply('Waiting for request to speak');
					await new Promise((resolve) => setTimeout(resolve, 5000));
					await message.guild.members.me.voice.setSuppressed(false);
				} catch {
					message.reply('Failed to request to speak');
					client.streamClient.leaveVoiceChannel();
				}
			}
		}
		return message.reply(`Joined ${channel}`);
	},
};
