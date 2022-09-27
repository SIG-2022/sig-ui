import {
  DashboardOutlined,
  AddToPhotosOutlined,
  AspectRatioOutlined,
  AssignmentTurnedInOutlined,
  AlbumOutlined,
  SwitchCameraOutlined,
  SwitchLeftOutlined,
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
    title: "Autocomplete",
    icon: AddToPhotosOutlined,
    href: "/form-elements/autocomplete",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Buttons",
    icon: AspectRatioOutlined,
    href: "/form-elements/button",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Checkbox",
    icon: AssignmentTurnedInOutlined,
    href: "/form-elements/checkbox",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Radio",
    icon: AlbumOutlined,
    href: "/form-elements/radio",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Slider",
    icon: SwitchCameraOutlined,
    href: "/form-elements/slider",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Switch",
    icon: SwitchLeftOutlined,
    href: "/form-elements/switch",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Crear Proyecto",
    icon: DescriptionOutlined,
    href: "/create-project",
    roles: ['USER', 'ADMIN'],
  },
  {
    title: "Proyectos",
    icon: AutoAwesomeMosaicOutlined,
    href: "/projects",
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
