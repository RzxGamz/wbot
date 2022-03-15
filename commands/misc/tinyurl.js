const axios = require("axios");

module.exports = {
  name: 'tinyurl',
  aliases: ['tiny'],
  category: 'misc',
  desc: 'Short your link',
  async execute(msg, wa, args) {
    const { sender, from } = msg;
    if (!args[0]) return wa.reply(from, `Input URL`, msg);
    try {
        let anu = await axios.get(`https://tinyurl.com/api-create.php?url=${args.join(' ')}`)
        wa.reply(from, `${anu.data}`, msg);
         } catch (e) {
         e = String(e)
         wa.reply(from, `${e}`, msg);
      }
  },
};
