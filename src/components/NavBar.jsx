import logo from '../img/logo.png'
import { routes } from '../constants/routes';
import { NavLink } from "react-router-dom";
import { logOut} from '../controllers/auth';
import styles from "./NavBar.module.css"
import { useUser } from '../context/user';

export default function NavBar() {
  const {user,setUser} = useUser();
  
    return (

      <header className={styles.header}>
      <img className={styles.icon} width="100px" height="40px"  src={logo} ></img>

      
      {user ? 
        <nav className={styles.nav}>
         <NavLink
            key={routes[2].path}
            to={routes[2].path}
            className={({ isActive }) =>
              isActive
                ? `${styles["nav-link"]} ${styles.active}`
                : styles["nav-link"]
            }
          >
            {routes[2].name}
          </NavLink>

          <NavLink
            key={routes[3].path}
            to={routes[3].path}
            className={({ isActive }) =>
              isActive
                ? `${styles["nav-link"]} ${styles.active}`
                : styles["nav-link"]
            }
          >
            {routes[3].name}
          </NavLink>

          <NavLink
            key={routes[4].path}
            to={routes[4].path}
            className={({ isActive }) =>
              isActive
                ? `${styles["nav-link"]} ${styles.active}`
                : styles["nav-link"]
            }
          >
            {routes[4].name}
          </NavLink>

      </nav>
      
      :  <nav className={styles.nav}>
      <NavLink
      key={routes[0].path}
      to={routes[0].path}
      className={({ isActive }) =>
        isActive
          ? `${styles["nav-link"]} ${styles.active}`
          : styles["nav-link"]
      }
    >
      {routes[0].name}
    </NavLink>
    </nav>
      }

     
        {user && ( 
         <nav>
          <NavLink onClick={() => logOut()}
            className={({ isActive }) =>
              isActive
                ? `${styles["nav-link"]} ${styles.active}`
                : styles["nav-link"]
            }
          >
            Log Out
          </NavLink>
          </nav>
        )}
      
    </header>
      );
    }
    styles["nav-link"];

