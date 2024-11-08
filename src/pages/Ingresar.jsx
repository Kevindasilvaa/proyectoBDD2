import styles from './Ingresar.module.css';
import { useState,useEffect } from 'react';
import { useUser } from '../context/user';
import { loginWithCredentials, iniciarSesionGoogle } from '../controllers/auth';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import picture1 from '../img/image.png';
import {GoogleLoginButton} from 'react-social-login-buttons';

export default function Ingresar() {
    const {user,setUser} = useUser();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    //cada vez que el auth cambie pasara por aqui
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate("/Biblioteca");
        } 
        });
    }, []);
    function botonIniciarSesion(){
        // Set initial error values to empty
        setEmailError("");
        setPasswordError("");
        //Si user == null entonces no hay sesion iniciada.En caso contrario hay una sesion iniciada.
        if( user == null){
            // Check if the user has entered both fields correctly
            if ("" === email) {
                setEmailError("Por favor coloca tu email");
                return;
            }
        
            if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                setEmailError("Por favor coloca un email valido");
                return;
            }
        
            if ("" === password) {
                setPasswordError("Por favor ingresa una contraseña");
                return;
            }
        
            if (password.length < 7) {
                setPasswordError("La contraseña debe tener al menos 7 caracteres");
                return;
            }
            loginWithCredentials(email,password);
        }else{
            alert("Actualmente hay una sesion iniciada.Cierra sesion para iniciar con otro usuario.");
        }
    }

    async function botonIniciarSesionGoogle(){
        //Si user == null entonces no hay sesion iniciada.En caso contrario hay una sesion iniciada.
        if( user == null){
            //verifica las credenciales y de ser validas, cambiara el estado de user
            const x = await iniciarSesionGoogle();
            if(x === true){
                navigate("/Biblioteca");
                alert("Has iniciado sesion con una cuenta de google que no estaba registrada! \n Rellena los datos de tu perfil.");
            }

        }else{
            alert("Actualmente hay una sesion iniciada.Cierra sesion para iniciar con otro usuario.");
        }
    }

    return (
    <div className={styles.div_principal}>
         <div> {/**PARTE IZQUIERDA(IMAGEN)*/}
            <img width="100%" height="100%"  src={picture1} ></img>
        </div>
        <div style={{ margin:'auto'}}> {/**PARTE DERECHA*/}
            {/**ENCABEZADO */}
            <div className={styles.titleContainer}>
                Inicio de Sesion
            </div>
            <br />
            {/**INPUTS */}
            <div className={styles.div_inputs}>
                <input 
                type="text" 
                placeholder="Email"
                className={styles.inputBox}
                onChange={(ev) => setEmail(ev.target.value)}
                />
                <label className={styles.errorLabel}>{emailError}</label>
                <br />
                <input 
                type="text" 
                placeholder="Contraseña"
                className={styles.inputBox}
                onChange={(ev) => setPassword(ev.target.value)}
                />
                <label className={styles.errorLabel}>{passwordError}</label>
            </div>
            {/**ENLACES A OTRAS PAGINAS */}
            <div className={styles.div_enlaces}>
                <button 
                onClick={() => botonIniciarSesion()}
                className={styles.button}
                >
                Iniciar sesion
                </button>
                <a href="/Registrar">Crear mi Cuenta</a>
            </div>
            {/**INICIO DE SESION MEDIANTE PROVEEDORES */}
            <div>
                <hr className={styles.linea_horizontal}/>
                <GoogleLoginButton onClick={() => botonIniciarSesionGoogle()}></GoogleLoginButton>
            </div>
        </div>
    </div>
    );
  }