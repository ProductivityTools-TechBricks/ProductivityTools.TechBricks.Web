import './App.css';
import Login from './Session/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import Home from './Components/Home'
import ShortcutList from './Components/ShortcutList';
import ShortcutItemNew from './Components/ShortcutItemNew';

function App() {



  return (
    <div className="App">
      <BrowserRouter >
        <Routes>
          <Route path='/login' element={<Login/>}/> 
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/shortcuts' element={<ShortcutList/>}/>
          <Route path='/shortcuts/new' element={<ShortcutItemNew/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

