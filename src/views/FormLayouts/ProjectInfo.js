import React from "react";

import {Grid} from "@material-ui/core";

import {FbDefaultForm} from "./fb-elements/index";
import {useLocation} from "react-router";
import API from "../../api/api";
import {useNavigate} from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import EmployeeTable from "../tables/EmployeeTable";

const FormLayouts = () => {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [selection, setSelection] = React.useState("team-assign");

    const handleAlignment = (event, newAlignment) => {
        setSelection(newAlignment);
    };

    const handleFormSubmit = async (body, headers) => {
        await API.post(
            `/project/update`,
            {
                ...body,
                id: state.id
            },
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
                <ToggleButtonGroup
                    value={selection}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                    sx={{marginLeft:3}}
                >
                    <ToggleButton value="team-assign">
                        Asignar Equipo
                    </ToggleButton>
                    <ToggleButton value="update-project">
                        Actualizar Proyecto
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
                {selection === 'update-project' &&
                <FbDefaultForm state={state}
                               formMsg={state.name}
                               buttonMsg={'Actualizar Proyecto'}
                               handleFormSubmit={handleFormSubmit}
                />
                }
                {selection === 'team-assign' &&
                    <EmployeeTable employeeSelection project={state} assigned={true} />
                }
            </Grid>
        </Grid>
    );
};

export default FormLayouts;
