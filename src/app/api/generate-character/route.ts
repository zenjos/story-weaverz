import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { buildCharacterPrompt, type Character, STYLE_PRESETS } from '@/lib/story-engine'

export async function POST(request: NextRequest) {
  try {
    const { character, style = 'anime' } = await request.json()

    if (!character || !character.visualPrompt) {
      return NextResponse.json({ error: '角色数据不完整' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const styleKeyword = STYLE_PRESETS[style]?.keyword || STYLE_PRESETS.anime.keyword
    const prompt = buildCharacterPrompt(character as Character, styleKeyword)

    const response = await zai.images.generations.create({
      prompt,
      size: '1024x1024',
    })

    const base64 = response.data?.[0]?.base64

    if (!base64) {
      throw new Error('图像生成失败')
    }

    return NextResponse.json({
      characterId: character.id,
      image: `data:image/png;base64,${base64}`,
    })
  } catch (error: any) {
    console.error('[Character API Error]', error)
    return NextResponse.json(
      { error: error.message || '角色图像生成失败' },
      { status: 500 }
    )
  }
}
