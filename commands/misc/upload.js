const fetch = require("node-fetch");
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const ev = require('../../core/connect').Whatsapp;

module.exports = {
  name: 'tourl',
  aliases: ['upload'],
  category: 'misc',
  desc: 'Upload your media to server telegra.ph',
  async execute(msg, wa, args) {
    const { sender, from } = msg;
       const content = JSON.stringify(msg.message)
       const type = Object.keys(msg.message)[0]
       const isMedia = (type === 'imageMessage' || type === 'videoMessage')
       const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
       const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
       if (!isMedia && !isQuotedImage && !isQuotedVideo) return wa.reply(from, "Reply image / video", msg);
       let mezz = isQuotedImage || isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
       let buff = await ev.downloadMediaMessage(mezz)
       let res = await upload(buff)
       wa.reply(from, res, msg)
  },
};

function upload (media) {
    return new Promise(async (resolve, reject) => {
    try {
        let { ext } = await fromBuffer(media)
        let form = new FormData()
        form.append('file', media, 'tmp.' + ext)
        await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: form
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) return reject(res.error)
            resolve('https://telegra.ph' + res[0].src)
        })
        .catch(err => reject(err))
    } catch (e) {
        return console.log(e)
    }
})
}
