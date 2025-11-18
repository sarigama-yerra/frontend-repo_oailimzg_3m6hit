import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function ChallengeList({ onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/challenges`)
        const data = await res.json()
        setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="text-blue-200">Loading challenges...</div>

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-blue-200/80">No challenges yet. Create one above!</p>
      )}
      {items.map(ch => (
        <button key={ch._id} onClick={() => onSelect?.(ch)} className="w-full text-left bg-slate-900/40 border border-blue-400/20 hover:border-blue-400/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{ch.title}</p>
              <p className="text-xs text-blue-300/70">{ch.bet_type} • {ch.bet_details || 'friendly wager'}</p>
            </div>
            <div className="text-blue-300 text-sm">{(ch.participants||[]).length} joined</div>
          </div>
        </button>
      ))}
    </div>
  )
}
