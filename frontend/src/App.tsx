import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '@/components/navbar'
import LandingPage from '@/pages/LandingPage'
import RepoPage from '@/pages/RepoPage'
import SearchPage from '@/pages/SearchPage'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/:username" element={<SearchPage />} />
        <Route path="/search/:username/repos" element={<RepoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
