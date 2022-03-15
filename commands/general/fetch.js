const fetch = require('node-fetch');

module.exports = {
  name: 'get',
  aliases: ['fetch','inspect'],
  category: 'general',
  desc: 'Inspect the link',
  async execute(msg, wa, args) {
    const { sender, from } = msg;
    if (!args[0]) return wa.reply(from, "Input URL", msg);
    fetch(args[0]).then(res => res.text())  
   .then(bu =>{
        wa.reply(from, bu, msg);
    })
  },
};
