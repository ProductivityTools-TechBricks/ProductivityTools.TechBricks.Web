import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './Session/AuthContext'


import BrickList from './Components/BrickList';
import BrickItem from './Components/BrickItem'
import PalletItemNew from './Components/PalettItemNew';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter >
          <Routes>
            {/* Old bookmarks - logging in is done with the button on every page. */}
            <Route path='/login' element={<Navigate to='/' replace />} />
            <Route path=":username" element={<BrickList />} />
            <Route path='/' element={<BrickList key='home' home />} />
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

