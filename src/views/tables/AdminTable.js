import React, {useEffect, useState} from "react";

import {
    Card,
    CardContent,
    Box,
    Typography,
    Grid,
    Table, TableHead, TableRow, TableCell, TableBody, Button
} from "@material-ui/core";

import {useLocalStorage} from "../../hooks/useLocalStorage";
import API from "../../api/api";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';
import {Modal} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";

const UserTable = () => {
    const [users, setUsers] = useState(undefined);
    const [jwt] = useLocalStorage("jwt", null);

    useEffect(() => {
        async function getUsers() {
            const headers = {
                Authorization: 'Bearer ' + jwt
            };
            const response = await API.get(
                `/user`,
                {headers}
            );
            parseUsers(response.data);
        }

        if (!users) {
            getUsers();
        }
    }, [users, jwt])

    const parseUsers = (data) => {
        setUsers(data)
    }

    const headCells = [
        {
            id: 'email',
            numeric: false,
            label: 'Email',
            visible: true
        },
        {
            id: 'empty',
            numeric: false,
            label: '',
            visible: false
        },
        {
            id: 'empty2',
            numeric: false,
            label: '',
            visible: false
        },
    ];

    function handleUserDelete(user) {
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        API.delete(
            `/user/${user.id}`,
            {headers}
        );
        setUsers(users.filter(us => us.id !== user.id));
    }

    function handleUserAccept(user) {
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        API.post(
            `/user/${user.id}/accept`,
            {},
            {headers}
        );
        setUsers(users.filter(us => us.id !== user.id));
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
                        >
                            {header.visible &&
                            <Typography color="textSecondary" variant="h6">
                                {header.label}
                            </Typography>}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {users && users.map((user) => (
                    <TableRow
                        key={user.id}
                    >
                        <TableCell>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "600",
                                }}
                            >
                                {user.email}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {user &&
                            <CheckIcon
                                sx={{
                                    color: 'rgba(74,182,92,0.93)',
                                }}
                                style={{cursor: 'pointer'}}
                                onClick={() => handleUserAccept(user)}
                            />
                            }
                        </TableCell>
                        <TableCell>
                            {user &&
                            <CloseIcon
                                sx={{
                                    color: '#f5301a',
                                }}
                                style={{cursor: 'pointer'}}
                                onClick={() => handleUserDelete(user)}
                            />
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const AdminTable = () => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = React.useState(false);
    const [emailError, setEmailError] = React.useState(undefined);
    const [password, setPassword] = React.useState(undefined);
    const [passwordError, setPasswordError] = React.useState(undefined);
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(undefined);
    const navigate = useNavigate();
    const [jwt] = useLocalStorage("jwt", null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const headers = {
            Authorization: 'Bearer ' + jwt
        };
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
        API.post(`/user/register-admin`, {
            email: data.get('email'),
            password: data.get('password'),
        }, {headers})
            .then(() => {
                setPasswordError(undefined);
                setConfirmPasswordError(undefined);
                setEmailError(undefined);
                navigate('/users', {replace: true});
                setOpen(false);
            })
            .catch(() => {
                setEmailError('Email en uso!')
            })
    };

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

    return (
        <Box>
            <Card variant="outlined">
                <CardContent>
                    <Grid container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start">
                        <Grid item>
                            <Typography variant="h3">Aceptar Usuarios</Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant='contained'
                                onClick={() => setOpen(true)}>
                                Agregar Administrador
                            </Button>
                        </Grid>
                    </Grid>
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                    >
                        <Box sx={style}>
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
                                    Crear Administrador
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Box
                        sx={{
                            overflow: {
                                xs: "auto",
                                sm: "unset",
                            },
                        }}
                    >
                        <UserTable/>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminTable;
