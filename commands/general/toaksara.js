const { latinToAksara } = require('@bochilteam/scraper');

module.exports = {
	name: 'latintoaksara',
	aliases: ['toaksara'],
	category: 'general',
	desc: 'Latin to Aksara Jawa',
	async execute(msg, wa, args) {
		try {
			const { mentionedJid, quoted, from, sender, isGroup, body, prefix } = msg
			
                        if (args.join(' ')) {
                        teks = args.join(' ')
                        } else if (quoted) {
                        teks = quoted.message.conversation
                        } else { 
                        wa.reply(msg.from, `Input text / Reply message`, msg)
                        }

			let res = await latinToAksara(teks)
			wa.reply(from, res, msg)
			
			} catch (e) {
				wa.reply(from, `Sorry, an error occurred`, msg)
		}
	}
}
