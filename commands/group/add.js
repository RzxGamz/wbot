const con = require('../../core/connect');
const djs = require('@discordjs/collection');
const lang = require('../other/text.json');
const ev = con.Whatsapp

module.exports = {
    name: 'add',
    category: 'Group',
    desc: 'Add participant to your group.',
    async execute(msg, wa, args) {

        try {
            const { prefix } = djs
            const { mentionedJid, quoted, from, sender, isGroup, body } = msg
            const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
            const added = args[0];

            const meta = isGroup ? await ev.chats.get(from).metadata : ''
            const admin = isGroup ? getAdmin(meta.participants) : ''
            const cekAdmin = (m) => admin.includes(m)
            const checkInGroup = (m) => {
                let members = []
                for (let id of meta.participants) {
                    members.push(id.jid)
                }
                return members.includes(m)
            }

            if (!isGroup) return wa.sendText(from, `Only can be executed in group.`)
            if (!cekAdmin(sender)) return wa.reply(from, `Can only be used by group admins`, msg)
            if (!cekAdmin(ev.user.jid)) return wa.reply(from, `Bot not admin!`, msg)

            if (quoted) {
                const mention = quoted.participant
                if (checkInGroup(mention)) return wa.reply(from, "Member is already in group", msg)
                await ev.groupAdd(from, [mention])
                wa.reply(from, `Sukses add member`, msg)
            } else if (added) {
                const mention = added
                if (checkInGroup(mention + "@s.whatsapp.net")) return wa.reply(from, "Member is already in group", msg)
                await ev.groupAdd(from, [mention + "@s.whatsapp.net"])
                wa.reply(from, `Sukses add member`, msg)
            } else {
                wa.reply(from, `How to: *${prefix + command} 628XXXXXX*\nor you can reply someone message with *${prefix + command}*`, msg)
            }
        } catch (e) {
            wa.reply(msg.from, `Maaf tidak bisa add member`, msg)
        }
    }
}

function getAdmin(participants) {
    let admins = new Array()
    for (let _ of participants) {
        _.isAdmin ? admins.push(_.jid) : ''
    }
    return admins
}
