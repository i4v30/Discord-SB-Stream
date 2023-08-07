const { Client, Message } = require('discord.js-selfbot-v13');
const ffprobe = require('ffprobe-static');
const ffmpeg = require('ffmpeg-static');
const ytdl = require('ytdl-core');
const getYouTubeID = require('get-youtube-id');

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
		let url = args.join(' ');
		if (!url) return message.reply('No URL provided');
		if (client.player) client.player.stop();
		const videoId = getYouTubeID(url);
		if (videoId) {
			try {
				url = await ytdl.getInfo(videoId).then((info) => {
					const format = ytdl.chooseFormat(info.formats, {
						quality: '18', // 360p (because 360p has both audio and video)
					});
					return format.url;
				});
			} catch (e) {
				message.reply('Error getting video info');
				return console.log(e);
			}
		}
		client.player = client.streamClient.createPlayer(
			url,
			client.streamClient.connection?.streamConnection?.udp ||
				client.streamClient.connection.udp,
			{
				ffmpeg: ffmpeg,
				ffprobe: ffprobe.path,
			},
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
