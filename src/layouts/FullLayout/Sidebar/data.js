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
  },
  {
    title: "Autocomplete",
    icon: AddToPhotosOutlined,
    href: "/form-elements/autocomplete",
  },
  {
    title: "Buttons",
    icon: AspectRatioOutlined,
    href: "/form-elements/button",
  },
  {
    title: "Checkbox",
    icon: AssignmentTurnedInOutlined,
    href: "/form-elements/checkbox",
  },
  {
    title: "Radio",
    icon: AlbumOutlined,
    href: "/form-elements/radio",
  },
  {
    title: "Slider",
    icon: SwitchCameraOutlined,
    href: "/form-elements/slider",
  },
  {
    title: "Switch",
    icon: SwitchLeftOutlined,
    href: "/form-elements/switch",
  },
  {
    title: "Crear Proyecto",
    icon: DescriptionOutlined,
    href: "/create-project",
  },
  {
    title: "Proyectos",
    icon: AutoAwesomeMosaicOutlined,
    href: "/projects",
  },
];

export default Menuitems;
