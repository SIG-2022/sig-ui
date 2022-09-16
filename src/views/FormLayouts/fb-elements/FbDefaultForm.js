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

function FbDefaultForm(props) {
    const [jwt] = useLocalStorage("jwt", null);
    const [clients, setClients] = useState(undefined);
    const [name, setName] = useState(props.state?.name);
    const [selectedClient, setSelectedClient] = useState(props.state?.client ? {label: props.state?.client, value: props.state?.clientId}: undefined);
    const [industry, setIndustry] = useState(props.state?.industry);
    const [studio, setStudio] = useState(props.state?.studio);
    const [features, setFeatures] = useState(props.state?.features);
    const [employeeCount, setEmployeeCount] = useState(props.state?.devAmount)
    const [budget, setBudget] = useState(props.state?.maxBudget);

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


    async function handleChange() {
        const body = {
            name: name,
            industry: industry,
            studio: studio,
            features: features,
            client: selectedClient,
            devAmount: parseInt(employeeCount),
            maxBudget: budget,
            endDate: new Date(),
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
                        <div>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleChange}
                                disabled={!name || !selectedClient || !industry || !studio || features.length === 0 || !employeeCount || !budget}>
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
