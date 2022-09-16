import React, {useEffect, useState} from "react";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip, Grid,
} from "@material-ui/core";
import {visuallyHidden} from '@mui/utils';
import TableSortLabel from '@mui/material/TableSortLabel';
import API from "../../../api/api";
import {useLocalStorage} from "../../../hooks/useLocalStorage";
import CurrencyFormat from "react-currency-format";
import {useNavigate} from "react-router-dom";

const ProjectTable = () => {
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
            id: 'name',
            numeric: false,
            label: 'Nombre',
        },
        {
            id: 'client',
            numeric: false,
            label: 'Cliente',
        },
        {
            id: 'industry',
            numeric: false,
            label: 'Industria',
        },
        {
            id: 'studio',
            numeric: false,
            label: 'Studio',
        },
        {
            id: 'features',
            numeric: false,
            label: 'Caracteristicas',
        },
        {
            id: 'maxBudget',
            numeric: true,
            label: 'Presupuesto',
        },
        {
            id: 'devAmount',
            numeric: true,
            label: 'Tamaño Equipo',
        },
        {
            id: 'endDate',
            numeric: true,
            label: 'Fecha Finalización',
        },
    ];

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
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {projects && stableSort(projects, getComparator(order, orderBy)).map((project) => (
                    <TableRow
                        key={project.id}
                        onClick={() => navigate('/project', {state: project, replace: true})}
                        style={{cursor: 'pointer'}}
                    >
                        <TableCell>
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
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                {project.client}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                {project.industry}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                {project.studio}
                            </Typography>
                        </TableCell>
                        <TableCell>
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
                        <TableCell align="right">
                            <Typography variant="h6">
                                <CurrencyFormat
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    displayType={'text'}
                                    value={project.maxBudget}
                                />
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography color="textSecondary" variant="h6">
                                {project.devAmount}
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography color="textSecondary" variant="h6">
                                {new Date(project.endDate).toISOString()}
                            </Typography>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ProjectTable;
