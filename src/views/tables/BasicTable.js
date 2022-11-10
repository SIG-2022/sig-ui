import React, {useState} from "react";

import {Card, CardContent, Box, Typography, TextField, Grid, Button} from "@material-ui/core";

import ProjectTable from "../dashboards/dashboard-components/ProjectTable";

const BasicTable = () => {
  const [filter, setFilter] = useState(undefined);
  const [stateFilter, setStateFilter] = useState(undefined);

  function handleFilterChange(ev) {
    setFilter(ev.target.value)
  }

  function handleAllProjectFilter() {
    setStateFilter(undefined)
  }

  function handleAcceptedProjectsFilter() {
    setStateFilter('ACCEPTED')
  }

  function handleTeamAssignmentProjectsFilter() {
    setStateFilter('TEAM_ASSIGNMENT')
  }

  function handleSentProjectsFilter() {
    setStateFilter('SENT_TO_CLIENT')
  }

  function handleTeamAssignedProjectsFilter() {
    setStateFilter('TEAM_ASSIGNED')
  }

  function handleRejectedProjectsFilter() {
    setStateFilter('REJECTED_BY_CLIENT')
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
                      variant={stateFilter || 'contained'}
                      onClick={handleAllProjectFilter}>
                    Todos los proyectos
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={stateFilter === 'TEAM_ASSIGNMENT' && 'contained'}
                    onClick={handleTeamAssignmentProjectsFilter}>
                    Proyecto sin Equipo Asignado
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={stateFilter === 'TEAM_ASSIGNED' && 'contained'}
                    onClick={handleTeamAssignedProjectsFilter}>
                    Equipo Asignado
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={stateFilter === 'SENT_TO_CLIENT' && 'contained'}
                    onClick={handleSentProjectsFilter}>
                    Enviados
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={stateFilter === 'REJECTED_BY_CLIENT' && 'contained'}
                    onClick={handleRejectedProjectsFilter}>
                    Rechazados
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={stateFilter === 'ACCEPTED' && 'contained'}
                    onClick={handleAcceptedProjectsFilter}>
                    Aceptados
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={stateFilter === 'CANCELLED' && 'contained'}
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
