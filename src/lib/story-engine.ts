// Story Engine - Types and AI prompt templates for the novel-to-comic-drama pipeline.
//
// The core idea: analyze the novel with an LLM to extract structured data
// (characters + scenes with visual descriptions), then feed those descriptions
// into an image generation model. The `visualPrompt` field on each character
// is the key to consistency — it's generated once and injected into every
// scene panel prompt so the same character looks the same across all frames.

export interface Character {
  id: string
  name: string
  role: string // protagonist / supporting / antagonist
  gender: string
  age: string
  appearance: string // detailed: hair color, hairstyle, eye color, build
  clothing: string // outfit description
  personality: string // temperament
  voice: string // voice description
  visualPrompt: string // full English prompt for image generation (frozen per character)
}

export interface Scene {
  id: string
  index: number
  title: string
  location: string
  time: string // day / dusk / night
  characters: string[] // character IDs appearing in this scene
  description: string // scene description
  dialogue: string[] // key dialogue lines
  mood: string // emotional atmosphere
  visualPrompt: string // full English prompt for image generation
}

export interface StoryAnalysis {
  title: string
  summary: string
  characters: Character[]
  scenes: Scene[]
}

/// Art style presets. The `keyword` string is appended to every image prompt.
/// Add your own styles here — see README for instructions.
export const STYLE_PRESETS: Record<string, { label: string; keyword: string }> = {
  anime: { label: 'Japanese Anime', keyword: 'Japanese anime style, clean linework, vibrant colors, detailed anime eyes, cel shading' },
  guofeng: { label: 'Chinese Ink Wash', keyword: 'Chinese ink wash painting style, traditional Chinese aesthetics, elegant brushwork, muted tones' },
  realistic: { label: 'Semi-Realistic', keyword: 'Semi-realistic digital painting, detailed shading, cinematic lighting, concept art quality' },
  watercolor: { label: 'Watercolor Storybook', keyword: 'Soft watercolor illustration style, gentle color blending, hand-painted texture, storybook aesthetic' },
}

/// LLM prompt: analyzes the novel and returns structured JSON.
/// The system prompt is in Chinese for best results with Chinese novels,
/// but works with any language input.
export function buildAnalysisPrompt(novelText: string, sceneCount: number) {
  return `你是一位专业的漫剧编剧和分镜师。请分析以下小说片段，提取关键信息用于漫剧制作。

要求：
1. 提取 ${sceneCount} 个核心场景，按剧情发展排列
2. 每个角色要有详细的外貌描述（发色、发型、瞳色、体型、年龄感）
3. 每个场景要有明确的地点、时间、出场角色、情绪氛围
4. 对白要精简到最关键的 1-3 句
5. 生成每个角色和场景的"视觉提示词"（visualPrompt），用英文写，包含外貌、服装、表情、场景细节，用于 AI 绘画

请以 JSON 格式返回，结构如下：
{
  "title": "故事标题",
  "summary": "一句话概要",
  "characters": [
    {
      "id": "c1",
      "name": "角色名",
      "role": "主角/配角/反派",
      "gender": "男/女",
      "age": "约25岁",
      "appearance": "黑色长发、琥珀色眼睛、身材纤细",
      "clothing": "白色长裙、银色发饰",
      "personality": "冷静、内敛、偶尔温柔",
      "voice": "低沉温和",
      "visualPrompt": "young woman, long straight black hair, amber eyes, slim figure, white long dress, silver hair ornament, calm expression, anime style"
    }
  ],
  "scenes": [
    {
      "id": "s1",
      "index": 1,
      "title": "场景标题",
      "location": "地点描述",
      "time": "白天/黄昏/夜晚",
      "characters": ["c1"],
      "description": "场景画面描述",
      "dialogue": ["对白1", "对白2"],
      "mood": "紧张/温馨/悲伤",
      "visualPrompt": "ancient Chinese courtyard, daytime, cherry blossoms falling, a young woman in white dress standing alone, calm melancholic mood, anime style"
    }
  ]
}

小说内容：
---
${novelText}
---

请只返回 JSON，不要包含其他文字。`
}

/// Image prompt: generates a character reference sheet (multiple angles, full body).
/// This is called once per character — the resulting image is shown as the character card.
export function buildCharacterPrompt(character: Character, styleKeyword: string) {
  return `${character.visualPrompt}, character reference sheet, multiple angles, front view and side view, full body, ${styleKeyword}, high quality, detailed, white background`
}

/// Image prompt: generates a single comic panel.
/// Crucially, this injects each character's frozen `visualPrompt` into the
/// scene description, ensuring visual consistency across panels.
export function buildScenePrompt(scene: Scene, characters: Character[], styleKeyword: string) {
  const charDescs = scene.characters
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => `${c!.name}: ${c!.visualPrompt}`)
    .join('; ')

  return `${scene.visualPrompt}. Characters in scene: ${charDescs}. Mood: ${scene.mood}. ${styleKeyword}, comic panel layout, cinematic composition, high quality, detailed background, consistent character design`
}
