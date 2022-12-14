import {lazy} from "react";
import {ProtectedRoute} from "./ProtectedRoute";
import {Navigate} from "react-router-dom";


const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
const Login = lazy(() => import("../views/login/Login.js"));
const Register = lazy(() => import("../views/register/Register"));
const LoadData = lazy(() => import("../views/load-data/LoadData.js"));

const Dashboard = lazy(() => import("../views/dashboards/Dashboard"));

const ProjectTable = lazy(() => import("../views/tables/BasicTable"));
const AdminTable = lazy(() => import("../views/tables/AdminTable"));
const EmployeeTable = lazy(() => import("../views/tables/EmployeeTable"));

const CreateProject = lazy(() => import("../views/FormLayouts/FormLayouts"));
const CreateClient = lazy(() => import("../views/FormLayouts/CreateClientLayout"));
const ProjectInfo = lazy(() => import("../views/FormLayouts/ProjectInfo"));


const ThemeRoutes = [
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/",
        element: <ProtectedRoute><FullLayout/></ProtectedRoute>,
        children: [
            {path: "/", element: <Navigate to="/dashboard"/>},
            {path: "/dashboard", exact: true, element: <Dashboard/>},
            {path: "/projects", element: <ProjectTable/>},
            {path: "/users", element: <AdminTable/>},
            {path: "/project", element: <ProjectInfo/>},
            {path: "/load-data", element: <LoadData/>},
            {path: "/employees", element: <EmployeeTable assigned={false}/>},
            {path: "/create-project", element: <CreateProject  style={{boxSizing:'unset'}}/>},
            {path: "/create-client", element: <CreateClient/>},
        ],
    },
];

export default ThemeRoutes;
