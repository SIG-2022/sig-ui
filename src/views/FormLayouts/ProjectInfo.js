import React from "react";

import {Grid} from "@material-ui/core";

import {FbDefaultForm} from "./fb-elements/index";
import {useLocation} from "react-router";
import API from "../../api/api";
import {useNavigate} from "react-router-dom";

const FormLayouts = () => {
  const {state} = useLocation();
  const navigate = useNavigate();

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
        <FbDefaultForm state={state} formMsg={state.name} buttonMsg={'Actualizar Proyecto'}
                       handleFormSubmit={handleFormSubmit}/>
      </Grid>
    </Grid>
  );
};

export default FormLayouts;
