const TwitchBot = require('node-twitchbot');
const spawn = require('child_process').spawn;
const config = require('config');
const fs = require('fs');

const logs = fs.createWriteStream('log.txt', { flags: 'w' });

const special = {
	m_up: {
		command: [
			'mouse_move',
			'0',
			'20'
		],
		type: 'mouse_move',
		message: 'Moved mouse upwards'
	},
	m_down: {
		command: [
			'mouse_move',
			'0',
			'-20'
		],
		message: 'Moved mouse downwards'
	},
	m_left: {
		command: [
			'mouse_move',
			'-20',
			'0'
		],
		message: 'Moved mouse left'
	},
	m_right: {
		command: [
			'mouse_move',
			'20',
			'0'
		],
		message: 'Moved mouse right'
	},
	l_click: {
		command: [
			'mouse_button',
			'1'
		],
		message: 'Pressed left mouse button'
	},
	m_click: {
		command: [
			'mouse_button',
			'2'
		],
		message: 'Pressed left mouse button'
	},
	r_click: {
		command: [
			'mouse_button',
			'3'
		],
		message: 'Pressed left mouse button'
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
	log(`Sending keypresses to: ${config.get('machine')}`);
	// Listen for all messages in channel
	Bot.listen((err, chatter) => {
		if (special[chatter.msg]) {
			log(`${chatter.user}: ${special[chatter.msg].message}`);

			const command = [
				'qemu-monitor-command',
				'--hmp',
				config.get('machine')
			].concat(special[chatter.msg].command);

			spawn('virsh', command);
		} else if (chatter.msg.split('-', 4).every(elem => keys.includes(elem))) {
			// Keypress parser

			log(`${chatter.user}: Pressed ${chatter.msg}`);
			spawn('virsh', [
				'qemu-monitor-command',
				'--hmp',
				config.get('machine'),
				'sendkey',
				chatter.msg
			]);
		}
	});
}).catch((err) => {
	console.log('Connection error!');
	console.log(err);
});
