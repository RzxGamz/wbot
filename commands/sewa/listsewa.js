const { owner } = require('../../config.json');
const sewa = require('../../lib/sewa.js');
const db_sewa = JSON.parse(fs.readFileSync('././databases/sewa.json'));
const ms = require('parse-ms');

module.exports = {
    name: 'listsewa',
    category: 'sewa',
    desc: 'View list rent bots.',
    async execute(msg, wa, args) {
    const { sender, from, body, isGroup } = msg
    
        let txt = `List Sewa\nJumlah : ${db_sewa.length}\n\n`
                for (let i of db_sewa){
                    let cekvipp = ms(i.expired - Date.now())
                    txt += `*Group Id :* ${i.id} \n*Expire :* ${cekvipp.days} day(s) ${cekvipp.hours} hour(s) ${cekvipp.minutes} minute(s) ${cekvipp.seconds} second(s)\n\n`
                }
         wa.reply(from, txt, msg)
      
    }
}
