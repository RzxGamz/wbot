const con = require('./core/connect');
const wa = require('./core/helper');
const { color } = require('./utils');
const { sticker } = require("./core/convert");
const { buttonsParser } = require('./core/parser');
const Baileys = require('@adiwajshing/baileys');
const cron = require('./utils/cronjob');
const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
const moment = require('moment-timezone');
const djs = require('@discordjs/collection');
const joinHandler = require("./group_event");
const { owner } = require('./config.json')
const ev = con.Whatsapp;
const prefix = '#';
const multi_pref = new RegExp('^[' + '!#$%&?/;:,.<>~-+='.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');
const time = moment.tz('Asia/jakarta').format('DD/MM/YY HH:mm:ss');

djs.commands = new djs.Collection();
const cooldown = new djs.Collection();
djs.prefix = prefix;

function readCmd() {
	let dir = fs.readdirSync('./commands');
	dir.forEach(async (res) => {
		const commandFiles = fs.readdirSync(`./commands/${res}`).filter((file) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`./commands/${res}/${file}`);
			djs.commands.set(command.name, command);
                        console.log(color(`${command.name}.js`));
		}
	});
	console.log(color('[SYS]', 'yellow'), 'command loaded!');
}
readCmd()

con.connect();
process.on('uncaughtException', console.error);
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

function printLog(isCmd, body, sender, groupName, isGroup, from) {
	const time = moment.tz('Asia/Jakarta').format('DD/MM/YY HH:mm:ss');
	if (isCmd && isGroup) {
		return console.log(color(`[${time}]`, 'yellow'), color('[EXEC]', 'aqua'), color(body, 'aqua'), color(`${sender.split('@')[0]}`, 'lime'), 'in', color(`${groupName} ${from}`, 'lime'));
	}
	if (isCmd && !isGroup) {
		return console.log(color(`[${time}]`, 'yellow'), color('[EXEC]', 'aqua'), color(body, 'aqua'), color(`${sender.split('@')[0]}`, 'lime'));
	}
}

/* Cron */
cron(ev);

ev.on('CB:action,,battery', (b) => {
	ev['battery']['value'] = parseInt(b[2][0][1].value)
	ev['battery']['charge'] = b[2][0][1].live === 'false' ? false : true
	ev['battery']['lowPower'] = b[2][0][1].powersave === 'false' ? false : true
});

ev.on('message-delete', async (m) => {
if (!m.key.fromMe) {
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
const jam = moment.tz('Asia/Jakarta').format('HH:mm:ss')
let d = new Date
let c = ev.chats.get(m.key.remoteJid)
let a = c.messages.dict[`${m.key.id}|${m.key.fromMe ? 1 : 0}`]
let co3ntent = ev.generateForwardMessageContent(a, false)
let c3type = Object.keys(co3ntent)[0]
let locale = 'id'
let gmt = new Date(0).getTime() - new Date('1 Januari 2021').getTime()
let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let calender = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
//ev.copyNForward(m.key.remoteJid, m.message)
//ev.sendMessage(m.key.remoteJid, `ANTI DELETE\n\n▢ Nama : @${m.participant.split("@")[0]}\n▢ Tipe : ${c3type}\n▢ Tanggal : ${jam} - ${week} ${weton} - ${calender}`, MessageType.text, {quoted: m.message, contextInfo: {"mentionedJid": [m.participant]}})
if (m.key.remoteJid == 'status@broadcast') {
ev.sendMessage(m.key.remoteJid, { contentText: `Hai @${m.participant.split("@")[0]}\nSelamat ${salam}\n\nAda yang bisa saya bantu?\nSilahkan ketik #menu untuk menampilkan menu`, footerText: "Shell Bot", buttons: [{buttonId: "/menu", buttonText: { displayText: "MENU" }, type: 1}], headerType: "EMPTY" }, "buttonsMessage", { quoted: m.message, contextInfo: { mentionedJid: [m.participant] }})
}
}
});

ev.on("group-participants-update", async (json) => {
	joinHandler(json)
});

ev.on('chat-update', async (msg) => {
	try {
		if (!msg.hasNewMessage) return;
		msg = await wa.serialize(msg);
		if (!msg.message) return;
		if (msg.key && (msg.key.remoteJid === 'status@broadcast' || msg.key.id.startsWith('3EB0') && msg.key.id.length === 12)) return;
                msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
		// if (!msg.key.fromMe) return;
		let { type, isGroup, sender, from, body } = msg;
		switch (type) {
			case 'audioMessage':
			case 'videoMessage':
			case 'imageMessage':
			case 'stickerMessage':
			case 'documentMessage': {
				if (!msg.key.fromMe) await Baileys.delay(1000)
				if (!msg.message[type].url) await ev.updateMediaMessage(msg)
				break
			}
		}
		let temp_pref = multi_pref.test(body) ? body.split('').shift() : '!';
		if (body === 'prefix' || body === 'cekprefix') {
			wa.reply(from, `My prefix ${prefix}`, msg);
		}
		if (type === 'buttonsResponseMessage' && !body.startsWith(temp_pref)) {
			buttonsParser(msg);
		} else if (type === 'buttonsResponseMessage' && body.startsWith(temp_pref)) {
			msg.message = { conversation: msg.message.buttonsResponseMessage.selectedButtonId };
		}
		body = type === 'conversation' && body.startsWith(temp_pref) ? body : (type === 'imageMessage' || type === 'videoMessage') && body && body.startsWith(temp_pref) ? body : type === 'ephemeralMessage' && body.startsWith(temp_pref) ? body : type === 'extendedTextMessage' && body.startsWith(temp_pref) ? body : type === 'buttonsResponseMessage' && body.startsWith(temp_pref) ? body : type === 'listResponseMessage' && body.startsWith(temp_pref) ? body : '';
		const arg = body.substring(body.indexOf(' ') + 1);
		const args = body.trim().split(/ +/).slice(1);
		const isCmd = body.startsWith(temp_pref);

		const groupMeta = isGroup ? await ev.groupMetadata(from) : '';
		const groupSubject = isGroup ? groupMeta.subject : '';
		
		let blockList = ev.blocklist.map(v => v.replace(/\D/g, '') + '@s.whatsapp.net').filter(v => v !== ev.user.jid);
		if (blockList.includes(sender)) return;
		
		// setInterval(() => fs.writeFileSync('./database.json', JSON.stringify(db, null, 2)), 60*1000);
		printLog(isCmd, body, sender, groupSubject, isGroup, from);
		
		if (type === 'imageMessage' && !isCmd && !isGroup) {
			let media = await ev.downloadMediaMessage(msg)
			sticker(media, { isImage: true, cmdType: 1 }).then(v => wa.sticker(from, v, { quoted: msg }))
		} else if (type === 'videoMessage' && !isCmd && !isGroup) {
			let media = await ev.downloadMediaMessage(msg)
			sticker(media, { isVideo: true, cmdType: 1 }).then(v => wa.sticker(from, v, { quoted: msg }))
		}
		
		if (/^>?> /.test(body)) {
			if (!owner.includes(sender)) return
			let teks
			try { teks = await eval(`(async () => { ${(/^>>/.test(body) ? 'return ' : '') + arg} })()`) }
			catch (e) { teks = e }
			finally { wa.reply(from, util.format(teks), msg) }
		}
		if (/^[$] /.test(body)) {
			if (!owner.includes(sender)) return
			await wa.reply(from, 'Executing...', msg)
			exec(arg, (error, stdout) => {
				if (error) wa.reply(from, String(error), msg)
				else wa.reply(from, String(stdout), msg)
			})
		}

		const commandName = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
		const command = djs.commands.get(commandName) || djs.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		if (!cooldown.has(from)) {
			cooldown.set(from, new djs.Collection());
		}

		const now = Date.now();
		const timestamps = cooldown.get(from);
		const cooldownAmount = (command.cooldown || 2) * 1500;

		if (timestamps.has(from)) {
			const expirationTime = timestamps.get(from) + cooldownAmount;

			if (now < expirationTime) {
				if (isGroup) {
					let timeLeft = (expirationTime - now) / 1000;
					console.log(color(`[${time}]`, 'yellow'), color('[SPAM]', 'red'), color(`${sender.split('@')[0]}`, 'lime'), 'in', color(groupSubject, 'lime'));
					return wa.reply(from, `*Jangan Spam !!! Mohon tunggu setelah ${timeLeft.toFixed(1)} detik*`, msg)
				}
				if (!isGroup) {
					let timeLeft = (expirationTime - now) / 1000;
					console.log(color(`[${time}]`, 'yellow'), color('[SPAM]', 'red'), color(`${sender.split('@')[0]}`, 'lime'));
					return wa.reply(from, `*Jangan Spam !!! Mohon tunggu setelah ${timeLeft.toFixed(1)} detik*`, msg)
				}
			}
		}

		timestamps.set(from, now);
		setTimeout(() => timestamps.delete(from), cooldownAmount);

		try {
			command.execute(msg, wa, args, arg);
		} catch (err) {
			console.error(err);
		}
	} catch (e) {
		console.log(`Error: ${e}`);
	}
});
