'use client'

import { motion } from 'framer-motion'
import { BookOpen, Wand2, Users, Film, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

const features = [
  {
    icon: BookOpen,
    title: '输入小说',
    desc: '粘贴任意小说片段，AI 自动阅读理解',
  },
  {
    icon: Users,
    title: '角色提取',
    desc: '自动识别角色，生成外貌 + 服装 + 性格设定',
  },
  {
    icon: Wand2,
    title: '一致性保证',
    desc: '角色描述冻结，每帧注入，画面人物一致',
  },
  {
    icon: Film,
    title: '漫剧成片',
    desc: '分镜画面 + 对白字幕，自动组装成片',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Landing() {
  const setView = useStore((s) => s.setView)

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">漫剧工坊</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border hover:bg-muted/50"
          onClick={() => setView('input')}
        >
          开始创作
        </Button>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm text-muted-foreground mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI 驱动的小说转漫剧引擎
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            输入一本小说
            <br />
            <span className="text-gradient-purple">AI 自动拍成漫剧</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            自动拆解角色、场景、分镜，生成人物设定图和场景画面。
            <span className="text-foreground/90">角色描述冻结 + 每帧注入</span>，保证人物和场景在每一帧都一致。
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-teal-400 hover:opacity-90 text-white border-0 px-8 h-12 text-base group"
              onClick={() => setView('input')}
            >
              立即创作
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted/50 px-8 h-12 text-base"
              onClick={() => {
                const el = document.getElementById('how-it-works')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              了解流程
            </Button>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            id="how-it-works"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={5 + i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="glass-card rounded-xl p-5 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-teal-400/20 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground">
        漫剧工坊 · AI 驱动的小说转漫剧引擎 · 角色一致性为核心
      </footer>
    </div>
  )
}
