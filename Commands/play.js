const { Client, Message } = require('discord.js-selfbot-v13');
const { Y2MateClient } = require('y2mate-api');
const y2mate = new Y2MateClient();

module.exports = {
	name: 'play',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {
		if (!client.streamClient.connection)
			return message.reply('Not connected to a voice channel');
		let url = args[0];
        if (!url) return message.reply('No URL provided');
		if (client.player) client.player.stop();
		if (url.includes('youtube.com')) {
			const result = await y2mate.getFromURL(url, 'vi');
			if (result.page == 'detail') {
				url = await result.linksVideo.get('auto').fetch();
			} else if (result.page == 'playlist') {
				let video = await result.videos[0].fetch();
				url = await video.linksVideo.get('auto').fetch();
			}
			url = url.downloadLink;
		}
		client.player = client.streamClient.createPlayer(
			url,
			client.streamClient.connection?.streamConnection?.udp ||
				client.streamClient.connection.udp,
		);
		client.player.play({
			volume: 100,
			fps: 60,
			hwaccel: false,
			kbpsAudio: 128,
			kbpsVideo: 2500,
		});
		client.player.on('vp8Header', () => {
			message.reply('Started playing');
		});
        client.player.on('finish', () => {
			message.reply('Finished playing');
            client.player = null;
		});
	},
};
