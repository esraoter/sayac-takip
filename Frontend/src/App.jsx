import { useState, useEffect } from 'react'
import './App.css'
import atollaLogo from './assets/atolla_logo_re.svg'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [devices, setDevices] = useState([])
  const [newDeviceName, setNewDeviceName] = useState('')
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const [readings, setReadings] = useState([])
  const [newReadingValue, setNewReadingValue] = useState('')
  const [error, setError] = useState('')

  const loadDevices = () => {
    fetch(`${API_URL}/devices`, { cache: 'no-store' })
      .then((res) => res.json())
      .then(setDevices)
      .catch(() => setError('Cihazlar yüklenemedi.'))
  }

  useEffect(() => {
    loadDevices()
  }, [])

  const addDevice = (e) => {
    e.preventDefault()
    if (!newDeviceName.trim()) return
    fetch(`${API_URL}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newDeviceName }),
    })
      .then(() => {
        setNewDeviceName('')
        setError('')
        loadDevices()
      })
      .catch(() => setError('Cihaz eklenemedi.'))
  }

  const deleteDevice = (id) => {
    fetch(`${API_URL}/devices/${id}`, { method: 'DELETE' })
      .then(() => {
        loadDevices()
        if (selectedDeviceId === id) {
          setSelectedDeviceId(null)
          setReadings([])
        }
      })
      .catch(() => setError('Cihaz silinemedi.'))
  }

  const selectDevice = (id) => {
    setSelectedDeviceId(id)
    setError('')
    fetch(`${API_URL}/devices/${id}/readings`, { cache: 'no-store' })
      .then((res) => res.json())
      .then(setReadings)
      .catch(() => setError('Okumalar yüklenemedi.'))
  }

  const addReading = (e) => {
    e.preventDefault()
    if (!newReadingValue) return
    fetch(`${API_URL}/devices/${selectedDeviceId}/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: parseFloat(newReadingValue),
        date: new Date().toISOString(),
      }),
    }).then((res) => {
      if (!res.ok) {
        setError('Okuma eklenemedi (negatif değer olamaz)!')
        return
      }
      setNewReadingValue('')
      setError('')
      selectDevice(selectedDeviceId)
    })
  }

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId)

  return (
    <div className="app">
      <div className="brand-logo">
        <img src={atollaLogo} alt="Atollatech Bilişim" />
      </div>

      <h1>SAYAÇ TAKİP</h1>
      <p className="subtitle">Cihazlarını ekle, okumalarını kaydet.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h2>Cihazlar</h2>
        <form className="form-row" onSubmit={addDevice}>
          <input
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
            placeholder="Örn. Elektrik Sayacı 1"
          />
          <button type="submit">Ekle</button>
        </form>

        {devices.length === 0 ? (
          <p className="empty-state">Henüz cihaz eklenmedi.</p>
        ) : (
          <ul className="device-list">
            {devices.map((d) => (
              <li
                key={d.id}
                className={`device-item ${d.id === selectedDeviceId ? 'selected' : ''}`}
              >
                <button
                  className="device-name-btn"
                  onClick={() => selectDevice(d.id)}
                >
                  {d.name}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteDevice(d.id)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDeviceId && (
        <div className="card">
          <h2>{selectedDevice?.name} — okumalar</h2>
          <form className="form-row" onSubmit={addReading}>
            <input
              type="number"
              value={newReadingValue}
              onChange={(e) => setNewReadingValue(e.target.value)}
              placeholder="Okuma değeri"
            />
            <button type="submit">Okuma ekle</button>
          </form>

          {readings.length === 0 ? (
            <p className="empty-state">Henüz okuma eklenmedi.</p>
          ) : (
            <ul className="reading-list">
              {readings.map((r) => (
                <li key={r.id} className="reading-item">
                  <span className="reading-value">{r.value}</span>
                  <span>{new Date(r.date).toLocaleString('tr-TR')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default App