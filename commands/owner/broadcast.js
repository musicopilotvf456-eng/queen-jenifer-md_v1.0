module.exports = {
    name: 'broadcast',
    aliases: ['bc', 'annonce'],
    owner: true,
    description: 'Envoyer un message à tous les groupes',
    
    async execute(sock, m, args, config) {
        const from = m.key.remoteJid;
        const message = args.join(' ');
        
        if (!message) {
            return sock.sendMessage(from, { 
                text: '❌ Veuillez fournir le message à diffuser!'
            });
        }
        
        await sock.sendMessage(from, { 
            text: '⏳ *Diffusion en cours...*' 
        });
        
        // Récupérer tous les groupes (à implémenter)
        const groups = await sock.groupFetchAllParticipating();
        let successCount = 0;
        let failCount = 0;
        
        for (let groupId in groups) {
            try {
                await sock.sendMessage(groupId, {
                    image: config.media.repo,
                    caption: `📢 *BROADCAST*\n\n${message}\n\n> ${config.botName}`,
                    contextInfo: {
                        externalAdReply: {
                            title: config.botName,
                            body: 'Message officiel',
                            thumbnail: config.media.repo,
                            sourceUrl: config.supportLink,
                            mediaType: 1
                        }
                    }
                });
                successCount++;
            } catch {
                failCount++;
            }
        }
        
        await sock.sendMessage(from, {
            text: `✅ *Diffusion terminée!*\n\n📨 Envoyé à: ${successCount} groupes\n❌ Échec: ${failCount} groupes`
        });
    }
};
