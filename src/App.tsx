import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DataEntryPage from './pages/DataEntryPage'
import ReportPage from './pages/ReportPage'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 