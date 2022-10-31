import React from "react";
import { Grid, Box } from "@material-ui/core";

import {
  SalesOverview,
  ProductPerformance,
  Indicators,
} from "./dashboard-components";

const Dashboard = () => {

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
    "Octubre", "Noviembre", "Diciembre"];
  const monthName = monthNames[new Date().getMonth()]

  const quarterNames = ["(Enero-Marzo)", "(Abril-Junio)", "(Julio-Septiembre)", "(Octubre-Diciembre)"];
  const quarter = Math.floor(new Date().getMonth() / 3 + 1)
  const quarterName = quarterNames[quarter - 1]

  return (
    <Box>
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={12}>
            <ProductPerformance />
        </Grid>
        {/* ------------------------- row 2 ------------------------- */}
        <Grid item xs={12} lg={6}>
          <Indicators
              tableName={'Indicadores Mensuales'}
              tableDescription={'Correspondientes al mes de ' + monthName + ' de ' + new Date().getFullYear()}
              monthly
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Indicators
              tableName={'Indicadores Trimestrales'}
              tableDescription={'Correspondientes al Q' + quarter + quarterName + ' de ' + new Date().getFullYear() }
          />
        </Grid>
        {/* ------------------------- row 3 ------------------------- */}
      </Grid>
    </Box>
  );
};

export default Dashboard;
