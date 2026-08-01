import { Box, Button, Chip, Container, Grid, Typography } from "@mui/material";
import heroImage from "../../assets/banners/hero.png";

function Hero() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
        color: "#FFFFFF",
        minHeight: { xs: "80vh", md: "85vh" },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          alignItems="center"
        >
          {/* Left Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip
              label="🔥 Up to 50% OFF"
              sx={{
                backgroundColor: "#F97316",
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "0.95rem",
                px: 1,
                mb: 3,
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 3,
                fontSize: {
                  xs: "2.7rem",
                  sm: "3.5rem",
                  md: "4.3rem",
                },
              }}
            >
              Shop Smarter,
              <br />
              Live Better.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.92)",
                mb: 5,
                maxWidth: "560px",
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              Discover premium electronics, fashion, home essentials and much
              more with secure shopping, fast delivery and unbeatable prices.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#F97316",
                  color: "#FFFFFF",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 10px 25px rgba(0,0,0,.20)",
                  "&:hover": {
                    backgroundColor: "#EA580C",
                  },
                }}
              >
                Shop Now
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: "#FFFFFF",
                  borderColor: "#FFFFFF",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(6px)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderColor: "#FFFFFF",
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="ShopSphere Hero"
              sx={{
                width: "100%",
                maxWidth: "650px",
                height: {
                  xs: "320px",
                  md: "460px",
                },
                objectFit: "cover",
                borderRadius: "20px",
                boxShadow: "0 20px 50px rgba(0,0,0,.25)",
                transition: "0.4s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Hero;