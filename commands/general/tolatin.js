const { aksaraToLatin } = require('@bochilteam/scraper');

module.exports = {
	name: 'aksaratolatin',
	aliases: ['tolatin'],
	category: 'general',
	desc: 'Aksara Jawa to Latin',
	async execute(msg, wa, args) {
		try {
			const { mentionedJid, quoted, from, sender, isGroup, body, prefix } = msg
			
			if (args.join(' ')) {
                        let teks = args.join(' ')
                        } else if (quoted) {
                        let teks = quoted.message.conversation
                        } else {
                        wa.reply(from, `Input Text / Reply message`, msg)
                        }
			
			let res = await aksaraToLatin(args.join(' '))
			wa.reply(from, res, msg)
			
			} catch (e) {
				wa.reply(from, `Sorry, an error occurred`, msg)
		}
	}
}
