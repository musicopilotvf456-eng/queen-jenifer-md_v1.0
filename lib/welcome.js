const config = require('../config');

async function handleWelcome(sock, groupId, participants, action) {
    if (!config.welcomeEnabled) return;
    
    if (action === 'add') {
        for (let participant of participants) {
            const welcomeMsg = config.welcomeMessage || 
                `╔══════════════════════╗
║   *BIENVENUE*   ║
╚══════════════════════╝

🎉 Bienvenue @${participant.split('@')[0]} dans *${config.botName}*!

📋 *Règles du groupe:*
┣ 1️⃣ Respectez tous les membres
┣ 2️⃣ Pas de spam
┣ 3️⃣ Pas de liens sans permission
┣ 4️⃣ Amusez-vous bien!
┗━━━━━━━━━━━━━━━━━━

Présente-toi aux autres membres! 👋

> ღᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName}ღ`;
            
            await sock.sendMessage(groupId, {
                image: config.media.welcome,
                caption: welcomeMsg,
                mentions: [participant],
                contextInfo: {
                    externalAdReply: {
                        title: config.botName,
                        body: 'Nouveau membre',
                        thumbnail: config.media.repo,
                        sourceUrl: config.supportLink,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        }
    } else if (action === 'remove') {
        for (let participant of participants) {
            const goodbyeMsg = config.goodbyeMessage || 
                `👋 Au revoir @${participant.split('@')[0]}!\n\nOn espère te revoir bientôt!`;
            
            await sock.sendMessage(groupId, {
                text: goodbyeMsg,
                mentions: [participant]
            });
        }
    }
}

module.exports = { handleWelcome };
