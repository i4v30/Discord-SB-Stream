const { Client, Message } = require('discord.js-selfbot-v13');
const ffprobe = require('ffprobe-static');
const ffmpeg = require('ffmpeg-static');
const { executablePath } = require('puppeteer');
const { launch, getStream } = require('puppeteer-stream');

module.exports = {
	name: 'web',
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
		const browser = await launch({
			defaultViewport: {
				width: 1280,
				height: 720,
			},
			executablePath: executablePath(),
			args: ['--headless=new'],
		});

		const page = await browser.newPage();
		await page.goto(url);
		const stream = await getStream(page, {
			audio: true,
			video: true,
			mimeType: 'video/webm;codecs=vp8,opus',
		});
		client.player = client.streamClient.createPlayer(
			stream, // Make sure to pass the stream with the audio and video
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
