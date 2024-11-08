import styles from './MeGusta.module.css';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';


export default function MeGusta() {
  const navigate = useNavigate();
  //cada vez que el auth cambie pasara por aqui
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user === null) {
            navigate("/");  
        }
      });
    }, []);

  return (
    <div style={{height: "100vh", backgroundColor: "#1C2C54", color: "white" }}>
    </div>
  );
}
styles