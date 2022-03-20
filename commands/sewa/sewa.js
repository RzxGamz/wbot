const { owner } = require('../../config.json');
const sewa = require('../../lib/sewa.js');
const fs = require('fs');
const db_sewa = JSON.parse(fs.readFileSync('././databases/sewa.json'));

module.exports = {
    name: 'sewa',
    category: 'sewa',
    desc: 'Rent bots in your group',
    async execute(msg, wa, args) {
    const { sender, from, body, isGroup } = msg
    
        if (!isGroup)return wa.reply(from, `Only can be executed in group.`, msg)
        if (!owner.includes(sender)) return wa.reply(from, `Only can be executed for bot owner.`, msg)
        if (args.length < 2) return wa.reply(from, `Example :\n*${prefix}sewa* add/del waktu`, msg)
        
        if (args[1].toLowerCase() === 'add'){
        sewa.addSewaGroup(from, args[2], db_sewa)
        wa.reply(from, `Success`, msg)
        } else if (args[1].toLowerCase() === 'del'){
        db_sewa.splice(sewa.getSewaPosition(from, db_sewa), 1)
        fs.writeFileSync('././databases/sewa.json', JSON.stringify(db_sewa))
        wa.reply(from, `Success`, msg)
        } else {
        wa.reply(from, `Example :\n*${prefix}sewa* add/del waktu`, msg)
        }
      
    }
}
