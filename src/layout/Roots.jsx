import { Outlet } from "react-router-dom";

import  NavBar  from '../components/NavBar.jsx';

export default function Root() {
  return (
    <div>
        <NavBar/>
        <Outlet/>
    </div>
  );
}
