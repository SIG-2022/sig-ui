import React, {useEffect, useState} from "react";

import {
    Card,
    CardContent,
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    TableHead,
    TableRow,
    TableCell, TableBody, Chip, Table
} from "@material-ui/core";
import TableSortLabel from "@mui/material/TableSortLabel";
import {visuallyHidden} from "@mui/utils";
import CurrencyFormat from "react-currency-format";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import API from "../../api/api";

const EmployeeTable = () => {
    const [filter, setFilter] = useState(undefined);
    const [employeeType, setEmployeeType] = useState('PM');
    const [employees, setEmployees] = useState(undefined);
    const [jwt] = useLocalStorage("jwt", null);

    useEffect(() => {
        async function getPMs() {
            const headers = {
                Authorization: 'Bearer ' + jwt
            };
            const response = await API.get(
                `/project/pm`,
                {headers}
            );
            await setEmployees(response.data);
        }

        if (!employees) {
            getPMs();
        }
    }, [employees, jwt])

    async function fetchEmployees(type) {
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        const response = await API.get(
            `/project/${type}`,
            {headers}
        );
        await setEmployees(response.data);
    }

    function handleFilterChange(ev) {
        setFilter(ev.target.value)
    }

    async function handlePMFilter() {
        await fetchEmployees('pm')
        await setEmployeeType('PM')
    }

    async function handleDevFilter() {
        await fetchEmployees('dev')
        await setEmployeeType('DEV')
    }

    async function handleSelectionFilter() {
        await fetchEmployees('under-selection')
        await setEmployeeType('UNDER_SELECTION')
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
        if (filter) {
            return project.name.includes(filter) || project.client.includes(filter);
        }
        return true;
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
            id: 'id',
            numeric: false,
            label: 'id',
            visible: true
        },
        {
            id: 'name',
            numeric: false,
            label: 'Nombre',
            visible: true
        },
        {
            id: 'salary',
            numeric: true,
            label: 'Salario',
            visible: true
        },
        {
            id: 'available_date',
            numeric: true,
            label: 'Fecha Disponible',
            visible: true
        },
    ];

    const name = employeeType === 'PM' ? 'Características' : 'Tecnologías';

    if (employeeType !== 'UNDER_SELECTION') {
        headCells.splice(3, 0 , {
            id: 'features',
                numeric: false,
                label: name,
                visible: true
        })
    }
    const pmVariant = employeeType === 'PM' ? 'contained': undefined;
    const devVariant = employeeType === 'DEV' ? 'contained': undefined;
    const underSelectionVariant = employeeType === 'UNDER_SELECTION' ? 'contained': undefined;

    return (
        <Box>
            <Card variant="outlined">
                <CardContent>
                    <Grid container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start">
                        <Grid item>
                            <Typography variant="h3">Empleados</Typography>
                        </Grid>
                        <Grid item>
                            <Grid container
                                  direction="row"
                                  justifyContent="flex-end"
                                  alignItems="center"
                            >
                                <Grid item
                                      sx={{mr: 2, ml: 2}}
                                >
                                    <Button
                                        variant={pmVariant}
                                        onClick={handlePMFilter}>
                                        PM
                                    </Button>
                                </Grid>
                                <Grid item
                                      sx={{mr: 2, ml: 2}}
                                >
                                    <Button
                                        variant={devVariant}
                                        onClick={handleDevFilter}>
                                        Dev
                                    </Button>
                                </Grid>
                                <Grid item
                                      sx={{mr: 2, ml: 2}}
                                >
                                    <Button
                                        variant={underSelectionVariant}
                                        onClick={handleSelectionFilter}>
                                        En Selección
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="project-filter"
                                        label="Filtrar Empleados"
                                        value={filter}
                                        onChange={handleFilterChange}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            overflow: {
                                xs: "auto",
                                sm: "unset",
                            },
                        }}
                    >
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
                                {employees && stableSort(employees, getComparator(order, orderBy))
                                    // .filter(filterProjectSearch)
                                    // .filter(filterProjectState)
                                    .map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                        >
                                            <TableCell>
                                                <Typography color="textSecondary" variant="h6">
                                                    {employee.employee.id}
                                                </Typography>
                                            </TableCell>
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
                                                            {employee.employee.name}
                                                        </Typography>
                                                        <Typography
                                                            color="textSecondary"
                                                            sx={{
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            {employee.post}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h6">
                                                    <CurrencyFormat
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        displayType={'text'}
                                                        value={employee.employee.salary}
                                                    />
                                                </Typography>
                                            </TableCell>
                                            {employeeType === 'PM' && <TableCell>
                                                <Grid container spacing={2} marginTop={'2px'}>
                                                    {employee.features && employee.features.map((feature) => (
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
                                            </TableCell>}
                                            {employeeType === 'DEV' && <TableCell>
                                                <Grid container spacing={2} marginTop={'2px'}>
                                                    {employee.technologies && employee.technologies.map((feature) => (
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
                                            </TableCell>}
                                            <TableCell align="right">
                                                <Typography color="textSecondary" variant="h6">
                                                    {new Date(employee.employee.availableDate).toISOString()}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EmployeeTable;