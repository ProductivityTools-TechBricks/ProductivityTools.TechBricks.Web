import './App.css';
import {useEffect, useState} from 'react'
import * as apiService from './services/apiService'
function App() {

  const[shortuct,setShortucts]=useState([])
  useEffect(()=>{
    const fetchData=async()=>{
      const r=await apiService.getShortcuts();
      if (r!=null){
        setShortucts(r);
      }
    }
    fetchData();
  },[]);

  return (
    <div className="App">
     <p>good p</p>
     <p>{shortuct}</p>
    </div>
  );
}

export default App;
