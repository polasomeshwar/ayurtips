import { GoogleGenerativeAI } from '@google/generative-ai'
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

const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200
    }
})

// =======================
// DATE + SLUG
// =======================
const today = new Date()
const dateString = today.toISOString().split('T')[0]
const slug = `daily-tip-${dateString}`

// =======================
// LANGUAGES
// =======================
const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' }
]

// =======================
// HELPERS
// =======================
const sleep = ms => new Promise(res => setTimeout(res, ms))

const parseAIResponse = (text) => {
    // Remove markdown fencing if present
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
    try {
        return JSON.parse(clean)
    } catch (e) {
        console.error('Failed to parse JSON:', clean)
        throw e
    }
}

async function generateWithRetry(prompt, maxRetries = 5) {
    let attempt = 0

    while (attempt < maxRetries) {
        try {
            return await model.generateContent(prompt)
        } catch (error) {
            attempt++

            const isQuota =
                error?.status === 429 ||
                error?.message?.includes('Quota') ||
                error?.message?.includes('rate')

            if (!isQuota || attempt === maxRetries) {
                throw error
            }

            // Default delay
            let delayMs = 20000

            // Try to respect Gemini retryDelay if present
            const retryMatch = error.message?.match(/(\d+)s/i)
            if (retryMatch) {
                delayMs = Number(retryMatch[1]) * 1000
            }

            // Add jitter
            delayMs += Math.floor(Math.random() * 2000)

            console.log(`⏳ Rate limit hit. Retry ${attempt}/${maxRetries} in ${delayMs / 1000}s`)
            await sleep(delayMs)
        }
    }
}

// =======================
// STEP 1: GENERATE ENGLISH
// =======================
async function generateEnglishPost() {
    console.log('🪷 Generating English Ayurveda tip...')

    const prompt = `
You are an expert Ayurveda practitioner writing for a lifestyle blog.

Generate ONE unique, seasonal daily Ayurveda tip for ${dateString}.

Output JSON ONLY:
{
  "title": "...",
  "excerpt": "...",
  "content": "Markdown formatted content"
}

Rules:
- No code blocks
- No explanations
- Raw JSON only
`

    const result = await generateWithRetry(prompt)
    const text = result.response.text()
    return parseAIResponse(text)
}

// =======================
// STEP 2: TRANSLATE
// =======================
async function translatePost(post, lang) {
    console.log(`🌍 Translating to ${lang.name}...`)

    const prompt = `
Translate the following Ayurveda content into ${lang.name} (${lang.code}).
Ensure cultural and linguistic accuracy.

Input JSON:
${JSON.stringify(post)}

Output JSON ONLY with same keys:
{
  "title": "...",
  "excerpt": "...",
  "content": "Markdown formatted content"
}

Rules:
- No code blocks
- Raw JSON only
`

    const result = await generateWithRetry(prompt)
    const text = result.response.text()
    return parseAIResponse(text)
}

// =======================
// SAVE MARKDOWN
// =======================
function savePost(lang, post) {
    const content = `---
title: '${post.title.replace(/'/g, "''")}'
date: '${dateString}'
excerpt: '${post.excerpt.replace(/'/g, "''")}'
---

${post.content}
`

    const dirPath = path.join(process.cwd(), `src/content/${lang.code}`)
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    const filePath = path.join(dirPath, `${slug}.md`)
    fs.writeFileSync(filePath, content)
    console.log(`✅ Saved ${lang.name}: ${filePath}`)
}

// =======================
// MAIN
// =======================
async function generatePost() {
    try {
        const englishPost = await generateEnglishPost()
        savePost({ code: 'en', name: 'English' }, englishPost)

        // Translate sequentially to stay under quota
        for (const lang of languages.filter(l => l.code !== 'en')) {
            await sleep(3000) // small spacing between requests
            const translatedPost = await translatePost(englishPost, lang)
            savePost(lang, translatedPost)
        }

        console.log('🎉 Daily Ayurveda posts generated successfully!')
    } catch (error) {
        console.error('❌ Error generating post:', error)
        process.exit(1)
    }
}

generatePost()
