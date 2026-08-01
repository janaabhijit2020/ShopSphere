import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import ReplayIcon from "@mui/icons-material/Replay";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const features = [
  {
    title: "Fast Delivery",
    description: "Quick and reliable delivery across India.",
    icon: <LocalShippingIcon sx={{ fontSize: 55, color: "#2563EB" }} />,
  },
  {
    title: "Secure Payment",
    description: "100% secure payment with trusted gateways.",
    icon: <SecurityIcon sx={{ fontSize: 55, color: "#16A34A" }} />,
  },
  {
    title: "Easy Returns",
    description: "Simple and hassle-free return policy.",
    icon: <ReplayIcon sx={{ fontSize: 55, color: "#EA580C" }} />,
  },
  {
    title: "24×7 Support",
    description: "Friendly customer support whenever you need it.",
    icon: <SupportAgentIcon sx={{ fontSize: 55, color: "#9333EA" }} />,
  },
];

function WhyChooseUs() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={1}
      >
        Why Choose ShopSphere?
      </Typography>

      <Typography
        textAlign="center"
        color="text.secondary"
        mb={5}
      >
        Everything you need for a smooth and secure shopping experience.
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                textAlign: "center",
                height: "100%",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                {feature.icon}

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mt={2}
                >
                  {feature.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={2}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default WhyChooseUs;