import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const LandingPage = () => {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleGenerateClick = () => {
    setShowPrompt(true);
    setPasscode('');
    setError('');
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'FALCON') {
      setShowPrompt(false);
      setError('');
      navigate('/data-entry');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto py-16 sm:py-24">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-primary-dark tracking-tight mb-4 drop-shadow-sm">
          Welcome to <span className="bg-gradient-to-r from-primary via-accent to-blush text-transparent bg-clip-text">Falcon</span>
        </h1>
        <p className="mt-4 text-2xl text-gray-600 font-light mb-8">
          Professional surveillance tool for generating automated, high-quality monthly Dialysis Event reports
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleGenerateClick}
            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white text-lg font-semibold shadow-soft transition hover:scale-105 hover:shadow-lg"
          >
            Generate New Report
          </button>
        </div>
        {showPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <form onSubmit={handlePasscodeSubmit} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <label className="text-lg font-semibold mb-2">Enter Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="mb-4 px-4 py-2 rounded-xl border border-gray-300 focus:border-primary focus:ring-primary text-lg"
                autoFocus
              />
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <div className="flex gap-4">
                <button type="submit" className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-soft hover:bg-accent transition">Submit</button>
                <button type="button" onClick={() => setShowPrompt(false)} className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold shadow-soft hover:bg-gray-300 transition">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-primary-dark mb-8">Key Features</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-8 bg-gradient-to-br from-white via-blue-50 to-blush-light rounded-2xl shadow-soft transition hover:shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">CDC & NHSN Compliant</h3>
            <p className="text-gray-500">Fully aligned with CDC and NHSN protocols for accurate reporting</p>
          </div>
          <div className="p-8 bg-gradient-to-br from-white via-accent-light to-primary-light rounded-2xl shadow-soft transition hover:shadow-lg">
            <h3 className="text-lg font-semibold text-accent mb-2">Automated Calculations</h3>
            <p className="text-gray-500">Automatic event rate calculations and benchmarking</p>
          </div>
          <div className="p-8 bg-gradient-to-br from-white via-blush-light to-pink-light rounded-2xl shadow-soft transition hover:shadow-lg">
            <h3 className="text-lg font-semibold text-blush mb-2">Professional Reports</h3>
            <p className="text-gray-500">Generate beautiful, printable reports with detailed analytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage 