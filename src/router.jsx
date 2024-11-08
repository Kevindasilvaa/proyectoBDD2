import { createBrowserRouter } from 'react-router-dom';
import MeGusta from './pages/MeGusta';
import Root from "./layout/Roots.jsx";
import Ingresar from './pages/Ingresar.jsx';
import { routes } from "./constants/routes";
import Registrar from "./pages/Registrar.jsx";
import Biblioteca from './pages/Biblioteca.jsx';
import Recomendaciones from './pages/Recomendaciones.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: routes[0].path,
        element: <Ingresar />,
      },
      {
        path: routes[1].path,
        element: <Registrar />,
      },
      {
        path: routes[2].path,
        element: <MeGusta />,
      },
      {
        path: routes[3].path,
        element: <Biblioteca />,
      },
      {
        path: routes[4].path,
        element: <Recomendaciones />,
      },
      

    ],
  },
]);