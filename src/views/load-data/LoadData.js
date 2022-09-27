import React, {useState} from "react";

import {Box, Button, Card, CardContent, Divider, Grid, Typography} from "@material-ui/core";

import API from "../../api/api";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import Alert from '@mui/material/Alert';

const LoadData = () => {
    const [jwt] = useLocalStorage("jwt", null);
    const [success, setSuccess] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const handleFileUpload = event => {
        if (event.target.files[0]) {
            const headers = {
                Authorization: 'Bearer ' + jwt
            };

            const formData = new FormData();

            formData.append('File', event.target.files[0]);
            API.post(
                `/project/upload-data`,
                formData,
                {headers}
            ).then(() => {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(undefined)
                }, 10000)
            }).catch(() => {
                setSuccess(false)
                setErrorMessage('Error al importar la base de empleados!')
            })
        }
    };

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i=0; i!==s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const handleFileDownload = async event => {
        const headers = {
            Authorization: 'Bearer ' + jwt
        };

        API.get(
            `/project/export-employee-excel`,
            {headers}
        ).then((response) => {
            const bin = atob(response.data.data);
            const ab = s2ab(bin);
            const blob = new Blob([ab], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Base de Empleados.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch((err) => {
            console.log('error ', err);
            setSuccess(false);
            setErrorMessage('Error al descargar la base de empleados!');
        })
    };

    return (
        <Grid container spacing={0}>
            <Grid item lg={12} md={12} xs={12}>
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
                                    Cargar Datos
                                </Typography>
                            </Box>
                        </Box>
                        <Divider/>
                        <CardContent
                            sx={{
                                padding: "30px",
                            }}
                        >
                            {success &&
                            <Alert severity="success">
                                Base de empleados importada satisfactoriamente!
                            </Alert>}
                            {success === false &&
                            <Alert severity="error">
                                {errorMessage ? errorMessage : 'Error al importar la base de empleados!'}
                            </Alert>}
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                padding={3}
                            >
                                <Grid item>
                                    <Typography color="textSecondary" variant="h2">
                                        Importar Base de Empleados (.XLSX)
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        component="label"
                                    >
                                        Subir Archivo
                                        <input
                                            type="file"
                                            accept='.xlsx'
                                            hidden
                                            onChange={handleFileUpload}
                                        />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                padding={3}
                            >
                                <Grid item>
                                    <Typography color="textSecondary" variant="h2">
                                        Exportar Base de Empleados (.XLSX)
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        sx={{
                                            ml: 1,
                                        }}
                                        onClick={handleFileDownload}
                                    >
                                        Descargar Archivo
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </div>
            </Grid>
        </Grid>
    );
};

export default LoadData;
