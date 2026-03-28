const { GoogleGenerativeAI } = require('@google/generative-ai');

// System prompt for the AI
const STORE_SYSTEM_PROMPT = `You are a friendly, helpful shopping assistant for "Basket" (formerly ME5 STORE) — a premium Indian e-commerce platform. You help customers and sellers with:
- Product recommendations, availability, and details
- Order tracking, cancellation, and return policies
- Shipping times (standard: 3–7 business days, expressed: 1–2 days)
- Payment methods: UPI, Credit/Debit Cards, Net Banking, COD
- Return policy: 10-day easy returns on most items
- Account help: login, registration, profile management
- Seller (Admin) dashboard guidance: add products, manage orders, view earnings
- General shopping guidance

Tone: Warm, professional, concise. Use Indian Rupees (₹). Always sign off helpfully. If you don't know something specific, suggest contacting support at support@me5store.com.`;

const MODEL_CANDIDATES = [
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-latest',
    'gemini-pro-latest',
    'gemini-pro',
    'gemini-1.0-pro',
    'gemini-1.5-pro'
];

/**
 * HIGH-LEVEL FALLBACK:
 * If the SDK keeps returning 404, we try a raw fetch to the REST API.
 */
async function rawFetchGemini(modelName, message, chatHistory = [], isChat = true) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing');

    const versions = ['v1beta', 'v1'];
    let lastError = null;

    for (const version of versions) {
        try {
            const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${apiKey}`;
            
            const contents = [];
            // For older/stable versions, inject system context as first message
            contents.push({
                role: 'user',
                parts: [{ text: `SYSTEM CONTEXT: ${STORE_SYSTEM_PROMPT}\n\nPlease help the user based on this context.` }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: 'Understood. I am your Basket AI assistant. How can I help today?' }]
            });

            if (chatHistory.length > 0) {
                chatHistory.forEach(msg => {
                    contents.push({
                        role: msg.role === 'model' ? 'model' : 'user',
                        parts: [{ text: msg.text }]
                    });
                });
            }
            contents.push({ role: 'user', parts: [{ text: message }] });

            console.log(`[Raw Fetch ${version}] Trying model: ${modelName}...`);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log(`✅ [Raw ${version}] Success with ${modelName}`);
                return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
            }

            if (response.status !== 404) {
                throw new Error(`[Google API ${response.status}] ${data.error?.message || 'Error'}`);
            }
            lastError = new Error(`[404] ${modelName} not found in ${version}`);
        } catch (err) {
            if (err.message.includes('[404]')) {
                lastError = err;
                continue; 
            }
            throw err;
        }
    }
    throw lastError;
}

// @desc    Chat with Gemini AI
// @route   POST /api/ai/chat
// @access  Public
exports.chat = async (req, res, next) => {
    try {
        const { message, history } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // 1. Try SDK (Standard)
        for (const modelName of MODEL_CANDIDATES) {
            try {
                console.log(`[SDK] Attempting: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: 'What can you help me with?' }] },
                        { role: 'model', parts: [{ text: STORE_SYSTEM_PROMPT }] }
                    ],
                });
                const result = await chat.sendMessage(message);
                const response = await result.response;
                return res.status(200).json({ success: true, reply: response.text() });
            } catch (err) {
                console.warn(`[SDK] ${modelName} failed: ${err.message.split('\n')[0]}`);
                // Continue to next model even if it's a 429 (quota)
                continue;
            }
        }

        // 2. Try Raw Fetch (Fallback)
        console.warn('[SDK Failed] Switching to Raw Fetch fallback loop...');
        for (const modelName of MODEL_CANDIDATES) {
            try {
                const reply = await rawFetchGemini(modelName, message, history);
                return res.status(200).json({ success: true, reply });
            } catch (fetchErr) {
                console.warn(`[Raw Fetch] ${modelName} failed: ${fetchErr.message}`);
                // Continue even if 429, only throw at the end
                continue;
            }
        }

        throw new Error('All models failed (404). Your API key might not have the "Generative Language API" enabled.');

    } catch (err) {
        console.error('Gemini AI Chat Error:', err);
        const status = err.message?.includes('429') ? 429 : 500;
        res.status(status).json({ success: false, error: 'AI Error: ' + err.message });
    }
};

// @desc    Analyze a product with Gemini
// @route   POST /api/ai/analyze-product
// @access  Public
exports.analyzeProduct = async (req, res, next) => {
    try {
        const { name, description, category, price, stock } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        if (!name) {
            return res.status(400).json({ success: false, error: 'Product data is required' });
        }

        const prompt = `Analyze this product for "ME5 STORE" in 4-5 sentences:
Name: ${name}
Category: ${category}
Price: ₹${price}
Description: ${description}`;

        // Try SDK
        for (const modelName of MODEL_CANDIDATES) {
            try {
                console.log(`[SDK Analysis] Attempting: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return res.status(200).json({ success: true, analysis: response.text() });
            } catch (err) {
                console.warn(`[SDK Analysis] ${modelName} failed`);
            }
        }

        // Try Raw
        console.warn('[SDK Analysis Failed] Trying Raw Fallback...');
        for (const modelName of MODEL_CANDIDATES) {
            try {
                const analysis = await rawFetchGemini(modelName, prompt, [], false);
                return res.status(200).json({ success: true, analysis });
            } catch (err) {
                console.warn(`[Raw Analysis] ${modelName} failed`);
            }
        }

        throw new Error('Analysis failed on all models.');

    } catch (err) {
        console.error('Gemini AI Analysis Error:', err);
        res.status(500).json({ success: false, error: 'Analysis failed: ' + err.message });
    }
};
