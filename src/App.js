import './App.css';
import Login from './Session/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './Session/AuthContext'


import Home from './Components/Home'
import DictList from './Components/DictList';
import DictItemNew from './Components/DictItemNew'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter >
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/dict' element={<DictList />} />
            <Route path='/dict/new' element={<DictItemNew />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

