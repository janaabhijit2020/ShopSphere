import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from "@mui/material";

function ProductCard({
  name,
  price,
  rating,
  image,
  badge = "New",
  badgeColor = "error",
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        height: "100%",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 8,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={image}
          alt={name}
        />

        <Chip
          label={badge}
          color={badgeColor}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {name}
        </Typography>

        <Rating
          value={rating}
          precision={0.5}
          readOnly
          size="small"
        />

        <Typography
          variant="h6"
          color="primary"
          fontWeight="bold"
          mt={2}
        >
          {price}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;