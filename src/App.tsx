import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Dashboard } from './pages/Dashboard'
import { Mesas } from './pages/Mesas'
import { Proyeccion } from './pages/Proyeccion'
import { Admin } from './pages/Admin'

function Layout() {
  const location = useLocation()
  const showNav = location.pathname !== '/proyeccion'

  return (
    <>
      {showNav && <Nav />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mesas" element={<Mesas />} />
        <Route path="/proyeccion" element={<Proyeccion />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  )
}
