import { create } from 'zustand'
import type { Character, Scene, StoryAnalysis } from '@/lib/story-engine'

export type View = 'landing' | 'input' | 'processing' | 'result'
export type StepStatus = 'pending' | 'running' | 'done' | 'error'

export interface Step {
  id: string
  label: string
  icon: string
  status: StepStatus
  detail?: string
}

interface StoreState {
  view: View
  novelText: string
  style: string
  sceneCount: number
  analysis: StoryAnalysis | null
  characterImages: Record<string, string> // characterId -> base64 image
  sceneImages: Record<string, string> // sceneId -> base64 image
  steps: Step[]
  currentStep: number
  error: string | null

  setView: (view: View) => void
  setNovelText: (text: string) => void
  setStyle: (style: string) => void
  setSceneCount: (n: number) => void
  setAnalysis: (a: StoryAnalysis) => void
  setCharacterImage: (id: string, img: string) => void
  setSceneImage: (id: string, img: string) => void
  setStep: (index: number, updates: Partial<Step>) => void
  setCurrentStep: (i: number) => void
  setError: (e: string | null) => void
  reset: () => void
}

const initialSteps: Step[] = [
  { id: 'analyze', label: '分析小说', icon: '📖', status: 'pending' },
  { id: 'characters', label: '提取角色', icon: '🎭', status: 'pending' },
  { id: 'scenes', label: '生成分镜', icon: '📝', status: 'pending' },
  { id: 'character-art', label: '角色设定图', icon: '🎨', status: 'pending' },
  { id: 'scene-art', label: '场景画面', icon: '🖼️', status: 'pending' },
  { id: 'assemble', label: '成片组装', icon: '🎬', status: 'pending' },
]

export const useStore = create<StoreState>((set) => ({
  view: 'landing',
  novelText: '',
  style: 'anime',
  sceneCount: 6,
  analysis: null,
  characterImages: {},
  sceneImages: {},
  steps: initialSteps,
  currentStep: 0,
  error: null,

  setView: (view) => set({ view }),
  setNovelText: (novelText) => set({ novelText }),
  setStyle: (style) => set({ style }),
  setSceneCount: (sceneCount) => set({ sceneCount }),
  setAnalysis: (analysis) => set({ analysis }),
  setCharacterImage: (id, img) =>
    set((s) => ({ characterImages: { ...s.characterImages, [id]: img } })),
  setSceneImage: (id, img) =>
    set((s) => ({ sceneImages: { ...s.sceneImages, [id]: img } })),
  setStep: (index, updates) =>
    set((s) => ({
      steps: s.steps.map((step, i) => (i === index ? { ...step, ...updates } : step)),
    })),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      view: 'landing',
      novelText: '',
      analysis: null,
      characterImages: {},
      sceneImages: {},
      steps: initialSteps,
      currentStep: 0,
      error: null,
    }),
}))
