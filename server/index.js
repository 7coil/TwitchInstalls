const TwitchBot = require('node-twitchbot');
const spawn = require('child_process').spawn;
const config = require('config');
const fs = require('fs');

const logs = fs.createWriteStream('log.txt', { flags: 'w' });
const machine = 'Public-Windows-XP';

const mouse = {
	m_up: {
		x: 0,
		y: 20,
		name: 'up'
	},
	m_down: {
		x: 0,
		y: -20,
		name: 'down'
	},
	m_left: {
		x: -20,
		y: 0,
		name: 'left'
	},
	m_right: {
		x: 20,
		y: 0,
		name: 'right'
	}
};

const keys = [
	'again',
	'alt',
	'alt_r',
	'altgr',
	'altgr_r',
	'apostrophe',
	'asterisk',
	'backslash',
	'backspace',
	'bracket_left',
	'bracket_right',
	'caps_lock',
	'comma',
	'compose',
	'copy',
	'ctrl',
	'ctrl_r',
	'cut',
	'delete',
	'dot',
	'down',
	'end',
	'equal',
	'esc',
	'f1',
	'f2',
	'f3',
	'f4',
	'f5',
	'f6',
	'f7',
	'f8',
	'f9',
	'f10',
	'f11',
	'f12',
	'find',
	'front',
	'grave_accent',
	'help',
	'home',
	'insert',
	'kp_0',
	'kp_1',
	'kp_2',
	'kp_3',
	'kp_4',
	'kp_5',
	'kp_6',
	'kp_7',
	'kp_8',
	'kp_9',
	'kp_add',
	'kp_comma',
	'kp_decimal',
	'kp_divide',
	'kp_enter',
	'kp_multiply',
	'kp_subtract',
	'left',
	'less',
	'lf',
	'menu',
	'meta_l',
	'meta_r',
	'minus',
	'num_lock',
	'open',
	'paste',
	'pause',
	'pgdn',
	'pgup',
	'print',
	'props',
	'ret',
	'right',
	'ro',
	'scroll_lock',
	'semicolon',
	'shift',
	'shift_r',
	'slash',
	'spc',
	'stop',
	'sysrq',
	'tab',
	'undo',
	'unmapped',
	'up',
	'f1',
	'f2',
	'f3',
	'f4',
	'f5',
	'f6',
	'f7',
	'f8',
	'f9',
	'f10',
	'f11',
	'f12',
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z'
];

function log(d) {
	console.log(d);
	logs.write(`${d}\n`);
}

const Bot = new TwitchBot(config.get('api').twitch);

/* Connect bot to Twitch IRC */
Bot.connect().then(() => {
	log('Welcome to Moustacheminer Server Services');
	// Listen for all messages in channel
	Bot.listen((err, chatter) => {
		console.dir(chatter);
		if (mouse[chatter.msg]) {
			log(`${chatter.user}: Moved mouse ${mouse[chatter.msg].name}`);
			spawn('virsh', [
				'qemu-monitor-command',
				'--hmp',
				machine,
				'mouse_move',
				mouse[chatter.msg].x,
				mouse[chatter.msg].y
			]);
		} else if (chatter.msg.split('-', 4).every(elem => keys.includes(elem))) {
			log(`${chatter.user}: Pressed ${chatter.msg}`);
			spawn('virsh', [
				'qemu-monitor-command',
				'--hmp',
				machine,
				'sendkey',
				chatter.msg
			]);
		}
	});
}).catch((err) => {
	console.log('Connection error!');
	console.log(err);
});
