module.exports = {
    name: 'promote',
    aliases: ['promouvoir', 'admin+'],
    admin: true,
    group: true,
    description: 'Promouvoir un membre comme administrateur',
    
    async execute(sock, m, args, config) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        
        let userToPromote;
        
        // Mention ou reply
        if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            userToPromote = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
            userToPromote = m.message.extendedTextMessage.contextInfo.participant;
        } else if (args[0]) {
            userToPromote = args[0].replace('@', '') + '@s.whatsapp.net';
        } else {
            return sock.sendMessage(from, { 
                text: '❌ Veuillez mentionner ou répondre au message de l\'utilisateur à promouvoir!',
                mentions: [sender]
            });
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [userToPromote], 'promote');
            
            await sock.sendMessage(from, {
                image: config.media.allothers,
                caption: `╔══════════════════════╗
║  *PROMOTION RÉUSSIE*  ║
╚══════════════════════╝

🎉 Félicitations!
┏━━━━━━━━━━━━━━━━━━┓
┃ 👤 *Membre:* @${userToPromote.split('@')[0]}
┃ 👑 *Nouveau rôle:* Administrateur
┃ 🔰 *Promu par:* @${sender.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━┛

> ღᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName}ღ`,
                mentions: [userToPromote, sender],
                contextInfo: {
                    externalAdReply: {
                        title: config.botName,
                        body: 'Promotion Admin',
                        thumbnail: config.media.repo,
                        sourceUrl: config.supportLink,
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `❌ Erreur lors de la promotion: ${error.message}`,
                mentions: [sender]
            });
        }
    }
};
