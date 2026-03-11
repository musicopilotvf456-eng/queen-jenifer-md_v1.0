const fs = require('fs');

// Configuration globale
global.botName = "⚜️Qᴜᴇᴇɴ Jᴇɴɪғᴇʀ ᴍᴅ❀";
global.botNumber = "22606527293"; // Remplacer par votre numéro
global.ownerNumber = ["22606527293"]; // Numéros des owners
global.packname = "Queen Jennifer MD";
global.author = "Queen Team";
global.newsletterJid = "120363423033788810@newsletter"; // Votre newsletter
global.newsletterName = "Queen Jennifer Updates";
global.supportLink = "https://chat.whatsapp.com/DbnJGPwfyseF8ejtYvnLum";
global.channelLink = "https://whatsapp.com/channel/0029Vb75KOEKrWQt4TzvrR1k";

// Configuration des médias
global.media = {
    menu: fs.readFileSync('./main/media/menu.jpg'),
    alive: fs.readFileSync('./main/media/alive.jpg'),
    allothers: fs.readFileSync('./main/media/allotherscommands.jpg'),
    userTag: fs.readFileSync('./main/media/userTag.webp'),
    menuPtt: fs.readFileSync('./main/media/menuPtt.ogg'),
    repo: fs.readFileSync('./main/media/repo.png'),
    owner: fs.readFileSync('./main/media/owner.jpg'),
    welcome: fs.readFileSync('./main/media/welcome.jpg')
};

// Session configuration
global.sessionConfig = {
    SESSION_ID: process.env.SESSION_ID || "Put your session id here",
    SESSION_METHOD: "creds.json" // ou "session_id"
};

module.exports = { ...global };
