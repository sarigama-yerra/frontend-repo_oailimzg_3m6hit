import React, { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function CreateChallenge({ onCreated }) {
  const [title, setTitle] = useState('')
  const [betType, setBetType] = useState('food')
  const [betDetails, setBetDetails] = useState('Loser buys pizza 🍕')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10))
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,10))
  const [creatorId, setCreatorId] = useState('')
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const createUser = async () => {
    const res = await fetch(`${API}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, name: handle })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Failed to create user')
    return data.id
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let uid = creatorId
      if (!uid) {
        if (!handle) throw new Error('Enter a handle to create your profile')
        uid = await createUser()
        setCreatorId(uid)
      }

      const res = await fetch(`${API}/api/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          creator_id: uid,
          start_date: startDate,
          end_date: endDate,
          bet_type: betType,
          bet_details: betDetails,
          participants: [uid]
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create challenge')
      onCreated?.(data)

      setTitle('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-400/20 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Start a Challenge</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-200 text-sm mb-1">Your handle</label>
            <input className="w-full rounded-lg bg-slate-900/60 border border-blue-400/20 px-3 py-2 text-white" placeholder="@alex" value={handle} onChange={e=>setHandle(e.target.value)} />
          </div>
          <div>
            <label className="block text-blue-200 text-sm mb-1">Title</label>
            <input className="w-full rounded-lg bg-slate-900/60 border border-blue-400/20 px-3 py-2 text-white" placeholder="January detox" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-blue-200 text-sm mb-1">Start</label>
            <input type="date" className="w-full rounded-lg bg-slate-900/60 border border-blue-400/20 px-3 py-2 text-white" value={startDate} onChange={e=>setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-blue-200 text-sm mb-1">End</label>
            <input type="date" className="w-full rounded-lg bg-slate-900/60 border border-blue-400/20 px-3 py-2 text-white" value={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-200 text-sm mb-1">Bet Type</label>
            <select className="w-full rounded-lg bg-slate-900/60 border border-blue-400/20 px-3 py-2 text-white" value={betType} onChange={e=>setBetType(e.target.value)}>
              <option value="food">Food</option>
              <option value="activity">Activity</option>
              <option value="treat">Treat</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-blue-200 text-sm mb-1">Bet Details</label>
            <input className="w-full rounded-lg bg-slate-900/60 border border-blue-400/20 px-3 py-2 text-white" value={betDetails} onChange={e=>setBetDetails(e.target.value)} />
          </div>
        </div>

        <button disabled={loading} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold">
          {loading ? 'Creating...' : 'Create Challenge'}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  )
}
