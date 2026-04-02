// plugins/groups/welcome.js
export const NovaUltra = {
    command: "ترحيب",
    description: "ترحيب الأعضاء الجدد",
    group: true,
    admin: true
};

const welcomeSettings = new Map();
const welcomedParticipants = new Set();

export async function handleWelcome(sock, update) {
    const groupId = update.id;
    if (!welcomeSettings.get(groupId) || update.action !== 'add') return;

    for (const participant of update.participants) {
        if (welcomedParticipants.has(participant)) continue;
        
        try {
            await sock.sendMessage(groupId, {
                text: `🎉 مرحباً @${participant.split('@')[0]} في المجموعة!`,
                mentions: [participant]
            });
            welcomedParticipants.add(participant);
            setTimeout(() => welcomedParticipants.delete(participant), 60000);
        } catch (err) {}
    }
}

export async function execute({ sock, msg, args }) {
    const chatId = msg.key.remoteJid;
    const status = args[0];
    
    if (status === 'off') {
        welcomeSettings.set(chatId, false);
        await sock.sendMessage(chatId, { text: '⛔ تم تعطيل الترحيب' });
    } else {
        welcomeSettings.set(chatId, true);
        await sock.sendMessage(chatId, { text: '✅ تم تفعيل الترحيب' });
    }
}

export default { NovaUltra, execute, handleWelcome };
