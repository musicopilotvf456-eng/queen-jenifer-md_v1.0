const axios = require('axios');

module.exports = {
    name: 'facebook',
    aliases: ['fb', 'fbdl'],
    description: 'Télécharger vidéo Facebook',
    
    async execute(sock, m, args, config) {
        const from = m.key.remoteJid;
        
        if (!args[0]) {
            return sock.sendMessage(from, { 
                text: '❌ Veuillez fournir un lien Facebook!'
            });
        }
        
        const url = args[0];
        
        try {
            await sock.sendMessage(from, { 
                text: '⏳ *Téléchargement en cours...*' 
            });
            
            // API Facebook download (à remplacer par votre API)
            const apiUrl = `https://api.ryzendesu.vip/api/downloader/fb?url=${encodeURIComponent(url)}`;
            const response = await axios.get(apiUrl);
            
            if (response.data && response.data.url) {
                const videoBuffer = await axios.get(response.data.url, { responseType: 'arraybuffer' });
                
                await sock.sendMessage(from, {
                    video: Buffer.from(videoBuffer.data),
                    caption: `📱 *Facebook Downloader*\n\n🔗 *Lien:* ${url}\n\n> ღᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName}ღ`,
                    contextInfo: {
                        externalAdReply: {
                            title: config.botName,
                            body: 'Facebook Download',
                            thumbnail: config.media.repo,
                            sourceUrl: url,
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, { 
                    text: '❌ Impossible de télécharger cette vidéo!'
                });
            }
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `❌ Erreur: ${error.message}`
            });
        }
    }
};
