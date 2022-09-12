import React from "react";

import { Box, IconButton } from "@material-ui/core";

import BaseCard from "../../BaseCard/BaseCard";

const IconColorButtons = () => {
  return (
    <BaseCard
      title="Color Buttons"
      chiptitle="Icon Buttons"
      variant="outlined"
      sx={{
        p: 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton
          variant="contained"
          color="primary"
          sx={{
            mr: 1,
          }}
        >
        </IconButton>
      </Box>
    </BaseCard>
  );
};

export { IconColorButtons };
