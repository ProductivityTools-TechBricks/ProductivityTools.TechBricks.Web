import './App.css';
import Login from './Session/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './Session/AuthContext'


import Home from './Components/Home'
import BrickList from './Components/BrickList';
import BricktemNew from './Components/BricktemNew'
import PalletItemNew from './Components/PalettItemNew';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter >
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/bricks' element={<BrickList />} />
            <Route path='/bricks/new' element={<BricktemNew />} />
            <Route path='/pallet/new' element={<PalletItemNew />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

