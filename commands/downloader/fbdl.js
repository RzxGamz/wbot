const BT = require('@bochilteam/scraper')
const lang = require('../other/text.json')

const errMess = `ID:\n${lang.indo.util.download.fbFail}\n\nEN:\n${lang.eng.util.download.fbFail}`

module.exports = {
  name: 'fb',
  aliases: ['fbdl', 'facebook'],
  category: 'Downloader',
  desc: 'Download Facebook video',
  async execute(msg, wa, args) {
    try {
      if (!args[0]) return wa.reply(msg.from, 'Input URL', msg)
      let data = await BT.facebookdlv2(args[0])
      if (data.result.length === 0) return wa.reply(msg.from, `ID:\n${lang.indo.util.download.fbPriv}\n\nEN:\n${lang.eng.util.download.fbPriv}`)
      await wa.mediaURL(msg.from, data.result[0].url, { quoted: msg })
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, errMess, msg)
    }
  }
}
