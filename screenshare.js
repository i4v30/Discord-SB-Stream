const { Client } = require('discord.js-selfbot-v13');
const { DiscordStreamClient } = require('discord-stream-client');
require('dotenv').config();
let y2mate;
const client = new Client();
const StreamClient = new DiscordStreamClient(client);

StreamClient.setResolution('720p');
// auto, 1440p, 1080p, 720p (60fps)
// 480p (30fps)

client.login(process.env.TOKEN);

client.on('ready', async () => {
	console.log(`--- ${client.user.tag} is ready ---`);
	y2mate = new (await import('y2mate-api')).Y2MateClient();
});

let connection;
let stream;
let player;

client.on('messageCreate', async (msg) => {
	if (msg.author.bot) return;
	if (![process.env.OWNER, client.user.id].includes(msg.author.id)) return;
	if (!msg.content?.startsWith(`$`)) return;
	const args = msg.content.trim().slice(1).split(' ');
	const command = args.shift().toLowerCase();
	if (command === 'join') {
		const voiceChannel = msg.member.voice?.channel;
		if (!voiceChannel) return;
		if (!connection)
			connection = await StreamClient.joinVoiceChannel(voiceChannel, {
				selfDeaf: true,
				selfMute: false,
				selfVideo: false,
			});
		if (voiceChannel.type == 'GUILD_STAGE_VOICE') {
			try {
				await msg.guild.members.me.voice.setSuppressed(false);
			} catch {
				console.log('Failed to unsuppress');
				try {
					await msg.guild.members.me.voice.setRequestToSpeak(true);
					console.log('Requested to speak');
					await new Promise((resolve) => setTimeout(resolve, 5000));
					await msg.guild.members.me.voice.setSuppressed(false);
					console.log('Unsuppressed');
				} catch {
					console.log('Failed to request to speak');
					connection = null;
					stream = null;
					player = null;
					StreamClient.leaveVoiceChannel();
				}
			}
		}
		if (connection && !stream) {
			// Screenshare
			stream = await connection.createStream();
		}
	}
	if (command === 'play') {
		let url = args[0];
		if (!url || !connection || !stream) return;
		if (player) player.stop();
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
		player = StreamClient.createPlayer(url, stream.udp);
		player.play({
			volume: 100, // 100%
			fps: 60,
			hwaccel: false,
			kbpsAudio: 128,
			kbpsVideo: 2500,
		});
		player.once('finish', () => {
			player = null;
			console.log('Finished playing');
		});
	}
	if (command === 'stop') {
		connection = null;
		stream = null;
		player = null;
		StreamClient.leaveVoiceChannel();
	}
	if (command === 'pause') {
		if (!player) return;
		player.pause();
	}
	if (command === 'resume') {
		if (!player) return;
		player.resume();
	}
	if (command === 'time') {
		if (!player) return;
		msg.channel.send(
			`${player.formattedCurrentTime}/${player.formattedDuration}`,
		);
	}
	if (command === 'stop') {
		connection = null;
		stream = null;
		player = null;
		StreamClient.leaveVoiceChannel();
	}
});

/* Message
$join
// Await join voice channel
$play https://www.youtube.com/watch?v=QH2-TGUlwu4
// Play video youtube with screen share mode
$stop
// Destroy all (leave voice channel and stop player)
*/