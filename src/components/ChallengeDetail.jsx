import React, { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function ChallengeDetail({ challenge, currentUserId }) {
  const [summary, setSummary] = useState(null)
  const [handle, setHandle] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0,10))
  const [minutes, setMinutes] = useState('')
  const [message, setMessage] = useState('')

  const loadSummary = async () => {
    const res = await fetch(`${API}/api/challenges/${challenge._id}/summary`)
    const data = await res.json()
    setSummary(data)
  }

  useEffect(() => { if (challenge) loadSummary() }, [challenge])

  const join = async () => {
    try {
      setJoinLoading(true)
      let uid = currentUserId
      if (!uid) {
        const create = await fetch(`${API}/api/users`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle, name: handle })
        })
        const u = await create.json()
        if (!create.ok) throw new Error(u.detail || 'Could not create user')
        uid = u.id
      }
      const res = await fetch(`${API}/api/challenges/${challenge._id}/join`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid })
      })
      if (!res.ok) throw new Error('Failed to join')
      await loadSummary()
      setMessage('Joined!')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setJoinLoading(false)
    }
  }

  const log = async () => {
    try {
      const res = await fetch(`${API}/api/logs`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          challenge_id: challenge._id,
          date: logDate,
          minutes: Number(minutes)
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to log')
      setMessage('Saved!')
      setMinutes('')
      await loadSummary()
    } catch (e) {
      setMessage(e.message)
    }
  }

  const standings = useMemo(() => summary?.standings || [], [summary])

  return (
    <div className="bg-slate-800/60 border border-blue-400/20 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{challenge.title}</h3>
          <p className="text-blue-300/80 text-sm">{challenge.bet_type} • {challenge.bet_details}</p>
        </div>
        <button className="text-blue-300 text-sm underline" onClick={loadSummary}>Refresh</button>
      </div>

      {!summary ? (
        <p className="text-blue-200 mt-4">Loading...</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-2">Leaderboard (lower is better)</h4>
            <div className="space-y-2">
              {standings.length === 0 && (
                <p className="text-blue-200/80">No logs yet.</p>
              )}
              {standings.map((s, idx) => (
                <div key={s.user_id} className="flex items-center justify-between bg-slate-900/40 border border-blue-400/20 rounded-xl px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-300/80 text-sm w-6">#{idx+1}</span>
                    <span className="text-white font-medium">{s.handle || s.user_id.slice(-5)}</span>
                  </div>
                  <div className="text-blue-200">{s.total_minutes} min</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-blue-400/20 rounded-xl p-4">
              <h5 className="text-white font-medium mb-2">Join this challenge</h5>
              <div className="flex items-center gap-2">
                <input placeholder="@handle" className="flex-1 rounded-lg bg-slate-950 border border-blue-400/20 px-3 py-2 text-white" value={handle} onChange={e=>setHandle(e.target.value)} />
                <button disabled={joinLoading} onClick={join} className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold">{joinLoading ? 'Joining...' : 'Join'}</button>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-blue-400/20 rounded-xl p-4">
              <h5 className="text-white font-medium mb-2">Log screen time</h5>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="rounded-lg bg-slate-950 border border-blue-400/20 px-3 py-2 text-white" value={logDate} onChange={e=>setLogDate(e.target.value)} />
                <input type="number" placeholder="minutes" className="rounded-lg bg-slate-950 border border-blue-400/20 px-3 py-2 text-white" value={minutes} onChange={e=>setMinutes(e.target.value)} />
              </div>
              <button onClick={log} className="mt-2 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold w-full">Save</button>
            </div>

            {message && <p className="text-blue-200 text-sm">{message}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
