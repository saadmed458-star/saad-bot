import axios from 'axios';

export const NovaUltra = {
    command: ["ذكاء"],
    description: "ذكاء اصطناعي بمعلومات موثوقة ومحدثة 2026",
    category: "AI",
    group: true,
    prv: true
};

const GROQ_KEY = "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";

export default {
    NovaUltra,
    async execute(context) {
        const sock = context.sock || arguments[0];
        const msg = context.msg || arguments[1];
        const args = context.args || arguments[2];
        const chatId = msg.key.remoteJid;
        const query = args?.join(" ");

        if (!query) return await sock.sendMessage(chatId, { text: "🛡️ *أنا مساعدك الموثوق.. اسألني عن أي معلومة تقنية أو عامة.*" }, { quoted: msg });

        await sock.sendMessage(chatId, { react: { text: "🔍", key: msg.key } });

        try {
            const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `أنت خبير معلوماتي دقيق جداً. نحن الآن في عام 2026. 
                        مهامك:
                        1. تقديم معلومات موثوقة ومبنية على حقائق.
                        2. إذا لم تكن متأكداً من معلومة، وضح ذلك للمستخدم.
                        3. التزم باللغة العربية الفصحى والترتيب المنطقي.
                        4. كن محدثاً بآخر التطورات التقنية (مثل Node.js و Termux و AI).` 
                    },
                    { role: "user", content: query }
                ],
                temperature: 0.3, // تقليل الحرارة لزيادة الدقة ومنع التخريف
                top_p: 1
            }, {
                headers: { 
                    "Authorization": `Bearer ${GROQ_KEY}`, 
                    "Content-Type": "application/json" 
                }
            });

            const aiText = response.data.choices[0].message.content;

            const finalReply = `✅ *الــــمــــعــــلــــومــــات الــــمــــوثــــوقــــة:*\n\n${aiText.trim()}\n\n> 𝐇.𝐊.𝐑┇⊰🪻⊱𝐋𝐀𝐕𝐄𝐍𝐃𝐄𝐑 💐`;

            await sock.sendMessage(chatId, { text: finalReply }, { quoted: msg });

        } catch (error) {
            await sock.sendMessage(chatId, { text: "⚠️ *عذراً، تعذر الوصول لقاعدة البيانات الموثوقة حالياً.*" }, { quoted: msg });
        }
    }
};
