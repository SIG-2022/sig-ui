import React from "react";

import {Grid} from "@material-ui/core";
import {CreateClient} from "./fb-elements/index";

const CreateClientLayout = () => {
    return (
        <Grid container spacing={0}>
            <Grid item lg={12} md={12} xs={12}>
                <CreateClient/>
            </Grid>
        </Grid>
    );
};

export default CreateClientLayout;
