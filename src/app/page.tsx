'use client'

import { useStore } from '@/lib/store'
import { Landing } from '@/components/site/landing'
import { NovelInput } from '@/components/site/novel-input'
import { Processing } from '@/components/site/processing'
import { ResultViewer } from '@/components/site/result-viewer'

export default function Home() {
  const view = useStore((s) => s.view)

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[50%] right-[5%] w-[500px] h-[500px] rounded-full bg-teal-400/8 blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {view === 'landing' && <Landing />}
        {view === 'input' && <NovelInput />}
        {view === 'processing' && <Processing />}
        {view === 'result' && <ResultViewer />}
      </div>
    </div>
  )
}
