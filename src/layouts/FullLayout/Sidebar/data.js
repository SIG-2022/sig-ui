import {
  DashboardOutlined,
  DescriptionOutlined,
  AutoAwesomeMosaicOutlined,
} from "@material-ui/icons/";

const Menuitems = [
  {
    title: "Dashboard",
    icon: DashboardOutlined,
    href: "/dashboard",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Proyectos",
    icon: AutoAwesomeMosaicOutlined,
    href: "/projects",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Crear Proyecto",
    icon: DescriptionOutlined,
    href: "/create-project",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Crear Cliente",
    icon: DescriptionOutlined,
    href: "/create-client",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Empleados",
    icon: AutoAwesomeMosaicOutlined,
    href: "/employees",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Cargar Datos",
    icon: AutoAwesomeMosaicOutlined,
    href: "/load-data",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Usuarios",
    icon: AutoAwesomeMosaicOutlined,
    href: "/users",
    roles: ['ADMIN'],
  },
];

export default Menuitems;
