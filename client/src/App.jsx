import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverMessage, setServerMessage] = useState('Loading...')

  useEffect(() => {
    // The '/api/health' path is proxied by Vite to our backend
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setServerMessage(data.message))
      .catch(err => {
        console.error(err)
        setServerMessage('Failed to connect to the server')
      })
  }, []) // The empty array [] means this effect runs once on component mount

  return (
    <>
      <h1>Social Thumbnail Generator</h1>
      <div className="card">
        <p>
          Status from server: <strong>{serverMessage}</strong>
        </p>
      </div>
    </>
  )
}

export default App