import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fb",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: "center",
            p: 4,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              color: "primary.main",
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            Page Not Found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 2, mb: 4 }}
          >
            The page you are looking for does not exist.
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
          >
            Go Back Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default NotFound;