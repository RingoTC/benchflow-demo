import { useTranslation } from 'react-i18next'
import './App.css'
import BenchmarkWall from './components/benchmark/BenchmarkWall'

function App() {
  const { t } = useTranslation()

  return (
    <>
      <div className="hero">
        <div className="hero-title">
          <span>{t('FindTheRightBenchmark')}</span>
        </div>
        <div className="hero-body">
          <BenchmarkWall />
        </div>
      </div>
    </>
  )
}

export default App
