
import { useState } from 'react'

function App() {
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('running')
  const [logs, setLogs] = useState<string[]>([
    "Initialisation de l'agent...",
    "Keylogger hook prêt (En attente du backend)"
  ])

  return (
    <div className="container">
      <header className="header">
        <h1>Timeless Heroes Agent</h1>
      </header>
      
      <div className="status-card">
        <div className={`status-indicator ${status}`}></div>
        <div className="status-text">
          {status === 'running' ? 'Service Actif' : 'Service Arrêté'}
        </div>
      </div>

      <div className="log-window">
        <h3>Logs d'activité</h3>
        <div className="logs">
          {logs.map((log, i) => (
            <div key={i} className="log-line">{`> ${log}`}</div>
          ))}
        </div>
      </div>

      <div className="hint-text">
        <p>L'agent tourne en arrière-plan.</p>
        <p>Vous pouvez fermer cette fenêtre, elle restera accessible via la barre des tâches.</p>
      </div>

      <button className="minimize-btn" onClick={() => window.close()}>
        Réduire dans la barre des tâches
      </button>
    </div>
  )
}

export default App
