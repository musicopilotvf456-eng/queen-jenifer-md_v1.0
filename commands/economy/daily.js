const db = require('../../lib/database');

module.exports = {
    name: 'daily',
    aliases: ['quotidien'],
    description: 'Réclamer votre récompense quotidienne',
    
    async execute(sock, m, args, config) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        
        try {
            const result = await db.claimDaily(sender);
            
            if (result.success) {
                await sock.sendMessage(from, {
                    text: `✅ *Récompense quotidienne réclamée!*\n\n💰 Vous avez reçu: *${result.amount}* 💎\n📅 Prochain daily dans 24h`,
                    contextInfo: {
                        externalAdReply: {
                            title: config.botName,
                            body: 'Daily Rewards',
                            thumbnail: config.media.repo,
                            sourceUrl: config.supportLink,
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: `⏳ Vous avez déjà réclamé votre daily!\n\nProchain daily: ${result.nextClaim}`
                });
            }
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `❌ Erreur: ${error.message}`
            });
        }
    }
};
