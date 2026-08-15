'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, User, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

export function ResultViewer() {
  const { analysis, characterImages, sceneImages, reset, setView } = useStore()
  const [currentScene, setCurrentScene] = useState(0)
  const [showCharacters, setShowCharacters] = useState(false)

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => { reset(); setView('landing') }}>返回首页</Button>
      </div>
    )
  }

  const scene = analysis.scenes[currentScene]
  const sceneImage = sceneImages[scene.id]
  const sceneChars = scene.characters
    .map((id) => analysis.characters.find((c) => c.id === id))
    .filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-border/30">
        <button
          onClick={() => { reset(); setView('landing') }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          新建漫剧
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center">
            <span className="text-xs text-white font-bold">漫</span>
          </div>
          <span className="font-bold text-sm sm:text-base">{analysis.title}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border hover:bg-muted/50"
          onClick={() => { reset(); setView('input') }}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          重新生成
        </Button>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main: Comic panel viewer */}
          <div className="flex flex-col">
            {/* Scene counter */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                第 {currentScene + 1} / {analysis.scenes.length} 帧
                <span className="text-muted-foreground text-sm font-normal ml-2">{scene.title}</span>
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-border"
                  disabled={currentScene === 0}
                  onClick={() => setCurrentScene((s) => s - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-border"
                  disabled={currentScene === analysis.scenes.length - 1}
                  onClick={() => setCurrentScene((s) => s + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Comic panel */}
            <div className="relative aspect-[768/1344] max-h-[70vh] mx-auto w-full rounded-2xl overflow-hidden glass-card">
              <AnimatePresence mode="wait">
                {sceneImage ? (
                  <motion.img
                    key={scene.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    src={sceneImage}
                    alt={scene.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                    画面生成失败
                  </div>
                )}
              </AnimatePresence>

              {/* Dialogue overlay */}
              {scene.dialogue.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {scene.dialogue.map((line, i) => (
                    <p key={i} className="text-sm text-white/90 leading-relaxed mb-1 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Scene info */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{scene.location}</span>
              </div>
              <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{scene.time}</span>
              </div>
              <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-xs text-muted-foreground truncate">
                  {sceneChars.map((c) => c!.name).join('、')}
                </span>
              </div>
            </div>

            {/* Scene thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {analysis.scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentScene(i)}
                  className={`relative shrink-0 w-16 h-28 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentScene
                      ? 'border-purple-400 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {sceneImages[s.id] ? (
                    <img
                      src={sceneImages[s.id]}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
                      {i + 1}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-[10px] text-white py-0.5">
                    {i + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar: Characters */}
          <div className="flex flex-col">
            <button
              onClick={() => setShowCharacters(!showCharacters)}
              className="flex items-center justify-between mb-4 lg:cursor-default"
            >
              <h3 className="text-lg font-bold">角色设定</h3>
              <span className="text-xs text-muted-foreground">{analysis.characters.length} 位</span>
            </button>

            <div className="space-y-4 overflow-y-auto max-h-[80vh]">
              {analysis.characters.map((char) => {
                const img = characterImages[char.id]
                return (
                  <motion.div
                    key={char.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    {/* Character image */}
                    <div className="aspect-square bg-muted/20">
                      {img ? (
                        <img
                          src={img}
                          alt={char.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          图像生成失败
                        </div>
                      )}
                    </div>
                    {/* Character info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{char.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300">
                          {char.role}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <p><span className="text-foreground/60">性别：</span>{char.gender}</p>
                        <p><span className="text-foreground/60">年龄：</span>{char.age}</p>
                        <p><span className="text-foreground/60">外貌：</span>{char.appearance}</p>
                        <p><span className="text-foreground/60">服装：</span>{char.clothing}</p>
                        <p><span className="text-foreground/60">性格：</span>{char.personality}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
