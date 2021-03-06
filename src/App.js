import './App.css';
import Login from './Session/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './Session/AuthContext'


import Home from './Components/Home'
import BrickList from './Components/BrickList';
import BrickItem from './Components/BrickItem'
import PalletItemNew from './Components/PalettItemNew';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter >
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path=":username" element={<BrickList />} />
            <Route path='/' element={<Home />} />
            <Route path='/bricks' element={<BrickList />} />
            <Route path='/bricks/new' element={<BrickItem />} />
            <Route path='/pallets/new' element={<PalletItemNew />} /> 
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

