import { onAuthStateChanged } from 'firebase/auth';
import styles from './Biblioteca.module.css';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Biblioteca() {
  const navigate = useNavigate();
    //cada vez que el auth cambie pasara por aqui
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if(user === null){
            navigate("/");  
          }
        });
    }, []);

  

    const [filterValue, setFilterValue] = useState("");

    function buscador() {
    }

    return (
      <div style={{height: "100vh", backgroundColor: "#1C2C54", color: "white" }}>
        <div style={{padding: "5%"}}>
        <form className="d-flex">
        <input className='form-control form-control-lg'
          value={filterValue} placeholder='Escribe el nombre del libro...'
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <button className="btn btn-outline-light" onClick={buscador}>Search</button>
        </form>
        </div>
        </div>
        
    );
}styles;