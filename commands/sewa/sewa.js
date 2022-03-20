const { owner } = require('../../config.json');
const sewa = require('../../lib/sewa.js');
const db_sewa = []

module.exports = {
    name: 'sewa',
    category: 'sewa',
    desc: 'Rent bots in your group',
    async execute(msg, wa, args) {
    const { sender, from, body, isGroup } = msg
    
        if (!isGroup)return wa.reply(from, `Only can be executed in group.`, msg)
        if (!owner.includes(sender)) return wa.reply(from, `Only can be executed for bot owner.`, msg)
        if (args.length < 1) return wa.reply(from, `Example :\n*#sewa* add/del waktu`, msg)
        
        if (args[0].toLowerCase() === 'add'){
        sewa.addSewaGroup(from, args[1], db_sewa)
        wa.reply(from, `Success`, msg)
        } else if (args[0].toLowerCase() === 'del'){
        db_sewa.splice(sewa.getSewaPosition(from, db_sewa), 1)
        wa.reply(from, `Success`, msg)
        } else {
        wa.reply(from, `Example :\n*#sewa* add/del waktu`, msg)
        }
      
    }
}
