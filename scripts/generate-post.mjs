import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'

// Get API Key from environment variables
const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.')
    process.exit(1)
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

// Current date for filename
const today = new Date()
const dateString = today.toISOString().split('T')[0]
const slug = `daily-tip-${dateString}`

// Supported languages
const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' }
]

async function generatePost() {
    console.log('Generating daily Ayurveda tip...')

    const prompt = `
    You are an expert Ayurveda practitioner writing a daily blog post for a lifestyle website.
    Topic: Generate a unique, interesting, and seasonal Ayurveda tip or topic for today (${dateString}).
    
    Target Languages: ${languages.map(l => `${l.name} (${l.code})`).join(', ')}.

    Output Format: JSON object where keys are the language codes (${languages.map(l => l.code).join(', ')}) and values are objects with "title", "excerpt", and "content" (markdown).
    
    Structure:
    {
      "en": { "title": "...", "excerpt": "...", "content": "..." },
      "hi": { "title": "...", "excerpt": "...", "content": "..." },
      "es": { "title": "...", "excerpt": "...", "content": "..." }
    }
    
    Ensure translations are culturally accurate.
    Do not include any markdown code blocks (like \`\`\`json) in your response, just the raw JSON string.
  `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Clean potential markdown fencing
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
        const data = JSON.parse(cleanJson)

        for (const lang of languages) {
            if (data[lang.code]) {
                const post = data[lang.code]
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
                console.log(`Saved ${lang.name} post: ${filePath}`)
            } else {
                console.warn(`Missing data for ${lang.name}`)
            }
        }

    } catch (error) {
        console.error('Error generating post:', error)
        process.exit(1)
    }
}

generatePost()
