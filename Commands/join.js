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
        if (!["DM", "GROUP_DM", "GUILD_VOICE"].includes(channel.type)) return message.reply(
            "Channel type must be `DM`, `GROUP_DM`, or `GUILD_VOICE`"
        );
        const type = args[0]?.toLowerCase();
        if (!["cam", "golive"].includes(type)) return message.reply(
            "Type must be `cam` or `golive`"
        );
        await client.streamClient.joinVoiceChannel(channel, {
			selfDeaf: true,
			selfMute: false,
			selfVideo: type !== "golive",
		});
        if (type !== "cam") {
            await client.streamClient.connection.createStream();
        }
        return message.reply(`Joined ${channel}`);
    }
}