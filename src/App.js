import './App.css';
import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import * as apiService from './services/apiService'
function App() {

  const [shortuct, setShortucts] = useState([])
  const [SelectedCategory, setSelectedCategory] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const r = await apiService.getShortcuts();
      if (r != null) {
        setShortucts(r);
        console.log(r);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
      <p>good p</p>
      <p>{JSON.stringify(shortuct, null, 2)}</p>
      <p>xx</p>
      <p>{shortuct.map(x => {
        return (<Link to="#" >{x.name}</Link>)
      })}</p>
    </div>
  );
}

export default App;
