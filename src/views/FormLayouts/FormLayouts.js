import React from "react";

import {Grid} from "@material-ui/core";

import {FbDefaultForm} from "./fb-elements/index";
import API from "../../api/api";
import {useNavigate} from "react-router-dom";

const FormLayouts = () => {
    const navigate = useNavigate();

    const handleFormSubmit = async (body, headers) => {
        await API.post(
            `/project`,
            body,
            {headers}
        ).then(() => {
            navigate('/projects')
        }).catch(() => {
            //TODO add error message
            console.log('Error')
        })
    }
    return (
        <Grid container spacing={0}>
            <Grid item lg={12} md={12} xs={12}>
                <FbDefaultForm minDate handleFormSubmit={handleFormSubmit}/>
            </Grid>
        </Grid>
    );
};

export default FormLayouts;
