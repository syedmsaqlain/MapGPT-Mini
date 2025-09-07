import React, { useState } from 'react'
import { parseQuery } from '../lib/nlp.js'

export default function ControlPanel({ agentState, setAgentState }) {
  const [query, setQuery] = useState('Show flood risk zones near Lahore and hospitals')

  const runQuery = () => {
    const result = parseQuery(query, agentState)
    setAgentState(result)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">MapGPT Mini</h1>
      <p className="text-slate-600 text-sm mt-1">
        Ask in natural language and the agent will decide which layers to show.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Show flood risk zones near Lahore"
        />
        <button
          className="rounded-xl px-4 py-2 bg-sky-600 text-white hover:bg-sky-700"
          onClick={runQuery}
        >
          Go
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="text-sm border rounded-lg px-2 py-1" onClick={() => { setQuery('Show hospitals in Lahore') }}>Hospitals</button>
        <button className="text-sm border rounded-lg px-2 py-1" onClick={() => { setQuery('Show flood risk zones near Lahore') }}>Flood zones</button>
        <button className="text-sm border rounded-lg px-2 py-1" onClick={() => { setQuery('Show schools in Karachi') }}>Schools</button>
        <button className="text-sm border rounded-lg px-2 py-1" onClick={() => { setQuery('Display major roads around Islamabad') }}>Roads</button>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Agent Trace</h2>
        <ol className="text-sm space-y-1 max-h-64 overflow-auto pr-2">
          {agentState.trace.map((t, i) => (
            <li key={i} className="text-slate-700">• {t}</li>
          ))}
        </ol>
      </div>

      <div className="mt-6 p-3 bg-slate-50 rounded-xl border">
        <h3 className="font-semibold">Map State</h3>
        <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(agentState, null, 2)}</pre>
      </div>
    </div>
  )
}
