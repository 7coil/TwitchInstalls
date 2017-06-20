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
		console.log(chatter.msg);
		if (mouse[chatter.msg]) {
			spawn('virsh', [
				'qemu-monitor-command',
				'--hmp',
				machine,
				'mouse_move',
				mouse[chatter.msg].x,
				mouse[chatter.msg].y
			]);
		} else {
			spawn('virsh', [
				'qemu-monitor-command',
				'--hmp',
				machine,
				'sendkey',
				chatter.msg.substring(0, 50)
			]);
		}
	});
}).catch((err) => {
	console.log('Connection error!');
	console.log(err);
});
