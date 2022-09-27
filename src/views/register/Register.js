import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import API from "../../api/api";
import {useNavigate} from "react-router-dom";

const theme = createTheme();

export default function SignUp() {
    const [passwordError, setPasswordError] = useState(undefined);
    const [confirmPasswordError, setConfirmPasswordError] = useState(undefined);
    const [emailError, setEmailError] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        if(event.target.value.length < 10){
            setPasswordError('La contraseña debe contener al menos 10 caracteres');
        } else {
            setPasswordError(undefined);
        }
    }

    const handleConfirmPasswordChange = (event) => {
        if(event.target.value !== password){
            setConfirmPasswordError('Las contraseñas deben coincidir');
        } else {
            setConfirmPasswordError(undefined);
        }
    }

    const handleEmailChange = (event) => {
        if (!String(event.target.value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
            setEmailError('Formato de email incorrecto');
        } else {
            setEmailError(undefined);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
        API.post(`/user/register`, {
            email: data.get('email'),
            password: data.get('password'),
        })
            .then(() => {
                setPasswordError(undefined);
                setConfirmPasswordError(undefined);
                setEmailError(undefined);
                navigate('/', {replace: true})
            })
            .catch(() => {
                setEmailError('Email en uso!')
            })
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Registrarse
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    onChange={handleEmailChange}
                                    error={emailError && true}
                                    helperText={emailError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={handlePasswordChange}
                                    error={passwordError && true}
                                    helperText={passwordError}
                                    value={password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirm-password"
                                    label="Confirmar contraseña"
                                    type="password"
                                    id="confirm-password"
                                    autoComplete="confirm-password"
                                    onChange={handleConfirmPasswordChange}
                                    error={confirmPasswordError && true}
                                    helperText={confirmPasswordError}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrarse
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="" variant="body2">
                                    Ya tienes una cuenta? Ingresar
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}