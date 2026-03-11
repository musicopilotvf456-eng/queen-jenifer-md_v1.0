const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const config = require('./config');
const { handleCommands } = require('./lib/handler');
const { initDatabase } = require('./lib/database');

// Interface pour pair code
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Logger
const logger = pino({ level: 'silent' });

async function startBot() {
    console.log(`╔════════════════════════════════════╗`);
    console.log(`║     ⚜️${config.botName}⚜️     ║`);
    console.log(`╚════════════════════════════════════╝`);

    const { state, saveCreds } = await useMultiFileAuthState('./main/sessions');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        browser: Browsers.macOS('Desktop'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        generateHighQualityLinkPreview: true,
        patchMessageBeforeSending: (msg) => {
            const requiresPatch = !!msg?.buttonsMessage || !!msg?.listMessage || !!msg?.templateMessage;
            if (requiresPatch) {
                msg = { viewOnceMessage: { message: msg } };
            }
            return msg;
        }
    });

    // Gestion des événements
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('📱 Scan QR Code avec WhatsApp:');
            require('qrcode-terminal').generate(qr, { small: true });
            console.log('Ou utilise Pair Code:');
            askPairCode(sock);
        }

        if (connection === 'open') {
            console.log('✅ Connexion réussie!');
            console.log(`👤 Connecté en tant que: ${sock.user.name}`);
            console.log(`📱 Numéro: ${sock.user.id.split(':')[0]}`);
            console.log(`⚡ Bot prêt à l'emploi!`);
            
            // Envoyer notification au propriétaire
            await sendStartupNotification(sock);
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log('❌ Connexion fermée, raison:', DisconnectReason[reason] || reason);
            if (reason !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconnexion dans 5 secondes...');
                setTimeout(startBot, 5000);
            } else {
                console.log('🚫 Session expirée, veuillez rescaner le QR code');
                fs.removeSync('./main/sessions');
                startBot();
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        const m = messages[0];
        if (!m.message) return;
        if (m.key && m.key.remoteJid === 'status@broadcast') return;

        await handleCommands(sock, m);
    });

    // Groupe events
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        await handleGroupParticipants(sock, id, participants, action);
    });

    return sock;
}

async function askPairCode(sock) {
    if (config.sessionConfig.SESSION_ID && config.sessionConfig.SESSION_ID !== "Put your session id here") {
        console.log('🔑 Utilisation de SESSION_ID...');
        try {
            const code = config.sessionConfig.SESSION_ID;
            const response = await sock.requestPairingCode(code);
            console.log(`✅ Pair code: ${response}`);
        } catch (error) {
            console.log('❌ Erreur avec SESSION_ID, veuillez scanner le QR code');
        }
    } else {
        rl.question('📱 Entrez votre numéro WhatsApp (ex: 22507070707): ', async (number) => {
            try {
                const code = await sock.requestPairingCode(number);
                console.log(`✅ Votre code d\'appairage: ${code}`);
                console.log('🔐 Entrez ce code dans WhatsApp > Appareils liés');
            } catch (error) {
                console.log('❌ Erreur lors de la génération du code');
                console.log('📱 Veuillez scanner le QR code à la place');
            }
        });
    }
}

async function sendStartupNotification(sock) {
    for (const owner of config.ownerNumber) {
        try {
            await sock.sendMessage(owner + '@s.whatsapp.net', {
                image: config.media.menu,
                caption: `╔══════════════════════╗
║  ⚜️${config.botName}⚜️  ║
╚══════════════════════╝

✅ *Bot démarré avec succès!*

📊 *Statut:*
• Mode: Connecté
• Sessions: Actives
• Déploiement: Render

> ღᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName}ღ`,
                footer: config.author,
                contextInfo: {
                    externalAdReply: {
                        title: config.botName,
                        body: 'Bot WhatsApp MD',
                        thumbnail: config.media.repo,
                        sourceUrl: config.supportLink,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        } catch (e) {}
    }
}

// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
    console.log('❌ Erreur non capturée:', err);
});

process.on('unhandledRejection', (err) => {
    console.log('❌ Rejet non géré:', err);
});

// Démarrer le bot
startBot();
