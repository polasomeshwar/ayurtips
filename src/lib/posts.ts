import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src/content')

export interface PostData {
    slug: string
    title: string
    date: string
    contentHtml: string
    excerpt?: string
}

export function getSortedPostsData(locale: string) {
    const localeDir = path.join(postsDirectory, locale)
    if (!fs.existsSync(localeDir)) return []

    const fileNames = fs.readdirSync(localeDir)
    const allPostsData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(localeDir, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        return {
            slug,
            ...(matterResult.data as { date: string; title: string; excerpt?: string }),
        }
    })

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export async function getPostData(slug: string, locale: string): Promise<PostData> {
    const fullPath = path.join(postsDirectory, locale, `${slug}.md`)

    let fileContents;
    try {
        fileContents = fs.readFileSync(fullPath, 'utf8')
    } catch (e) {
        // Fallback? or just error
        return {
            slug,
            title: 'Post Not Found',
            date: '',
            contentHtml: '<p>This post is not available in the selected language.</p>'
        }
    }

    const matterResult = matter(fileContents)
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        slug,
        contentHtml,
        ...(matterResult.data as { date: string; title: string, excerpt?: string }),
    }
}
