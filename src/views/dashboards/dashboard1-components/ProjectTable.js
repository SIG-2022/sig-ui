import React, {useEffect, useState} from "react";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip, Grid, Tooltip, tooltipClasses,
} from "@material-ui/core";
import {visuallyHidden} from '@mui/utils';
import TableSortLabel from '@mui/material/TableSortLabel';
import API from "../../../api/api";
import {useLocalStorage} from "../../../hooks/useLocalStorage";
import CurrencyFormat from "react-currency-format";
import {useNavigate} from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import {styled} from "@material-ui/styles";

const ProjectTable = (props) => {
    const [projects, setProjects] = useState(undefined);
    const [jwt] = useLocalStorage("jwt", null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getProjects() {
            const headers = {
                Authorization: 'Bearer ' + jwt
            };
            const response = await API.get(
                `/project`,
                {headers}
            );
            parseProjects(response.data);
        }

        if (!projects) {
            getProjects();
        }
    }, [projects, jwt])

    const parseProjects = (data) => {
        console.log(data)
        setProjects(data.map((project) => ({
            ...project,
            client: project.client.name
        })))
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index])
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function filterProjectSearch(project) {
        if (props.filter) {
            return project.name.includes(props.filter) || project.client.includes(props.filter);
        }
        return true;
    }

    function filterProjectState(project) {
        if (props.stateFilter) {
            return project.state === props.stateFilter;
        }
        return project.state !== 'CANCELLED';
    }

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler =
        (property) => (event) => {
            handleRequestSort(event, property);
        };

    const headCells = [
        {
            id: 'empty',
            numeric: false,
            label: '',
            visible: false
        },
        {
            id: 'name',
            numeric: false,
            label: 'Nombre',
            visible: true
        },
        {
            id: 'client',
            numeric: false,
            label: 'Cliente',
            visible: true
        },
        {
            id: 'industry',
            numeric: false,
            label: 'Industria',
            visible: true
        },
        {
            id: 'studio',
            numeric: false,
            label: 'Studio',
            visible: true
        },
        {
            id: 'features',
            numeric: false,
            label: 'Caracteristicas',
            visible: true
        },
        {
            id: 'maxBudget',
            numeric: true,
            label: 'Presupuesto',
            visible: true
        },
        {
            id: 'devAmount',
            numeric: true,
            label: 'Tamaño Equipo',
            visible: true
        },
        {
            id: 'endDate',
            numeric: true,
            label: 'Fecha Finalización',
            visible: true
        },
        {
            id: 'empty2',
            numeric: false,
            label: '',
            visible: false
        },
    ];

    function handleProjectDelete(project) {
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        API.delete(
          `/project/${project.id}`,
          {headers}
        );
        setProjects(projects.map(proj => {
            if (proj.id === project.id) {
                return {...proj, state: 'CANCELLED'};
            }

            return proj;
        }));
    }

    const CustomWidthTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 200,
        },
    });

    function getProjectIcon(project) {
        if (project.state !== 'STARTED'){
            switch (project.state) {
                case 'TEAM_ASSIGNMENT':
                    return <CustomWidthTooltip title='Equipo no asignado'>
                        <PeopleAltIcon
                            sx={{
                                fontSize: '25px',
                                color: '#58aeec',
                            }}/>
                    </CustomWidthTooltip>;

                case 'ACCEPTED':
                    return <CustomWidthTooltip title='Proyecto aceptado por el cliente'>
                    <CheckCircleIcon
                        sx={{
                            fontSize: '25px',
                            color: 'rgba(74,182,92,0.93)',
                        }}/>
                    </CustomWidthTooltip>;

                case 'DELAYED':
                    return <CustomWidthTooltip title='Proyecto atrasado, algún miembro del equipo no se encuentra disponible'>
                    <InfoIcon
                        sx={{
                            fontSize: '25px',
                            color: '#e5503f',
                        }}/>
                    </CustomWidthTooltip>;

                default:
                    return '';
            }
        }
    }

    return (
        <Table
            aria-label="simple table"
            sx={{
                mt: 3,
                whiteSpace: "nowrap",
            }}
        >
            <TableHead>
                <TableRow key={'header'}>
                    {headCells.map((header) => (
                        <TableCell
                            align={header.numeric ? 'right' : 'left'}
                            sortDirection={orderBy === header.id ? order : false}
                        >
                            {header.visible &&
                            <TableSortLabel
                                active={orderBy === header.id}
                                direction={orderBy === header.id ? order : 'asc'}
                                onClick={createSortHandler(header.id)}
                            >
                                <Typography color="textSecondary" variant="h6">
                                    {header.label}
                                </Typography>
                                {orderBy === header.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {projects && stableSort(projects, getComparator(order, orderBy))
                    .filter(filterProjectSearch)
                    .filter(filterProjectState)
                    .map((project) => (
                    <TableRow
                        key={project.id}
                    >
                        <TableCell>
                            {getProjectIcon(project)}
                        </TableCell>
                        <TableCell
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "600",
                                        }}
                                    >
                                        {project.name}
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        sx={{
                                            fontSize: "13px",
                                        }}
                                    >
                                        {project.post}
                                    </Typography>
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Typography color="textSecondary" variant="h6">
                                {project.client}
                            </Typography>
                        </TableCell>
                        <TableCell
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Typography color="textSecondary" variant="h6">
                                {project.industry}
                            </Typography>
                        </TableCell>
                        <TableCell
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Typography color="textSecondary" variant="h6">
                                {project.studio}
                            </Typography>
                        </TableCell>
                        <TableCell
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Grid container spacing={2} marginTop={'2px'}>
                                {project.features && project.features.map((feature) => (
                                    <Chip
                                        sx={{
                                            pl: "4px",
                                            pr: "4px",
                                            backgroundColor: (theme) =>
                                                `${theme.palette.primary.main}!important`,
                                            color: "#fff",
                                            marginBottom: "4px",
                                        }}
                                        size="small"
                                        label={feature}
                                    ></Chip>
                                ))}
                            </Grid>
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Typography variant="h6">
                                <CurrencyFormat
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    displayType={'text'}
                                    value={project.maxBudget}
                                />
                            </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Typography color="textSecondary" variant="h6">
                                {project.devAmount}
                            </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => navigate('/project', {state: project, replace: true})}
                          style={{cursor: 'pointer'}}
                        >
                            <Typography color="textSecondary" variant="h6">
                                {new Date(project.endDate).toISOString()}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {project.state !== 'CANCELLED' &&
                            <CloseIcon
                                sx={{
                                    color: '#f5301a',
                                }}
                                style={{cursor: 'pointer'}}
                                onClick={() => handleProjectDelete(project)}
                            />
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ProjectTable;
