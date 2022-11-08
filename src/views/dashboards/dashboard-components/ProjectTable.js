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
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
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
            id: 'startDate',
            numeric: true,
            label: 'Fecha Inicio',
            visible: true
        }, {
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
        }
    ];
    const shouldDisplaySend = !props.stateFilter || props.stateFilter === 'TEAM_ASSIGNED' || props.stateFilter === 'REJECTED_BY_CLIENT'
    if (shouldDisplaySend) {
        headCells.push(
            {
                id: 'empty3',
                numeric: false,
                label: '',
                visible: false
            }
        );
    }
    const shouldDisplayClientReject = !props.stateFilter || props.stateFilter === 'SENT_TO_CLIENT'
    if (shouldDisplayClientReject) {
        headCells.push(
            {
                id: 'empty4',
                numeric: false,
                label: '',
                visible: false
            }
        );
    }

    const shouldDisplayClientAccept = !props.stateFilter || props.stateFilter === 'SENT_TO_CLIENT'
    if (shouldDisplayClientAccept) {
        headCells.push(
            {
                id: 'empty5',
                numeric: false,
                label: '',
                visible: false
            }
        );
    }

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

    async function handleProjectChange(project, url) {
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        const res = await API.post('/project/' + url + '/' + project.id,
            undefined, {headers}
        );

        setProjects(projects.map(proj => {
            if (proj.id === project.id) {
                return {...proj, state: res.data.state};
            }

            return proj;
        }));
    }

    const CustomWidthTooltip = styled(({className, ...props}) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 200,
        },
    });

    function getProjectIcon(project) {
        if (project.delay?.delay){
            return <CustomWidthTooltip title={'Selección atrasada. Fecha disponible: ' + new Date(project.delay.day).toLocaleDateString()}>
                <PeopleAltIcon
                    sx={{
                        fontSize: '25px',
                        color: '#f5301a',
                    }}/>
            </CustomWidthTooltip>;
        }
        if (project.state !== 'STARTED') {
            switch (project.state) {
                case 'TEAM_ASSIGNMENT':
                    return <CustomWidthTooltip title='Equipo no asignado'>
                        <PeopleAltIcon
                            sx={{
                                fontSize: '25px',
                                color: '#f57d1a',
                            }}/>
                    </CustomWidthTooltip>;
                case 'TEAM_ASSIGNED':
                    return <CustomWidthTooltip title='Equipo asignado'>
                        <PeopleAltIcon
                            sx={{
                                fontSize: '25px',
                                color: 'rgba(74,182,92,0.93)',
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

                case 'SENT_TO_CLIENT':
                    return <CustomWidthTooltip
                        title='Presupuesto enviado al cliente'>
                        <SendIcon
                            sx={{
                                fontSize: '25px',
                                color: '#58aeec',
                            }}/>
                    </CustomWidthTooltip>;
                case 'REJECTED_BY_CLIENT':
                    return <CustomWidthTooltip
                        title='Presupuesto rechazado por el cliente'>
                        <CancelScheduleSendIcon
                            sx={{
                                fontSize: '25px',
                                color: '#f57d1a',
                            }}/>
                    </CustomWidthTooltip>;

                default:
                    return <CustomWidthTooltip title='Proyecto cancelado'>
                        <CancelRoundedIcon
                            sx={{
                                fontSize: '25px',
                                color: '#f5301a',
                            }}/>
                    </CustomWidthTooltip>;
            }
        }
    }

    function handleRowClick(project) {
        const editableStates = ['TEAM_ASSIGNED', 'TEAM_ASSIGNMENT', 'SENT_TO_CLIENT', 'REJECTED_BY_CLIENT']
        if (editableStates.includes(project.state))
            return navigate('/project', {state: project, replace: true});
    }

    function handleRowCursor(project) {
        const editableStates = ['TEAM_ASSIGNED', 'TEAM_ASSIGNMENT', 'SENT_TO_CLIENT', 'REJECTED_BY_CLIENT']
        if (editableStates.includes(project.state))
            return {cursor: 'pointer'};
        return {};
    }

    return (
        <Table
            aria-label="simple table"
            sx={{
                mt: 3,
                whiteSpace: "nowrap",
            }}
            stickyHeader
            style={{whiteSpace: 'break-spaces'}}
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
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
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
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
                            >
                                <Typography color="textSecondary" variant="h6">
                                    {project.client}
                                </Typography>
                            </TableCell>
                            <TableCell
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
                            >
                                <Typography color="textSecondary" variant="h6">
                                    {project.industry}
                                </Typography>
                            </TableCell>
                            <TableCell
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
                            >
                                <Typography color="textSecondary" variant="h6">
                                    {project.studio}
                                </Typography>
                            </TableCell>
                            <TableCell
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
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
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
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
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
                            >
                                <Typography color="textSecondary" variant="h6">
                                    {project.devAmount}
                                </Typography>
                            </TableCell>
                            <TableCell
                                align="right"
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
                            >
                                <Typography color="textSecondary" variant="h6">
                                    {new Date(project.startDate).toLocaleDateString()}
                                </Typography>
                            </TableCell>
                            <TableCell
                                align="right"
                                onClick={() => handleRowClick(project)}
                                style={handleRowCursor(project)}
                            >
                                <Typography color="textSecondary" variant="h6">
                                    {new Date(project.endDate).toLocaleDateString()}
                                </Typography>
                            </TableCell>
                            {shouldDisplaySend &&
                                <TableCell>
                                    {(project.state === 'TEAM_ASSIGNED' || project.state === 'REJECTED_BY_CLIENT') &&
                                    <CustomWidthTooltip title={project.delay?.delay ? 'Resolver asignación de equipo antes de enviar' : 'Enviar presupuesto'}>
                                        <SendIcon
                                            sx={{
                                                color: project.delay?.delay ? '#B8BABEFF' : '#58aeec',
                                            }}
                                            style={{cursor: 'pointer'}}
                                            onClick={() => project.delay?.delay ? undefined : handleProjectChange(project, 'send')}
                                        />
                                    </CustomWidthTooltip>
                                    }
                                </TableCell>
                            }
                            {shouldDisplayClientReject &&
                            <TableCell>
                                {project.state === 'SENT_TO_CLIENT' &&
                                <CustomWidthTooltip title='Presupuesto rechazado'>
                                    <CancelScheduleSendIcon
                                        sx={{
                                            color: '#f57d1a',
                                        }}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => handleProjectChange(project, 'reject')}
                                    />
                                </CustomWidthTooltip>
                                }
                            </TableCell>
                            }
                            {shouldDisplayClientAccept &&
                            <TableCell>
                                {project.state === 'SENT_TO_CLIENT' &&
                                <CustomWidthTooltip title='Presupuesto aceptado'>
                                    <DoneOutlineIcon
                                        sx={{
                                            color: 'rgba(74,182,92,0.93)',
                                        }}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => handleProjectChange(project, 'accept')}
                                    />
                                </CustomWidthTooltip>
                                }
                            </TableCell>
                            }
                            <TableCell>
                                {project.state !== 'CANCELLED' &&
                                <CustomWidthTooltip title='Cancelar Proyecto'>
                                    <CloseIcon
                                        sx={{
                                            color: '#f5301a',
                                        }}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => handleProjectDelete(project)}
                                    />
                                </CustomWidthTooltip>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
};

export default ProjectTable;
