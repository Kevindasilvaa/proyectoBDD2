import {createUserWithEmailAndPassword,getAdditionalUserInfo, signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth";
import {auth,googleProvider} from "../firebase";
import { setDoc, doc} from "firebase/firestore";
import { db } from '../firebase';
import { createNeo4jUser } from '../neo4j'; // Importar la función createNeo4jUser

export async function loginWithCredentials(email, password){
  try{
      await signInWithEmailAndPassword(auth,email,password);

  }catch (e){
      console.error(e);
      alert("Credenciales invalidas");
  }
}
//Dados esos parametros. este metodo guardara los datos del usuario en la base de datos de firebase
//Y tambien en la Autentificacion de firebase
//si el correo que se coloca ya existe, firebase lo detectara y no lo permitira
export async function registerWithCredentials(email,password,name,country){
  try{
      const {user} = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const id = auth.currentUser.uid;
      const docRef = doc(db, "usuarios", id);
      const data = {
            nombre: name,
            email: email,
            country: country,
      };
      await createNeo4jUser(name, email,country);
      await setDoc(docRef, data, { merge: true });
      alert("Su cuenta se ha creado con exito");
      return true;
  }catch (e){
      alert("ERROR! Es posible que el correo que indicaste ya este en uso");
      console.error("error al registrar con credenciales en la funcion registerWithCredentials",e);
      return false;
  }
}

export async function ingresarGoogle(country){
    const result = await signInWithPopup(auth,googleProvider);
    const aditionalInfo = getAdditionalUserInfo(result);
    const id = auth.currentUser.uid;
    //result.uid;
    if(aditionalInfo.isNewUser){
      try {
        const docRef = doc(db, "usuarios", id);
        const data = {
          nombre: result.user.displayName,
          email: result.user.email,
          country: country,
        };
        await createNeo4jUser(result.user.displayName, result.user.email,country);
        await setDoc(docRef, data, { merge: true });
        alert("Su cuenta se ha creado con exito");
      } catch (error) {
        console.error("Error al guardar usuario en firestore: ", error);
      }
    }
    return result.user;
}

export async function iniciarSesionGoogle(){
  const result = await signInWithPopup(auth,googleProvider);
  const aditionalInfo = getAdditionalUserInfo(result);
  const id = auth.currentUser.uid;
  //result.uid;
  if(aditionalInfo.isNewUser){
    try {
      const docRef = doc(db, "usuarios", id);
      const data = {
        nombre: result.user.displayName,
        email: result.user.email,
        country: "Venezuela",
      };
      await createNeo4jUser(result.user.displayName, result.user.email,"Venezuela");
      await setDoc(docRef, data, { merge: true });
      alert("Usted no estaba registrado, se le ha creado una cuenta con exito");
    } catch (error) {
      console.error("Error al guardar usuario en firestore: ", error);
    }
  }
  return false;
}

export async function logOut(){
  await signOut(auth);
}