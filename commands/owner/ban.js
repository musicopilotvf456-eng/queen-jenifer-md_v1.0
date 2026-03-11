module.exports = {
    name: 'ban',
    aliases: ['bannir'],
    owner: true,
    description: 'Bannir un utilisateur du bot',
    
    async execute(sock, m, args, config) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        
        let userToBan;
        
        if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            userToBan = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            userToBan = args[0].replace('@', '') + '@s.whatsapp.net';
        } else {
            return sock.sendMessage(from, { 
                text: '❌ Veuillez mentionner l\'utilisateur à bannir!'
            });
        }
        
        // Ajouter à la liste noire (à implémenter dans la DB)
        config.bannedUsers = config.bannedUsers || [];
        if (!config.bannedUsers.includes(userToBan)) {
            config.bannedUsers.push(userToBan);
        }
        
        await sock.sendMessage(from, {
            text: `🚫 *Utilisateur banni*\n\n👤 @${userToBan.split('@')[0]} a été banni du bot.`,
            mentions: [userToBan]
        });
    }
};
