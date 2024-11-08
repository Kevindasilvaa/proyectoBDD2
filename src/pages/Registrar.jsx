import styles from './Registrar.module.css';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ingresarGoogle, registerWithCredentials } from '../controllers/auth';

import {GoogleLoginButton} from 'react-social-login-buttons';
import picture1 from '../img/image.png';


export default function Registar() {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [country,setCountry] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [countryError,setCountryError] = useState("");

    //cada vez que el auth cambie pasara por aqui
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate("/Biblioteca");
        } else {
            console.log("Error en el useefect de la pagina Ingresar");  
        }
        });
    }, []);

    function register(){
        // Set initial error values to empty
        setEmailError("");
        setPasswordError("");
        setNameError("");
        setCountryError("");


        // Check if the user has entered both fields correctly
        if(name === ""){
            setNameError("Por favor coloca tu nombre");
            return;
        }
        if ("" === email) {
            setEmailError("Por favor coloca tu email");
            return;
        }
        if ("" === country) {
            setCountryError("Por favor coloca tu country");
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
            setPasswordError("La contraseña debe tener al menos 8 caracteres");
            return;
        }
        registerWithCredentials(email,password,name,country);
    }

    function registrarConGoogle(){ 
        setCountryError("");
        if(country === ""){
            setCountryError("Por favor coloca tu Country antes de registrarte con Google");
            return;
        }
        ingresarGoogle(country);
    }

    return (
        <div className={styles.div_principal}>
             <div> {/**PARTE IZQUIERDA(IMAGEN)*/}
            <img width="100%" height="100%"  src={picture1} ></img>
        </div>
            <div style={{ margin:'auto' }}>{/**PARTE DERECHA*/}
                {/**ENCABEZADO */}
                <div className={styles.titleContainer}>
                    <div>Registro</div>
                </div>
                <br />
                {/**INPUTS */}
                <div className={styles.div_inputs}>
                    <input 
                    type="text" 
                    placeholder="Nombre"
                    className={styles.inputBox}
                    onChange={(ev) => setName(ev.target.value)}
                    />
                    <label className={styles.errorLabel}>{nameError}</label>
                    <br />
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
                    placeholder="Country"
                    className={styles.inputBox}
                    onChange={(ev) => setCountry(ev.target.value)}
                    />
                    <label className={styles.errorLabel}>{countryError}</label>
                    <br />
                    <input 
                    type="text" 
                    placeholder="Contraseña"
                    className={styles.inputBox}
                    onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <label className={styles.errorLabel}>{passwordError}</label>
                    <br />
                </div>
                {/**ENLACES A OTRAS PAGINAS */}
                <div className={styles.div_enlaces}>
                    <button 
                    onClick={() => register(email,password,name)}
                    className={styles.button}
                    >Crear Cuenta</button>
                </div>
                {/**INICIO DE SESION MEDIANTE PROVEEDORES */}
                <div>
                    <hr className={styles.linea_horizontal}/>
                    <GoogleLoginButton onClick={() => registrarConGoogle()}></GoogleLoginButton>
                </div>
            </div>
        </div>
        );
  }