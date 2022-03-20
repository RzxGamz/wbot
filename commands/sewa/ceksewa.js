const sewa = require('../../lib/sewa.js');
const db_sewa = JSON.parse(fs.readFileSync('././databases/sewa.json'));

module.exports = {
    name: 'ceksewa',
    category: 'sewa',
    desc: 'Cek sewa in your group',
    async execute(msg, wa, args) {
    const { from, body, isGroup } = msg
    
        if (!isGroup) return wa.reply(from, "Only can be executed in group.", msg);
        if (!sewa.checkSewaGroup(from, db_sewa)) return wa.reply(from, "Group ini tidak terdaftar dalam list sewa.", msg);
    
        let cekvip = ms(sewa.getSewaExpired(from, db_sewa) - Date.now())
        let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
        wa.reply(from, premiumnya, msg);
        
    }
}
