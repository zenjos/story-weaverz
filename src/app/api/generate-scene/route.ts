import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { buildScenePrompt, type Scene, type Character, STYLE_PRESETS } from '@/lib/story-engine'

export async function POST(request: NextRequest) {
  try {
    const { scene, characters, style = 'anime' } = await request.json()

    if (!scene || !scene.visualPrompt) {
      return NextResponse.json({ error: '场景数据不完整' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const styleKeyword = STYLE_PRESETS[style]?.keyword || STYLE_PRESETS.anime.keyword
    const prompt = buildScenePrompt(
      scene as Scene,
      characters as Character[],
      styleKeyword
    )

    const response = await zai.images.generations.create({
      prompt,
      size: '768x1344', // vertical comic panel
    })

    const base64 = response.data?.[0]?.base64

    if (!base64) {
      throw new Error('图像生成失败')
    }

    return NextResponse.json({
      sceneId: scene.id,
      image: `data:image/png;base64,${base64}`,
    })
  } catch (error: any) {
    console.error('[Scene API Error]', error)
    return NextResponse.json(
      { error: error.message || '场景图像生成失败' },
      { status: 500 }
    )
  }
}
