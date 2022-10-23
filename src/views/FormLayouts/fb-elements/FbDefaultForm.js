import React, {useEffect, useState} from "react";

import {
    Card,
    CardContent,
    Divider,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Autocomplete,
} from "@material-ui/core";
import API from "../../../api/api";
import {useLocalStorage} from "../../../hooks/useLocalStorage";
import TagsInput from "../../../components/Forms/Tags/TagsInput";
import CurrencyFormat from 'react-currency-format';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

function FbDefaultForm(props) {
    const [jwt] = useLocalStorage("jwt", null);
    const [clients, setClients] = useState(undefined);
    const [name, setName] = useState(props.state?.name);
    const [selectedClient, setSelectedClient] = useState(props.state?.client ? {
        label: props.state?.client,
        value: props.state?.clientId
    } : undefined);
    const [industry, setIndustry] = useState(props.state?.industry);
    const [studio, setStudio] = useState(props.state?.studio);
    const [features, setFeatures] = useState(props.state?.features);
    const [employeeCount, setEmployeeCount] = useState(props.state?.devAmount)
    const [budget, setBudget] = useState(props.state?.maxBudget);
    const [startDate, setStartDate] = useState(props.state?.startDate ? props.state?.startDate : dayjs());
    const [endDate, setEndDate] = useState(props.state?.endDate ? props.state?.endDate : dayjs());
    const [requirements, setRequirements] = useState(props.state?.requirement);

    useEffect(() => {
        async function getClients() {
            const headers = {
                Authorization: 'Bearer ' + jwt
            };
            const response = await API.get(
                `/project/clients`,
                {headers}
            );
            parseClients(response.data);
        }

        if (!clients) {
            getClients();
        }
    }, [clients, jwt])

    function parseClients(cl) {
        const renderClients = cl.map(client => (
            {label: client.name, value: client.id}
        ));
        setClients(renderClients);
    }

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleSelectedClientChange(event, value) {
        if (value) {
            const client = {
                value: value.value ? value.value : undefined,
                label: value.value ? value.label : value,
            }
            setSelectedClient(client);
        } else
            setSelectedClient(undefined);
    }

    function handleClientBlur(e) {
        if (!clients.some(cl => cl.label === e.target.value)) {
            console.log('blur ', e.target.value)
            handleSelectedClientChange(undefined, e.target.value)
        }
    }

    function handleIndustryChange(e) {
        setIndustry(e.target.value);
    }

    function handleStudioChange(e) {
        setStudio(e.target.value);
    }

    function handleRequirementsChange(e) {
        setRequirements(e.target.value);
    }

    function handleFeaturesChange(features) {
        setFeatures(features);
    }

    function handleEmployeeCountChange(e) {
        setEmployeeCount(e.target.value);
        const val = e.target.value < 0
            ? (e.target.value = 0)
            : e.target.value;
        setEmployeeCount(val);
        return val;

    }

    function handleBudgetChange(val) {
        setBudget(val.floatValue)
    }

    function handleStartDateChange(e) {
        if (e > endDate)
            setEndDate(e)
        setStartDate(e)
    }

    function handleEndDateChange(e) {
        setEndDate(e)
    }


    async function handleChange() {
        const body = {
            name: name,
            industry: industry,
            studio: studio,
            features: features,
            client: selectedClient,
            devAmount: parseInt(employeeCount),
            maxBudget: budget,
            startDate: startDate,
            endDate: endDate,
            requirement: requirements,
        };
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        props.handleFormSubmit(body, headers);

    }


    return (
        <div>
            <Card
                variant="outlined"
                sx={{
                    p: 0,
                }}
            >
                <Box
                    sx={{
                        padding: "15px 30px",
                    }}
                    display="flex"
                    alignItems="center"
                >
                    <Box flexGrow={1}>
                        <Typography
                            sx={{
                                fontSize: "18px",
                                fontWeight: "500",
                            }}
                        >
                            {props.formMsg || 'Crear Proyecto'}
                        </Typography>
                    </Box>
                </Box>
                <Divider/>
                <CardContent
                    sx={{
                        padding: "30px",
                    }}
                >
                    <form>
                        <TextField
                            id="project-name"
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            sx={{
                                mb: 2,
                            }}
                            value={name}
                            onChange={handleNameChange}
                            required
                        />
                        <Autocomplete
                            disablePortal
                            id="project-clients"
                            options={clients ? clients : []}
                            sx={{mb: 2}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cliente"
                                    required={true}
                                />
                            )}
                            freeSolo
                            value={selectedClient}
                            onChange={handleSelectedClientChange}
                            onBlur={handleClientBlur}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="project-industry"
                                    label="Industria"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={handleIndustryChange}
                                    value={industry}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="project-studio"
                                    label="Studio"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={handleStudioChange}
                                    value={studio}
                                />
                            </Grid>
                        </Grid>
                        <Grid item mt={2} mb={2}>
                            <TagsInput
                                selectedTags={(tags) => handleFeaturesChange(tags)}
                                tags={features || []}
                                fullWidth
                                variant="outlined"
                                id="project-features"
                                name="features"
                                placeholder="Agregar Caracteristicas..."
                                label="Caracteristicas"
                            />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="project-employee-count"
                                    label="Cantidad de Empleados"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        mb: 2,
                                    }}
                                    type={"number"}
                                    value={employeeCount}
                                    onChange={handleEmployeeCountChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CurrencyFormat
                                    id="project-budget"
                                    label="Limite de Presupuesto"
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    customInput={TextField}
                                    fullWidth
                                    sx={{
                                        mb: 2,
                                    }}
                                    required
                                    value={budget}
                                    onValueChange={handleBudgetChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} style={{marginBottom:16}}>
                            <TextField
                                style={{textAlign: 'left'}}
                                label="Requerimientos"
                                multiline
                                required
                                value={requirements}
                                onChange={handleRequirementsChange}
                                rows={3}
                                fullWidth
                            />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6} style={{marginBottom:16}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        label="Fecha Inicio"
                                        minDate={props.minDate ? dayjs() : dayjs().subtract(1, 'year')}
                                        inputFormat="DD/MM/YYYY"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        renderInput={(params) => <TextField {...params} fullWidth required/>}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6} style={{marginBottom:16}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        label="Fecha Finalización"
                                        inputFormat="DD/MM/YYYY"
                                        minDate={startDate}
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        renderInput={(params) => <TextField {...params} fullWidth required/>}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <div>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleChange}
                                disabled={!name || !selectedClient || !industry || !studio || features.length === 0 || !employeeCount || !budget || !startDate || !endDate || !requirements}>
                                {props.buttonMsg || 'Crear Proyecto'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default FbDefaultForm;
