import React, {useState} from "react";

import {Card, CardContent, Box, Typography, TextField, Grid, Button} from "@material-ui/core";

import ProjectTable from "../dashboards/dashboard1-components/ProjectTable";

const BasicTable = () => {
  const [filter, setFilter] = useState(undefined);
  const [stateFilter, setStateFilter] = useState(undefined);

  function handleFilterChange(ev) {
    setFilter(ev.target.value)
  }

  function handleAllProjectFilter() {
    setStateFilter(undefined)
  }

  function handleStartedProjectsFilter() {
    setStateFilter('STARTED')
  }

  function handleDelayedProjectsFilter() {
    setStateFilter('DELAYED')
  }

  function handleAcceptedProjectsFilter() {
    setStateFilter('ACCEPTED')
  }

  function handleTeamAssignmentProjectsFilter() {
    setStateFilter('TEAM_ASSIGNMENT')
  }

  function handleCanceledProjectsFilter() {
    setStateFilter('CANCELLED')
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
              <Typography variant="h3">Proyectos</Typography>
            </Grid>
            <Grid item>
              <Grid container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center">
                <Grid item>
                  <Button
                    onClick={handleAllProjectFilter}>
                    Todos los projectos
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleTeamAssignmentProjectsFilter}>
                    Equipo a Asignar
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleDelayedProjectsFilter}>
                    Atrasados
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleStartedProjectsFilter}>
                    Empezados
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleAcceptedProjectsFilter}>
                    Aceptados
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleCanceledProjectsFilter}>
                    Cancelados
                  </Button>
                </Grid>
                <Grid item>
                  <TextField
                    id="project-filter"
                    label="Filtrar proyectos"
                    value={filter}
                    onChange={handleFilterChange}
                  />
                </Grid>
              </Grid>
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
            <ProjectTable filter={filter} stateFilter={stateFilter} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BasicTable;
