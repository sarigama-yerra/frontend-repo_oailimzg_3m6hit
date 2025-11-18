import { useEffect, useState } from 'react'
import Header from './components/Header'
import CreateChallenge from './components/CreateChallenge'
import ChallengeList from './components/ChallengeList'
import ChallengeDetail from './components/ChallengeDetail'

function App() {
  const [selected, setSelected] = useState(null)
  const [created, setCreated] = useState(null)

  useEffect(() => {
    if (created?.challenge) setSelected(created.challenge)
  }, [created])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_45%)]" />

      <div className="relative max-w-5xl mx-auto p-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-1 space-y-6">
            <CreateChallenge onCreated={setCreated} />
            <div className="bg-slate-800/60 border border-blue-400/20 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">Open Challenges</h3>
              <ChallengeList onSelect={setSelected} />
            </div>
          </div>

          <div className="lg:col-span-2">
            {!selected ? (
              <div className="h-full min-h-[360px] flex items-center justify-center bg-slate-800/60 border border-blue-400/20 rounded-2xl p-8 text-center">
                <div>
                  <p className="text-white text-xl font-semibold">Pick or create a challenge to see details</p>
                  <p className="text-blue-300/80 mt-1 text-sm">Log daily screen time. Lowest total wins the bet.</p>
                </div>
              </div>
            ) : (
              <ChallengeDetail challenge={selected} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
