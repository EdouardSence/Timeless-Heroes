
import { useEffect, useRef, useState } from 'react'

// Define types for the exposed API
interface IElectronAPI {
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
  off: (channel: string, ...args: any[]) => void
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI
  }
}

function App() {
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle')
  const [logs, setLogs] = useState<string[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Listen for logs from main process
    const logListener = (_event: any, message: string) => {
      setLogs(prev => [...prev.slice(-99), message]) // Keep last 100 logs
    }

    const statusListener = (_event: any, newStatus: 'running' | 'stopped' | 'error') => {
      setStatus(newStatus === 'stopped' ? 'idle' : newStatus)
    }

    window.ipcRenderer.on('log-message', logListener)
    window.ipcRenderer.on('status-update', statusListener)

    return () => {
      // Cleanup listeners if possible/exposed
      // window.ipcRenderer.off('log-message', logListener)
    }
  }, [])

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <div className="container">
      <header className="header">
        <h1>Timeless Heroes Agent</h1>
      </header>
      
      <div className="status-card">
        <div className={`status-indicator ${status}`}></div>
        <div className="status-text">
          {status === 'running' ? 'Service Actif' : status === 'error' ? 'Erreur' : 'Service Arrêté'}
        </div>
      </div>

      <div className="log-window">
        <h3>Logs d'activité</h3>
        <div className="logs">
          {logs.length === 0 && <div className="log-line text-gray">En attente du démarrage...</div>}
          {logs.map((log, i) => (
            <div key={i} className="log-line">{`> ${log}`}</div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      <div className="hint-text">
        <p>L'agent capture vos touches en arrière-plan.</p>
        <p>Minimisez cette fenêtre pour continuer à jouer.</p>
      </div>

      <button className="minimize-btn" onClick={() => window.close()}>
        Réduire dans la barre des tâches
      </button>
    </div>
  )
}

export default App
