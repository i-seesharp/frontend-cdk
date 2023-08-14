import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home'
import './App.css'
import { About } from './components/About'
import { Coffee } from './components/Profile'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/about' element={ <About /> } />
        <Route path='/coffee' element={ <Coffee name='A.D.B' /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
