import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";

import ProjectTable from "./ProjectTable";

const ProductPerformance = () => {

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: {
              sm: "flex",
              xs: "block",
            },
            alignItems: "flex-start",
            flexDirection: "column"
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                marginBottom: "0",
              }}
              gutterBottom
            >
              Proyectos
            </Typography>
          </Box>
          <div style={{overflow: 'auto', height: '500px'}}>
              <Box
                  sx={{
                      overflow: {
                          xs: "auto",
                          sm: "unset",
                      },
                      mt: 3,
                  }}
              >
                <ProjectTable />
              </Box>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductPerformance;
