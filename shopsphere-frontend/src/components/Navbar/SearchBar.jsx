import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword !== "") {
      navigate(
        `/products?search=${encodeURIComponent(
          trimmedKeyword
        )}`
      );
    } else {
      navigate("/products");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: {
          xs: "100%",
          md: 420,
        },
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Search products..."
        value={keyword}
        onChange={(event) =>
          setKeyword(event.target.value)
        }
        onKeyDown={handleKeyDown}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 40,
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      />

      <Button
        variant="contained"
        onClick={handleSearch}
        aria-label="Search products"
        sx={{
          minWidth: 55,
          height: 40,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          boxShadow: "none",
        }}
      >
        <SearchIcon />
      </Button>
    </Box>
  );
}

export default SearchBar;