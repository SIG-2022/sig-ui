import React, {useEffect, useState} from "react";

import {
    Card,
    CardContent,
    Box,
    Typography,
    Grid,
    Table, TableHead, TableRow, TableCell, TableBody
} from "@material-ui/core";

import {useLocalStorage} from "../../hooks/useLocalStorage";
import API from "../../api/api";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';

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
                    </Grid>
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
