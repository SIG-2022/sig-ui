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
import {useNavigate} from "react-router-dom";

function CreateClient() {
    const [jwt] = useLocalStorage("jwt", null);
    const [name, setName] = useState(undefined);
    const [cuit, setCuit] = useState(undefined);
    const [location, setLocation] = useState(undefined);
    const [industry, setIndustry] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [phone, setPhone] = useState(undefined);
    const [validPhone, setValidPhone] = useState(true);
    const navigate = useNavigate();

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleCuitChange(e) {
        setCuit(e.target.value);
    }

    function handleLocationChange(e) {
        setLocation(e.target.value);
    }

    function handleIndustryChange(e) {
        setIndustry(e.target.value);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    async function handleSubmit() {
        const body = {
            name: name,
            cuit: parseInt(cuit),
            location: location,
            industry: industry,
            email: email,
            phone: phone,
        };
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        await API.post(
            `/project/client`,
            body,
            {headers}
        ).then(() => {
            navigate('/projects')
        }).catch(() => {
            //TODO add error message
            console.log('Error')
        })

    }

    function handlePhoneValidation(e) {
        const reg = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\\s\.]?[0-9]{3}[-\\s\.]?[0-9]{4,6}$");
        setValidPhone(e.target.value ? reg.test(e.target.value) : true);
        setPhone(e.target.value);
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
                            Crear Cliente
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
                            id="client-name"
                            label="Razón Social"
                            variant="outlined"
                            fullWidth
                            sx={{
                                mb: 2,
                            }}
                            value={name}
                            onChange={handleNameChange}
                            required
                        />
                        <TextField
                            id="client-industry"
                            label="Industria"
                            variant="outlined"
                            fullWidth
                            sx={{
                                mb: 2,
                            }}
                            value={industry}
                            onChange={handleIndustryChange}
                            required
                        />
                        <Grid container spacing={2} style={{marginBottom:16}}>
                            <Grid item xs={6}>
                                <TextField
                                    id="client-cuit"
                                    label="CUIT"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={handleCuitChange}
                                    value={cuit}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="client-location"
                                    label="Ubicación"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={handleLocationChange}
                                    value={location}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{marginBottom:16}}>
                            <Grid item xs={6}>
                                <TextField
                                    id="client-email"
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={handleEmailChange}
                                    value={email}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="client-phone"
                                    label="Telefono"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={(e) => handlePhoneValidation(e)}
                                    error={!validPhone}
                                    value={phone}
                                />
                            </Grid>
                        </Grid>
                        <div>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!name || !cuit || !location || !industry || !email || !phone}>
                                {'Crear Cliente'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateClient;
