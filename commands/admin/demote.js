module.exports = {
    name: 'demote',
    aliases: ['destituer', 'admin-'],
    admin: true,
    group: true,
    description: 'Retirer les droits d\'administrateur',
    
    async execute(sock, m, args, config) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        
        let userToDemote;
        
        if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            userToDemote = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
            userToDemote = m.message.extendedTextMessage.contextInfo.participant;
        } else if (args[0]) {
            userToDemote = args[0].replace('@', '') + '@s.whatsapp.net';
        } else {
            return sock.sendMessage(from, { 
                text: '❌ Veuillez mentionner l\'utilisateur à destituer!'
            });
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [userToDemote], 'demote');
            
            await sock.sendMessage(from, {
                image: config.media.allothers,
                caption: `╔══════════════════════╗
║   *DESTITUTION EFFECTUÉE*   ║
╚══════════════════════╝

📌 *Détails:*
┏━━━━━━━━━━━━━━━━━━┓
┃ 👤 *Membre:* @${userToDemote.split('@')[0]}
┃ 👑 *Ancien rôle:* Administrateur
┃ 👤 *Nouveau rôle:* Membre
┃ 🔰 *Par:* @${sender.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━┛

> ღᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName}ღ`,
                mentions: [userToDemote, sender],
                contextInfo: {
                    externalAdReply: {
                        title: config.botName,
                        body: 'Destitution Admin',
                        thumbnail: config.media.repo,
                        sourceUrl: config.supportLink,
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `❌ Erreur: ${error.message}`
            });
        }
    }
};
