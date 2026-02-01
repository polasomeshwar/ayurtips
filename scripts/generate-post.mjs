import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'

// =======================
// ENV + SETUP
// =======================
const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.')
    process.exit(1)
}

const genAI = new GoogleGenerativeAI(API_KEY)

// Using gemini-1.5-flash as it has excellent JSON mode support and high rate limits.
// You can switch to 'gemini-2.0-flash-exp' or others if you have access.
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING },
                excerpt: { type: SchemaType.STRING },
                content: { type: SchemaType.STRING }
            },
            required: ['title', 'excerpt', 'content']
        },
        maxOutputTokens: 8192, // Increased to prevent truncation
        temperature: 0.7
    }
})

// =======================
// CONFIG
// =======================
const today = new Date()
const dateString = today.toISOString().split('T')[0]
const slug = `daily-tip-${dateString}`

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' }
]

// =======================
// HELPERS
// =======================
const sleep = ms => new Promise(res => setTimeout(res, ms))

async function generateWithRetry(prompt, maxRetries = 5) {
    let attempt = 0
    let delayMs = 10000 // Start with 10s

    while (attempt < maxRetries) {
        try {
            return await model.generateContent(prompt)
        } catch (error) {
            attempt++

            const isQuota = error.status === 429 ||
                error.message?.includes('429') ||
                error.message?.includes('Quota')

            if (!isQuota || attempt === maxRetries) {
                console.error(`❌ API Error (Attempt ${attempt}):`, error.message)
                throw error
            }

            console.log(`⏳ Rate limit hit. Retry ${attempt}/${maxRetries} in ${delayMs / 1000}s...`)
            await sleep(delayMs)
            delayMs *= 2 // Exponential backoff
        }
    }
}

// =======================
// GENERATION STEPS
// =======================

async function generateEnglishPost() {
    console.log('🪷 Generating English Ayurveda tip...')

    const prompt = `
    You are an expert Ayurveda practitioner writing for a lifestyle blog in **India**.
    Generate ONE unique, seasonal daily Ayurveda tip for today: ${dateString}.
    
    **Tone & Style:**
    - Use **Basic Indian English**. Simple, warm, and conversational.
    - Avoid complex words or heavy academic language.
    - Write as if you are giving advice to a friend or family member.
    - Use phrases commonly understood in India.
    
    Format:
    - Title: Catchy and simple
    - Excerpt: 1-2 sentences for preview
    - Content: Full blog post in Markdown (headings, bullet points, practical advice).
    `

    const result = await generateWithRetry(prompt)
    // With responseMimeType: 'application/json', parsing is safe
    return JSON.parse(result.response.text())
}

async function translatePost(post, lang) {
    console.log(`🌍 Translating to ${lang.name}...`)

    const prompt = `
    Translate this Ayurveda blog post into ${lang.name} (${lang.code}).
    Maintain the tone, cultural nuances, and Markdown formatting.
    
    Original Title: ${post.title}
    Original Content: ${post.content}
    `

    const result = await generateWithRetry(prompt)
    return JSON.parse(result.response.text())
}

function savePost(lang, post) {
    // Sanitize frontmatter strings
    const safeTitle = post.title.replace(/'/g, "''")
    const safeExcerpt = post.excerpt.replace(/'/g, "''")

    const fileContent = `---
title: '${safeTitle}'
date: '${dateString}'
excerpt: '${safeExcerpt}'
---

${post.content}
`

    const dirPath = path.join(process.cwd(), `src/content/${lang.code}`)
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    const filePath = path.join(dirPath, `${slug}.md`)
    fs.writeFileSync(filePath, fileContent)
    console.log(`✅ Saved ${lang.name}: ${filePath}`)
}

// =======================
// MAIN EXECUTION
// =======================
async function main() {
    try {
        // 1. Generate core English content
        const enPost = await generateEnglishPost()
        savePost({ code: 'en', name: 'English' }, enPost)

        // 2. Translate to other languages sequentially
        const otherLangs = languages.filter(l => l.code !== 'en')

        for (const lang of otherLangs) {
            // Pause to respect rate limits
            await sleep(5000)
            const translated = await translatePost(enPost, lang)
            savePost(lang, translated)
        }

        console.log('🎉 All posts generated successfully!')

    } catch (error) {
        console.error('❌ Fatal Error:', error)
        process.exit(1)
    }
}

main()
