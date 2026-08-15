import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { buildAnalysisPrompt, type StoryAnalysis } from '@/lib/story-engine'

export async function POST(request: NextRequest) {
  try {
    const { novelText, sceneCount = 6 } = await request.json()

    if (!novelText || typeof novelText !== 'string') {
      return NextResponse.json({ error: '请提供小说文本' }, { status: 400 })
    }

    if (novelText.length < 50) {
      return NextResponse.json({ error: '小说文本太短，至少需要 50 字' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const prompt = buildAnalysisPrompt(novelText, sceneCount)

    let content = ''

    // Try with response_format json first, fallback to plain text
    try {
      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: '你是一位专业的漫剧编剧，擅长将小说转化为视觉化的分镜脚本。你只返回纯 JSON 格式的数据，不包含 markdown 标记或其他文字。',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      } as any)
      content = response.choices?.[0]?.message?.content || ''
    } catch {
      // Fallback: some API versions don't support response_format
      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: '你是一位专业的漫剧编剧，擅长将小说转化为视觉化的分镜脚本。你只返回纯 JSON 格式的数据，不包含 markdown 标记或其他文字。',
          },
          { role: 'user', content: prompt },
        ],
      })
      content = response.choices?.[0]?.message?.content || ''
    }

    if (!content) {
      throw new Error('AI 返回了空内容，请重试')
    }

    // Extract JSON from response (handle markdown code blocks, extra text, etc.)
    let jsonStr = content.trim()

    // Remove markdown code blocks
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim()
    }

    // Try to parse JSON directly
    let analysis: StoryAnalysis
    try {
      analysis = JSON.parse(jsonStr)
    } catch {
      // If direct parse fails, try to extract the JSON object
      const objMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (objMatch) {
        try {
          analysis = JSON.parse(objMatch[0])
        } catch {
          console.error('[Analyze API] Failed to parse JSON:', jsonStr.substring(0, 500))
          throw new Error('AI 返回的数据格式不正确，请重试')
        }
      } else {
        console.error('[Analyze API] No JSON found in response:', jsonStr.substring(0, 500))
        throw new Error('无法解析 AI 返回的数据')
      }
    }

    // Validate
    if (!analysis.characters || !analysis.scenes) {
      throw new Error('AI 返回数据格式不完整')
    }

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('[Analyze API Error]', error)
    return NextResponse.json(
      { error: error.message || '分析失败，请重试' },
      { status: 500 }
    )
  }
}
