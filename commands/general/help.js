const djs = require('@discordjs/collection');
const con = require('../../core/connect');
const crypto = require('crypto')
const ev = con.Whatsapp;
const moment = require('moment-timezone')
const time = moment.tz('Asia/Jakarta').format('HH:mm:ss')
const ucapan = "Selamat "+ moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')

var countDownDate = new Date("April, 02, 2022 04:15:00").getTime();
var now = new Date(new Date().getTime() + 25200000).getTime();
var distance = countDownDate - now;
var hD = Math.floor(distance / (1000 * 60 * 60 * 24));
var hH = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var hM = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
var hS = Math.floor((distance % (1000 * 60)) / 1000);
var hitungRamadhan = `${hD} Hari ${hH} Jam ${hM} Menit ${hS} Detik`
        
let d = new Date(new Date + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
       day: 'numeric',
       month: 'long',
       year: 'numeric'
})
let dateIslam = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
}).format(d)

const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

module.exports = {
  name: 'help',
  aliases: ['h', 'cmd', 'menu'],
  category: 'general',
  desc: 'show help message.',
  async execute(msg, wa, args) {
    if (args[0]) {
      const data = [];
      const name = args[0].toLowerCase();
      const prefix = msg.body.slice(0, 1);
      const { commands } = djs;
      const command = commands.get(name) || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
      if (!command) return wa.reply(msg.from, 'Perintah tidak tersedia.', msg);
      else data.push(command.name);
      if (command.aliases) data.push(`*Aliases:* ${command.aliases.join(', ')}`);
      if (command.desc) data.push(`*Description:* ${command.desc}`);
      if (command.use) data.push(`*Usage:* ${prefix}${command.name} ${command.use}\n\nNote: [] = optional, | = or, <> = must filled`);

      return wa.reply(msg.from, `${data.join('\n')}`, msg);
    } else {
      const { sender, body } = msg;
      const prefix = body.slice(0, 1);
      const { commands } = djs;
      const cmds = commands.keys()
      const pushname = msg.key.fromMe ? ev.user.name :
        ev.contacts[sender] !== undefined
          ? ev.contacts[sender].notify || ev.contacts[sender].vname || ev.contacts[sender].name
          : undefined;
      let categories = [];
      for (let cmd of cmds) {
        let info = commands.get(cmd);
        if (!cmd) continue;
        if (!info.category || info.category === 'private') continue;
        if (Object.keys(categories).includes(info.category)) categories[info.category].push(info);
        else {
          categories[info.category] = [];
          categories[info.category].push(info);
        }
      }
      let str = `Hello, @${sender.split("@")[0]}\n${ucapan}\n\n*Time :* ${time} WIB\n*Date :* ${week} ${weton}, ${date}\n*Date Islam :* ${dateIslam}\n\n*Ramadhan 1443 H*\n${hitungRamadhan}\n\n_Here are all the commands from my bot_\n${readmore}\n`;
      const keys = Object.keys(categories);
      for (const key of keys) {
        str += `*${key.toUpperCase()}*\n${categories[key]
          .map((command) => `??? ${prefix}${command.name}`)
          .join('\n')}\n\n`;
      }
      str += `send ${prefix}help followed by a command name to get detail of command, e.g. ${prefix}help sticker`;
      let buttons = [
        { buttonId: '/owner', buttonText: { displayText: 'OWNER' }, type: 1 },
        { buttonId: '/stats', buttonText: { displayText: 'STATUS' }, type: 1 }
      ]
      //wa.sendButtons(msg.from, str, ' ', buttons, { quoted: msg, contextInfo: { mentionedJid: [sender] }})
      //let loc = await ev.prepareMessage(msg.from, require('fs').readFileSync('././temp/img.png'), 'locationMessage', { thumbnail: require('fs').readFileSync('././temp/img.png') })
      let rMime = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      let randomMime = rMime[Math.floor(Math.random() * rMime.length)]
      let doc = { "url": "https://mmg.whatsapp.net/d/f/Ano5cGYOFQnC51uJaqGBWiCrSJH1aDCi8-YPQMMb1N1y.enc", "mimetype": randomMime, "title": "@ShellsBot", "fileSha256": "8Xfe3NQDhjwVjR54tkkShLDGrIFKR9QT5EsthPyxDCI=", "fileLength": 50000000000, "pageCount": 404, "mediaKey": "XWv4hcnpGY51qEVSO9+e+q6LYqPR3DbtT4iqS9yKhkI=", "fileName": "s????????? ???????? ???????????s?????????", "fileEncSha256": "NI9ykWUcXKquea4BmH7GgzhMb3pAeqqwE+MTFbH/Wk8=", "directPath": "/v/t62.7119-24/35160407_568282564396101_3119299043264875885_n.enc?ccb=11-4&oh=d43befa9a76b69d757877c3d430a0752&oe=61915CEC", "mediaKeyTimestamp": "1634472176", "jpegThumbnail": require('fs').readFileSync('././temp/img.jpg') }
      ev.sendMessage(msg.from, { documentMessage: doc, contentText: str, footerText: "Shell Bot", buttons: buttons, headerType: "DOCUMENT" }, "buttonsMessage", { quoted: msg, contextInfo: { externalAdReply: { title: "Shell Bot", body: "", mediaType: "2", thumbnail: require('fs').readFileSync('././temp/thb.png'), mediaUrl: `https://www.instagram.com` }, mentionedJid: [sender] }})
    }
  },
};
