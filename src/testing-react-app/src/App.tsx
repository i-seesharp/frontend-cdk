import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home'
import './App.css'
import { About } from './components/About'
import { CICD } from './components/CICD'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/about' element={ <About /> } />
        <Route path='/cicd' element={ <CICD /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
