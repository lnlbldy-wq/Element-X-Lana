
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;
const OLLAMA_URL = 'http://localhost:11434/api/generate';

app.use(cors());
app.use(express.json());

// Chemistry Assistant Endpoint (Strictly Chemistry)
app.post('/chemistry', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ answer: 'الرجاء إدخال سؤالك الكيميائي.' });
    }

    // System Prompt for Pure High School & Advanced Chemistry
    const systemPrompt = `
    أنت "مساعد ElementX الكيميائي"، خبير متخصص حصرياً في علم الكيمياء.
    - مهمتك هي الإجابة عن التساؤلات الكيميائية فقط (عضوية، غير عضوية، حيوية، تحليلية، فيزيائية).
    - استخدم اللغة العربية العلمية المبسطة.
    - إذا سألك المستخدم عن البرمجة، تطوير المواقع، أو أي موضوع خارج الكيمياء، اعتذر بلباقة وأخبره أنك متخصص فقط في أسرار الكيمياء.
    - قدم المعادلات الكيميائية موزونة واشرح التفاعلات بدقة.
    - إذا طلب المستخدم "كويز"، قدم له سؤالاً كيميائياً ذكياً.
    السؤال: ${question}`;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: 'llama3',
            prompt: systemPrompt,
            stream: false
        });

        res.json({
            answer: response.data.response
        });

    } catch (error) {
        console.error('Ollama Error:', error.message);
        res.status(500).json({ 
            answer: 'خطأ: تأكد من تشغيل Ollama محلياً وتحميل نموذج llama3. المختبر مخصص حالياً للكيمياء فقط.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 خادم الكيمياء الذكي يعمل على http://localhost:${PORT}`);
    console.log(`🤖 ملقن الكيمياء الحصري مفعل.`);
});
