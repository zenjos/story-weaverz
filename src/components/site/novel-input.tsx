'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { STYLE_PRESETS } from '@/lib/story-engine'

const SAMPLE_TEXT = `林晚秋站在天台上，风吹起她的长发。她低头看着楼下的车水马龙，嘴角露出一丝苦笑。

"你到底还是来了。"她没有回头，声音被风吹得断断续续。

身后传来脚步声，一个修长的身影停在她三步之外。陆景琛双手插在风衣口袋里，目光复杂地注视着她的背影。

"我找了你三天。"他的声音低沉而克制。

林晚秋转过身，露出那双泛红的眼睛。她穿着一件白色衬衫，袖口挽到小臂，月光下显得格外单薄。

"陆景琛，我说过的话不会变。"她直视他的眼睛，"那笔债，我来还。"

陆景琛上前一步，伸手想要拉她，却在半空停住。他的指尖微微发颤。

"你知道我要的不是钱。"

夜风忽然大了起来，吹得天台边缘的铁丝网嗡嗡作响。林晚秋后退一步，背靠上了栏杆。

"那你要什么？"她轻声问。

"我要你……别再消失了。"`

export function NovelInput() {
  const { novelText, setNovelText, style, setStyle, sceneCount, setSceneCount, setView, reset } = useStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStart = async () => {
    if (!novelText.trim() || novelText.trim().length < 50) {
      setError('请输入至少 50 字的小说内容')
      return
    }
    setError(null)
    setLoading(false)
    setView('processing')
  }

  const handleSample = () => {
    setNovelText(SAMPLE_TEXT)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <button
          onClick={() => {
            reset()
            setView('landing')
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">漫剧工坊</span>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">粘贴小说内容</h1>
          <p className="text-muted-foreground text-sm mb-6">
            AI 会自动分析角色、拆分场景、生成分镜画面。建议 500-3000 字的片段效果最佳。
          </p>

          {/* Textarea */}
          <div className="relative mb-4">
            <textarea
              value={novelText}
              onChange={(e) => setNovelText(e.target.value)}
              placeholder="在此粘贴小说内容，或点击下方按钮使用示例文本…"
              className="w-full h-72 p-4 rounded-xl glass-card resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/40 placeholder:text-muted-foreground/50"
              maxLength={10000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {novelText.length} / 10000
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Sample button */}
          <button
            onClick={handleSample}
            className="text-xs text-purple-300 hover:text-purple-200 transition-colors mb-6 inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            使用示例文本（都市言情片段）
          </button>

          {/* Style selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">画风选择</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(STYLE_PRESETS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setStyle(key)}
                  className={`px-4 py-3 rounded-lg text-sm transition-all border ${
                    style === key
                      ? 'bg-gradient-to-br from-purple-500/20 to-teal-400/20 border-purple-400/50 text-foreground'
                      : 'glass-card border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scene count */}
          <div className="mb-8">
            <label className="flex items-center justify-between text-sm font-medium mb-3">
              <span>分镜数量</span>
              <span className="text-purple-300 font-bold">{sceneCount} 帧</span>
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={sceneCount}
              onChange={(e) => setSceneCount(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          {/* Start button */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-teal-400 hover:opacity-90 text-white border-0 h-12 text-base"
            onClick={handleStart}
            disabled={loading || novelText.trim().length < 50}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                准备中…
              </>
            ) : (
              '开始生成漫剧'
            )}
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
