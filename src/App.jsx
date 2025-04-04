import React, { useState } from 'react'

const INITIAL_ROWS = Array.from({ length: 75 }, () => ({
  input: '', prediction: '', strategy: '', result: '', hit: ''
}))

export default function App() {
  const [records, setRecords] = useState(INITIAL_ROWS)
  const [index, setIndex] = useState(0)

  const handleInput = (value) => {
    const newRecords = [...records]
    newRecords[index].input = value

    if (index + 1 < newRecords.length) {
      const strategy = getStrategy(index, newRecords)
      const basePrediction = getPrediction(index, newRecords)
      const prediction = strategy === '역추세 진입' ? reverse(basePrediction) : basePrediction
      newRecords[index + 1].strategy = strategy
      newRecords[index + 1].prediction = prediction
    }

    setRecords(newRecords)
    setIndex(index + 1)
  }

  const handleResult = (i, value) => {
    const newRecords = [...records]
    newRecords[i].result = value

    const pred = newRecords[i].prediction
    const res = newRecords[i].result
    if (pred && res) {
      if (res === 'T' && (pred === 'B' || pred === 'P')) {
        newRecords[i].hit = ''
      } else if (pred === res) {
        newRecords[i].hit = '⭕'
      } else {
        newRecords[i].hit = '❌'
      }
    }

    setRecords(newRecords)
  }

  const getPrediction = (i, data) => {
    if (i === 0) return 'B'
    return data[i - 1].input === 'B' ? 'P' : 'B'
  }

  const getStrategy = (i, data) => {
    if (i < 3) return '관망'
    const last3 = [data[i - 1], data[i - 2], data[i - 3]].map(r => r.input)
    return last3.every(v => v && v === last3[0]) ? '역추세 진입' : '추종'
  }

  const reverse = (v) => {
    if (v === 'B') return 'P'
    if (v === 'P') return 'B'
    return v
  }

  return (
    <div>
      <h1>FlowShift 예측기 (React 프로젝트)</h1>
      <div style={{ marginBottom: '10px' }}>
        {['B', 'P', 'T'].map(v => (
          <button key={v} onClick={() => handleInput(v)}>{v}</button>
        ))}
      </div>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>#</th><th>입력</th><th>전략</th><th>예측</th><th>결과</th><th>적중</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{r.input}</td>
              <td>{r.strategy}</td>
              <td>{r.prediction}</td>
              <td>
                {['B', 'P', 'T'].map(v => (
                  <button key={v} onClick={() => handleResult(i, v)}>{v}</button>
                ))}
              </td>
              <td>{r.hit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
