import React from "react";

import { Card, CardContent, Box, Typography } from "@material-ui/core";

import ProjectTable from "../dashboards/dashboard1-components/ProjectTable";

const BasicTable = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Proyectos</Typography>
          <Box
            sx={{
              overflow: {
                xs: "auto",
                sm: "unset",
              },
            }}
          >
            <ProjectTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BasicTable;
