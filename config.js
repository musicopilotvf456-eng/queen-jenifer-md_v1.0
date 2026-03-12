const fs = require('fs');
const path = require('path');

// Configuration globale
global.botName = "⚜️Qᴜᴇᴇɴ Jᴇɴɪғᴇʀ ᴍᴅ❀";
global.botNumber = "22507070707";
global.ownerNumber = ["22507070707"];
global.packname = "Queen Jennifer MD";
global.author = "Queen Team";
global.newsletterJid = "120363200000000000@newsletter";
global.newsletterName = "Queen Jennifer Updates";
global.supportLink = "https://chat.whatsapp.com/xxxxxx";
global.channelLink = "https://whatsapp.com/channel/xxxxxx";

// Configuration des médias avec fallback
global.media = {};

// Fonction pour charger les médias en toute sécurité
function loadMedia(fileName) {
    const filePath = path.join(__dirname, 'main/media', fileName);
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath);
        } else {
            console.log(`⚠️ Fichier média manquant: ${fileName}`);
            return null;
        }
    } catch (error) {
        console.log(`⚠️ Erreur chargement ${fileName}:`, error.message);
        return null;
    }
}

// Charger les médias
global.media.menu = loadMedia('menu.jpg');
global.media.alive = loadMedia('alive.jpg');
global.media.allothers = loadMedia('allotherscommands.jpg');
global.media.userTag = loadMedia('userTag.webp');
global.media.menuPtt = loadMedia('menuPtt.ogg');
global.media.repo = loadMedia('repo.png');
global.media.owner = loadMedia('owner.jpg');
global.media.welcome = loadMedia('welcome.jpg');

// Session configuration
global.sessionConfig = {
    SESSION_ID: process.env.SESSION_ID || "Put your session id here",
    SESSION_METHOD: "creds.json"
};

// Autres configurations
global.autoread = true;
global.antilink = false;
global.antibot = false;
global.welcomeEnabled = true;
global.welcomeMessage = "Bienvenue dans le groupe!";
global.goodbyeMessage = "Au revoir!";
global.bannedUsers = [];

module.exports = { ...global };