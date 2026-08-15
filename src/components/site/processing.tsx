'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, AlertCircle, ChevronRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { StoryAnalysis } from '@/lib/story-engine'

export function Processing() {
  const {
    novelText,
    style,
    sceneCount,
    setAnalysis,
    analysis,
    setCharacterImage,
    setSceneImage,
    steps,
    setStep,
    setCurrentStep,
    currentStep,
    setError,
    error,
    setView,
    reset,
  } = useStore()

  const startedRef = useRef(false)
  const [logText, setLogText] = useState('')

  const addLog = (text: string) => {
    setLogText((prev) => prev + text + '\n')
  }

  // Step 1-3: Analyze novel
  const runAnalysis = async () => {
    setStep(0, { status: 'running' })
    setCurrentStep(0)
    addLog('▸ 正在阅读小说…')

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ novelText, sceneCount }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: '分析失败' }))
      throw new Error(data.error || '分析失败')
    }

    const data: StoryAnalysis = await res.json()
    setAnalysis(data)

    setStep(0, { status: 'done', detail: `${data.characters.length} 个角色` })
    addLog(`✓ 分析完成：${data.characters.length} 角色，${data.scenes.length} 场景`)

    // Step 2: Extract characters (already done in analysis)
    setStep(1, { status: 'running' })
    setCurrentStep(1)
    addLog(`▸ 提取角色：${data.characters.map((c) => c.name).join('、')}`)
    await new Promise((r) => setTimeout(r, 600))
    setStep(1, { status: 'done', detail: `${data.characters.length} 个角色设定` })
    addLog(`✓ ${data.characters.length} 个角色设定完成`)

    // Step 3: Generate scene breakdown
    setStep(2, { status: 'running' })
    setCurrentStep(2)
    addLog(`▸ 拆分分镜：${data.scenes.length} 个场景`)
    await new Promise((r) => setTimeout(r, 600))
    setStep(2, { status: 'done', detail: `${data.scenes.length} 个分镜` })
    addLog(`✓ ${data.scenes.length} 个分镜脚本完成`)

    return data
  }

  // Step 4: Generate character images
  const runCharacterArt = async (data: StoryAnalysis) => {
    setStep(3, { status: 'running' })
    setCurrentStep(3)
    addLog(`▸ 生成角色设定图…`)

    for (let i = 0; i < data.characters.length; i++) {
      const char = data.characters[i]
      addLog(`  [${i + 1}/${data.characters.length}] ${char.name}…`)
      try {
        const res = await fetch('/api/generate-character', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character: char, style }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: '生成失败' }))
          throw new Error(err.error)
        }
        const result = await res.json()
        setCharacterImage(char.id, result.image)
        addLog(`  ✓ ${char.name} 设定图完成`)
      } catch (err: any) {
        addLog(`  ✗ ${char.name} 生成失败：${err.message}`)
      }
    }

    setStep(3, { status: 'done', detail: '角色设定图完成' })
    addLog(`✓ 角色设定图全部完成`)
  }

  // Step 5: Generate scene images
  const runSceneArt = async (data: StoryAnalysis) => {
    setStep(4, { status: 'running' })
    setCurrentStep(4)
    addLog(`▸ 生成场景画面…`)

    for (let i = 0; i < data.scenes.length; i++) {
      const scene = data.scenes[i]
      addLog(`  [${i + 1}/${data.scenes.length}] ${scene.title}…`)
      try {
        const res = await fetch('/api/generate-scene', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scene, characters: data.characters, style }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: '生成失败' }))
          throw new Error(err.error)
        }
        const result = await res.json()
        setSceneImage(scene.id, result.image)
        addLog(`  ✓ ${scene.title} 画面完成`)
      } catch (err: any) {
        addLog(`  ✗ ${scene.title} 生成失败：${err.message}`)
      }
    }

    setStep(4, { status: 'done', detail: '场景画面完成' })
    addLog(`✓ 场景画面全部完成`)
  }

  // Step 6: Assemble
  const runAssemble = async () => {
    setStep(5, { status: 'running' })
    setCurrentStep(5)
    addLog(`▸ 组装漫剧…`)
    await new Promise((r) => setTimeout(r, 800))
    setStep(5, { status: 'done', detail: '漫剧成片完成' })
    addLog(`✓ 漫剧成片完成！`)
    addLog(`\n🎬 准备播放…`)
    await new Promise((r) => setTimeout(r, 500))
  }

  // Run the full pipeline
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const run = async () => {
      try {
        const data = await runAnalysis()
        await runCharacterArt(data)
        await runSceneArt(data)
        await runAssemble()
        setView('result')
      } catch (err: any) {
        setError(err.message)
        setStep(currentStep, { status: 'error' })
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
          <span className="font-bold">漫剧工坊 · 生成中</span>
        </div>
        <button
          onClick={() => {
            reset()
            setView('landing')
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          取消
        </button>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Steps panel */}
          <div>
            <h2 className="text-xl font-bold mb-6">生成进度</h2>
            <div className="space-y-3">
              {steps.map((step, i) => {
                const isActive = i === currentStep
                const isDone = step.status === 'done'
                const isError = step.status === 'error'
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'glass-card border-purple-400/50'
                        : isDone
                        ? 'bg-teal-500/5 border-teal-400/20'
                        : isError
                        ? 'bg-red-500/10 border-red-400/30'
                        : 'bg-muted/20 border-border/30 opacity-50'
                    }`}
                  >
                    {/* Status icon */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                      {isDone ? (
                        <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-teal-400" />
                        </div>
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      ) : isError ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <span className="text-lg">{step.icon}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{step.label}</span>
                        {step.detail && (
                          <span className="text-xs text-muted-foreground">
                            · {step.detail}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Connector */}
                    {i < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-border" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-300 mb-1">生成失败</div>
                    <div className="text-xs text-red-400/70">{error}</div>
                    <button
                      onClick={() => {
                        reset()
                        setView('input')
                      }}
                      className="mt-3 text-xs text-red-300 hover:text-red-200 underline"
                    >
                      返回修改
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Log panel */}
          <div>
            <h2 className="text-xl font-bold mb-6">实时日志</h2>
            <div className="glass-card rounded-xl p-4 h-96 overflow-y-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {logText || '等待启动…'}
                <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" />
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
