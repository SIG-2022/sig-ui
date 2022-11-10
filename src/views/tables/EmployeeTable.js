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
    TableCell, TableBody, Chip, Table, Tooltip, tooltipClasses
} from "@material-ui/core";
import TableSortLabel from "@mui/material/TableSortLabel";
import {visuallyHidden} from "@mui/utils";
import CurrencyFormat from "react-currency-format";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import API from "../../api/api";
import Checkbox from '@mui/material/Checkbox';
import {useNavigate} from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import {styled} from "@material-ui/styles";

const EmployeeTable = (props) => {
    const [filter, setFilter] = useState(undefined);
    const [employeeType, setEmployeeType] = useState('PM');
    const [employees, setEmployees] = useState(undefined);
    const [jwt] = useLocalStorage("jwt", null);
    const [selectedEmployees, setSelectedEmployees] = useState(props.project?.devs ? props.project?.devs.concat(props.project?.underSelection) : [])
    const [selectedPM, setSelectedPM] = useState(props.project?.pm ? props.project?.pm : undefined)
    const [recommendedFilter, setRecommendedFilter] = useState(props.project?.features)

    const navigate = useNavigate();

    useEffect(() => {
        async function getPMs() {
            const headers = {
                Authorization: 'Bearer ' + jwt
            };
            const response = await API.get(
                `/project/pm?assigned=` + (props.assigned ? 'true' : 'false') ,
                {headers}
            );
            if (props.project?.pm) {
                response.data?.unshift(props.project.pm);
            }
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
            `/project/${type}?assigned=` + (props.assigned ? 'true' : 'false'),
            {headers}
        );
        if (props.project) {
            if (type === 'pm' && props.project.pm)
                response.data?.unshift(props.project.pm);
            if (type === 'dev' && props.project.devs)
                props.project.devs.forEach((dev) => response.data?.unshift(dev))
            if (type === 'under-selection' && props.project.underSelection)
                props.project.underSelection.forEach((sel) => response.data?.unshift(sel))
        }
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
        const orderSplit = orderBy.split('.')
        let aProp = a[orderBy];
        let bProp = b[orderBy];
        if (orderSplit.length > 1) {
            aProp = a[orderSplit[0]] ? a[orderSplit[0]][orderSplit[1]] : undefined;
            bProp = b[orderSplit[0]] ? b[orderSplit[0]][orderSplit[1]] : undefined;
            console.log(aProp)
            console.log(bProp)
        }
        if (bProp < aProp) {
            return -1;
        }
        if (bProp > aProp) {
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

    function filterProjectSearch(employee) {
        if (filter && employeeType === 'PM') {
            return employee.employee.name.includes(filter) ||
                employee.employee.id.includes(filter) ||
                employee.features.filter(feature => feature.includes(filter)).length > 0
        } else if (filter && employeeType !== 'PM') {
            return employee.employee.name.includes(filter) ||
                employee.employee.id.includes(filter) ||
                employee.technologies.filter(tech => tech.includes(filter)).length > 0
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
            id: 'alert',
            numeric: false,
            label: 'alert',
            visible: false
        },
        {
            id: 'id',
            numeric: false,
            label: 'id',
            visible: true
        },
        {
            id: 'employee.name',
            numeric: false,
            label: 'Nombre',
            visible: true
        },
        {
            id: 'employee.surname',
            numeric: false,
            label: 'Apellido',
            visible: true
        },
        {
            id: 'employee.salary',
            numeric: true,
            label: 'Salario',
            visible: true
        },
        {
            id: 'employee.availableDate',
            numeric: true,
            label: 'Fecha Disponible',
            visible: true
        },
        {
            id: 'employee.career',
            numeric: false,
            label: 'Carrera',
            visible: true
        },
    ];

    const name = employeeType === 'PM' ? 'Características' : 'Tecnologías';

    headCells.splice(5, 0, {
        id: 'features',
        numeric: false,
        label: name,
        visible: true
    })

    if (employeeType !== 'UNDER_SELECTION') {
        headCells.push({
            id: 'employee.seniority',
            numeric: true,
            label: 'Antiguedad',
            visible: true
        })
    }

    if (employeeType === 'PM') {
        headCells.splice(5, 0, {
            id: 'speciality',
            numeric: false,
            label: 'Especialidad',
            visible: true
        })
    }

    if (employeeType !== 'UNDER_SELECTION') {
        headCells.splice(4, 0, {
            id: 'project.name',
            numeric: false,
            label: 'Proyecto Actual',
            visible: true
        })
    }

    if (props.employeeSelection) {
        headCells.splice(0, 0, {
            id: 'checkbox',
            numeric: false,
            label: employeeType === 'PM' ? ((selectedPM ? '1' : '0') + '/' + '1') : ((selectedEmployees ? selectedEmployees.length : '0') + '/' + String(props.project.devAmount)),
            visible: true
        })
    }
    const pmVariant = employeeType === 'PM' ? 'contained' : undefined;
    const devVariant = employeeType === 'DEV' ? 'contained' : undefined;
    const underSelectionVariant = employeeType === 'UNDER_SELECTION' ? 'contained' : undefined;

    const handleCheckbox = async (e, employee) => {
        if (employeeType === 'PM') {
            if (e.target.checked) {
                setSelectedPM(employee)
            } else {
                setSelectedPM(undefined)
            }
        } else {
            if (e.target.checked) {
                await setSelectedEmployees(selectedEmployees.concat([employee]))
            } else {
                await setSelectedEmployees(selectedEmployees.filter(em => em.id !== employee.id))
            }
        }
    }

    const handleRecommendedEmployees = (e) => {
        if (e.target.checked) setRecommendedFilter(props.project.features);
        else setRecommendedFilter(undefined);
    }

    const occurrencesInFeatures = (e) => {
        if (!recommendedFilter) return 0;
        if (employeeType === 'PM') {
            return e.features?.filter(z => props.project.features.indexOf(z) !== -1).length;
        }
        return e.technologies?.filter(z => props.project.features.indexOf(z) !== -1).length;
    }

    function handleChange() {
        const body = {
            projectId: props.project.id,
            pmId: selectedPM ? selectedPM.id : undefined,
            devs: selectedEmployees ? selectedEmployees
                .filter((emp) => emp.employee.type === 'DEV')
                .map((emp) => emp.employeeId) : [],
            underSelection: selectedEmployees ? selectedEmployees
                .filter((emp) => emp.employee.type === 'UNDER_SELECTION')
                .map((emp) => emp.employeeId) : [],

        };
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        API.post(`/project/assign-team`, body, {headers})
            .then(res => {
                navigate('/projects', {replace: true})
            })
            .catch(err => {
                console.log('error', err)
            })
    }

    const CustomWidthTooltip = styled(({className, ...props}) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 200,
        },
    });

    return (
        <Box>
            <Card variant="outlined">
                <CardContent>
                    <Grid container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start">
                        <Grid item>
                            <Grid container
                                  direction="column"
                                  justifyContent="center"
                                  alignItems="flex-start">
                                <Grid item>
                                    <Typography variant="h3">Empleados</Typography>
                                </Grid>
                                {props.employeeSelection &&
                                <Grid container
                                      direction="row"
                                      justifyContent="center"
                                      alignItems="center">
                                    <Grid item>
                                        <Typography variant="h3" sx={{fontSize: 13}}>Recomendados para el
                                            proyecto</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Checkbox
                                            checked={recommendedFilter && true}
                                            onChange={handleRecommendedEmployees}/>
                                    </Grid>
                                </Grid>
                                }
                            </Grid>
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
                        <div style={{overflow: 'auto', height: '500px'}}>
                            <Table
                                aria-label="simple table"
                                sx={{
                                    mt: 3,
                                    whiteSpace: "nowrap",
                                }}
                                stickyHeader
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
                                    {employees &&
                                    stableSort(employees, getComparator(order, orderBy))
                                        .filter(filterProjectSearch)
                                        .sort(function (emp1, emp2) {
                                            return occurrencesInFeatures(emp2) - occurrencesInFeatures(emp1);
                                        })
                                        .map((employee) => (
                                            <TableRow
                                                key={employee.id}
                                            >
                                                {props.employeeSelection &&
                                                <TableCell>
                                                    <Checkbox
                                                        checked={employeeType === 'PM' ? (selectedPM?.id === employee.id) : selectedEmployees.filter(e => e.id === employee.id).length > 0}
                                                        disabled={employeeType === 'PM' ? (selectedPM && selectedPM?.id !== employee.id) : selectedEmployees.length === props.project.devAmount && !selectedEmployees.filter(e => e.id === employee.id).length > 0}
                                                        onChange={(e) => handleCheckbox(e, employee)}/>
                                                </TableCell>}
                                                <TableCell>
                                                    {(new Date(employee.employee.availableDate) > new Date()) &&
                                                    <CustomWidthTooltip
                                                        title={'Empleado no disponible hasta el ' + new Date(employee.employee.availableDate).toLocaleDateString()}>
                                                        <InfoIcon
                                                            sx={{
                                                                fontSize: '25px',
                                                                color: '#f57d1a',
                                                            }}/>
                                                    </CustomWidthTooltip>
                                                    }
                                                </TableCell>
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
                                                        </Box>
                                                    </Box>
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
                                                                {employee.employee.surname}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                { (employeeType === 'DEV' || employeeType === 'PM') && <TableCell>
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
                                                {employee.project ? employee.project.name : 'Ninguno'}
                                                    </Typography>
                                                    </Box>
                                                    </Box>
                                                    </TableCell>}
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
                                                    <Typography color="textSecondary" variant="h6">
                                                        {employee.speciality}
                                                    </Typography>
                                                </TableCell>}
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
                                                {(employeeType === 'DEV' || employeeType === 'UNDER_SELECTION') && <TableCell>
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
                                                        {new Date(employee.employee.availableDate).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography color="textSecondary" variant="h6">
                                                        {employee.employee.career}
                                                    </Typography>
                                                </TableCell>
                                                {employeeType !== 'UNDER_SELECTION' &&
                                                <TableCell align="right">
                                                    <Typography color="textSecondary" variant="h6">
                                                        {employee.employee.seniority}
                                                    </Typography>
                                                </TableCell>
                                                }
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                        {props.project &&
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleChange}
                                disabled={selectedEmployees.length === 0 && !selectedPM}
                                style={{marginTop: 20}}
                            >
                                Asignar Equipo
                            </Button>
                        }
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EmployeeTable;