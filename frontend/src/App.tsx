import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import axios from 'axios'
import './App.css'

type CarRow = {
  name: string
  company: string
  year: string | number
  kms_driven: string | number
  fuel_type: string
}

function getUniqueSorted(values: Array<string | number>): string[] {
  const unique = Array.from(new Set(values.filter((v) => v !== undefined && v !== null)))
  return unique
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0)
    .sort((a, b) => a.localeCompare(b))
}

function App() {
  const [data, setData] = useState<CarRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedFuel, setSelectedFuel] = useState<string>('')
  const [kmsDriven, setKmsDriven] = useState<number | ''>('')
  const [predictionResult, setPredictionResult] = useState<string | null>(null)
  const [predictionError, setPredictionError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCsv() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/Cleaned_Car_data.csv', { cache: 'no-store' })
        const text = await response.text()
        const parsed = Papa.parse<CarRow>(text, { header: true, skipEmptyLines: true })
        const rows = (parsed.data || []) as CarRow[]
        setData(rows)
      } catch (e) {
        setError('Failed to load dataset')
      } finally {
        setLoading(false)
      }
    }
    loadCsv()
  }, [])

  const companies = useMemo(() => getUniqueSorted(data.map((r) => r.company)), [data])
  const fuelTypes = useMemo(() => getUniqueSorted(data.map((r) => r.fuel_type)), [data])
  const years = useMemo(() => {
    const uniq = Array.from(
      new Set(
        data
          .map((r) => (typeof r.year === 'number' ? r.year : parseInt(String(r.year), 10)))
          .filter((n) => !Number.isNaN(n))
      )
    ) as number[]
    return uniq.sort((a, b) => b - a).map((n) => String(n))
  }, [data])

  const modelsByCompany = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const row of data) {
      const company = String(row.company || '').trim()
      const model = String(row.name || '').trim()
      if (!company || !model) continue
      if (!map.has(company)) map.set(company, new Set())
      map.get(company)!.add(model)
    }
    const out = new Map<string, string[]>()
    for (const [company, set] of map.entries()) {
      out.set(company, Array.from(set).sort((a, b) => a.localeCompare(b)))
    }
    return out
  }, [data])

  const modelsForSelectedCompany = useMemo(() => {
    if (!selectedCompany) return []
    return modelsByCompany.get(selectedCompany) || []
  }, [modelsByCompany, selectedCompany])

  useEffect(() => {
    // Reset model when company changes
    setSelectedModel('')
  }, [selectedCompany])

  async function handlePredict() {
    if (!selectedCompany || !selectedModel || !selectedYear || !selectedFuel || kmsDriven === '') {
      setPredictionError('Please select Company, Model, Year, Fuel and enter Kms Driven.')
      setPredictionResult(null)
      return
    }

    // Clear previous results
    setPredictionError(null)
    setPredictionResult(null)

    // Backend expects form fields: company, car_models, year, fuel_type, kilo_driven
    const form = new URLSearchParams()
    form.set('company', selectedCompany)
    form.set('car_models', selectedModel)
    form.set('year', String(Number(selectedYear)))
    form.set('fuel_type', selectedFuel)
    form.set('kilo_driven', String(Number(kmsDriven)))

    try {
      const res = await axios.post('http://localhost:5000/predict', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      // Backend returns plain text number string
      setPredictionResult(res.data)
    } catch (e) {
      console.error(e)
      setPredictionError('Prediction request failed. Backend may not be running yet.')
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Car Price Predictor</h2>

        {loading && <p className="status">Loading dataset...</p>}
        {error && <p className="status error">{error}</p>}

        <div className="form-grid">
          <label className="field">
            <span className="label">Company</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              disabled={loading}
              className="select"
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Model</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedCompany || loading}
              className="select"
            >
              <option value="">Select model</option>
              {modelsForSelectedCompany.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Year</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={loading}
              className="select"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Fuel Type</span>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              disabled={loading}
              className="select"
            >
              <option value="">Select fuel</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Kms Driven</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              placeholder="e.g. 45000"
              value={kmsDriven}
              onChange={(e) => setKmsDriven(e.target.value === '' ? '' : Number(e.target.value))}
              className="input"
              id = "kmsDriven"
            />
          </label>

          <button onClick={handlePredict} disabled={loading} className="button">
            Predict
          </button>
          
          {predictionResult && (
            <div className="result success">
              <h3>Predicted Price</h3>
              <p className="price">₹ {predictionResult}</p>
            </div>
          )}
          
          {predictionError && (
            <div className="result error">
              <p>{predictionError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
