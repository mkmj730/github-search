import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const InfiniteScrollLoader: React.FC = () => (
  <Box className="flex items-center justify-center py-6">
    <CircularProgress />
  </Box>
);

export default InfiniteScrollLoader;
