const TwitchBot = require('node-twitchbot');
const spawn = require('child_process').spawn;
const config = require('config');

const machine = 'Public-Windows-XP';

const mouse = {
	m_up: {
		x: 0,
		y: 20
	},
	m_down: {
		x: 0,
		y: -20
	},
	m_left: {
		x: -20,
		y: 0
	},
	m_right: {
		x: 20,
		y: 0
	}
};

const Bot = new TwitchBot(config.get('api').twitch);

/* Connect bot to Twitch IRC */
Bot.connect().then(() => {
	console.log('Hello world!');

	// Listen for all messages in channel
	Bot.listen((err, chatter) => {
		if (mouse[chatter]) {
			spawn('virsh', [
				'qemu-monitor-command',
				'--hmp',
				machine,
				'mouse_move',
				mouse[chatter].x,
				mouse[chatter].y
			]);
		} else {
			spawn('virsh', [
				'qemu-monitor-command',
				'--hmp',
				machine,
				'sendkey',
				chatter.toLowerCase().subscring(0, 10)
			]);
		}
	});
}).catch((err) => {
	console.log('Connection error!');
	console.log(err);
});
