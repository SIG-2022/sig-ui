import {lazy} from "react";
import {ProtectedRoute} from "./ProtectedRoute";
import {Navigate} from "react-router-dom";


/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
const Login = lazy(() => import("../views/login/Login.js"));
/****End Layouts*****/

/*****Pages******/
const Dashboard1 = lazy(() => import("../views/dashboards/Dashboard1"));

/*****Tables******/
const ProjectTable = lazy(() => import("../views/tables/BasicTable"));

// form elements
const ExAutoComplete = lazy(() =>
    import("../views/FormElements/ExAutoComplete")
);
const ExButton = lazy(() => import("../views/FormElements/ExButton"));
const ExCheckbox = lazy(() => import("../views/FormElements/ExCheckbox"));
const ExRadio = lazy(() => import("../views/FormElements/ExRadio"));
const ExSlider = lazy(() => import("../views/FormElements/ExSlider"));
const ExSwitch = lazy(() => import("../views/FormElements/ExSwitch"));

// form layouts
const CreateProject = lazy(() => import("../views/FormLayouts/FormLayouts"));
const ProjectInfo = lazy(() => import("../views/FormLayouts/ProjectInfo"));

/*****Routes******/

const ThemeRoutes = [
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/",
        element: <ProtectedRoute><FullLayout/></ProtectedRoute>,
        children: [
            {path: "/", element: <Navigate to="/dashboard"/>},
            {path: "/dashboard", exact: true, element: <Dashboard1/>},
            {path: "/projects", element: <ProjectTable/>},
            {path: "/project", element: <ProjectInfo/>},
            {path: "/create-project", element: <CreateProject/>},
            {path: "/form-elements/autocomplete", element: <ExAutoComplete/>},
            {path: "/form-elements/button", element: <ExButton/>},
            {path: "/form-elements/checkbox", element: <ExCheckbox/>},
            {path: "/form-elements/radio", element: <ExRadio/>},
            {path: "/form-elements/slider", element: <ExSlider/>},
            {path: "/form-elements/switch", element: <ExSwitch/>},
        ],
    },
];

export default ThemeRoutes;
