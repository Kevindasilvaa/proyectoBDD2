import { createContext, useContext} from "react";

//creamos un contexto
export const UserContext = createContext(null);
//creamos un hook
export function useUser(){
    const user = useContext(UserContext);
    return user;
}