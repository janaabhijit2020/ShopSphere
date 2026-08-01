import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/categoryService";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [categoryName, setCategoryName] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("success");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllCategories();

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load categories."
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedCategory(null);

    setCategoryName("");

    setDialogOpen(true);
  };

  const handleOpenEditDialog = (
    category
  ) => {
    setSelectedCategory(category);

    setCategoryName(
      category.name || ""
    );

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);

    setSelectedCategory(null);

    setCategoryName("");
  };

  const handleSaveCategory = async () => {
    const trimmedName =
      categoryName.trim();

    if (trimmedName === "") {
      setMessage(
        "Category name is required."
      );

      setMessageType("error");

      return;
    }

    try {
      setSaving(true);

      if (selectedCategory) {
        await updateCategory(
          selectedCategory.id,
          {
            name: trimmedName,
          }
        );

        setMessage(
          "Category updated successfully."
        );
      } else {
        await createCategory({
          name: trimmedName,
        });

        setMessage(
          "Category created successfully."
        );
      }

      setMessageType("success");

      setDialogOpen(false);

      setSelectedCategory(null);

      setCategoryName("");

      await loadCategories();
    } catch (error) {
      console.error(
        "Failed to save category:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to save category."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (
    category
  ) => {
    setSelectedCategory(category);

    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);

    setSelectedCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      setDeleting(true);

      await deleteCategory(
        selectedCategory.id
      );

      setMessage(
        "Category deleted successfully."
      );

      setMessageType("success");

      setDeleteDialogOpen(false);

      setSelectedCategory(null);

      await loadCategories();
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to delete category."
      );

      setMessageType("error");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      field: "id",

      headerName: "ID",

      width: 100,
    },

    {
      field: "name",

      headerName: "Category Name",

      flex: 1,

      minWidth: 220,
    },

    {
      field: "actions",

      headerName: "Actions",

      width: 160,

      sortable: false,

      filterable: false,

      renderCell: (params) => (
        <Box
          sx={{
            height: "100%",

            display: "flex",

            alignItems: "center",

            gap: 0.5,
          }}
        >
          <IconButton
            color="primary"

            onClick={() =>
              handleOpenEditDialog(
                params.row
              )
            }

            aria-label="Edit category"
          >
            <EditOutlinedIcon />
          </IconButton>

          <IconButton
            color="error"

            onClick={() =>
              handleOpenDeleteDialog(
                params.row
              )
            }

            aria-label="Delete category"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",

        py: {
          xs: 3,
          md: 5,
        },

        backgroundColor:
          "#f5f7fb",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: {
              xs: "flex-start",
              sm: "center",
            },

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            gap: 2,

            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"

              fontWeight="bold"
            >
              Manage Categories
            </Typography>

            <Typography
              color="text.secondary"

              sx={{
                mt: 0.5,
              }}
            >
              Create, update, and delete
              product categories.
            </Typography>
          </Box>

          <Button
            variant="contained"

            startIcon={
              <AddIcon />
            }

            onClick={
              handleOpenAddDialog
            }

            sx={{
              px: 2.5,

              py: 1.2,

              borderRadius: 2,

              textTransform:
                "none",
            }}
          >
            Add Category
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"

            sx={{
              mb: 3,
            }}

            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        <Paper
          elevation={2}

          sx={{
            borderRadius: 3,

            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                height: 400,

                display: "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={categories}

              columns={columns}

              getRowId={(row) =>
                row.id
              }

              initialState={{
                pagination: {
                  paginationModel: {
                    page: 0,

                    pageSize: 5,
                  },
                },
              }}

              pageSizeOptions={[
                5,
                10,
                20,
              ]}

              disableRowSelectionOnClick

              autoHeight

              sx={{
                border: "none",

                "& .MuiDataGrid-columnHeaders":
                  {
                    backgroundColor:
                      "#f8fafc",

                    fontWeight:
                      "bold",
                  },
              }}
            />
          )}
        </Paper>
      </Container>

      {/* Add/Edit Category Dialog */}

      <Dialog
        open={dialogOpen}

        onClose={
          handleCloseDialog
        }

        fullWidth

        maxWidth="sm"
      >
        <DialogTitle>
          {selectedCategory
            ? "Edit Category"
            : "Add New Category"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus

            fullWidth

            required

            label="Category Name"

            value={categoryName}

            onChange={(event) =>
              setCategoryName(
                event.target.value
              )
            }

            onKeyDown={(event) => {
              if (
                event.key ===
                  "Enter" &&
                !saving
              ) {
                handleSaveCategory();
              }
            }}

            sx={{
              mt: 1,
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button
            onClick={
              handleCloseDialog
            }

            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"

            onClick={
              handleSaveCategory
            }

            disabled={
              saving
            }
          >
            {saving
              ? "Saving..."
              : selectedCategory
              ? "Update Category"
              : "Create Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}

      <Dialog
        open={
          deleteDialogOpen
        }

        onClose={
          handleCloseDeleteDialog
        }
      >
        <DialogTitle>
          Delete Category
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want
            to delete{" "}
            <strong>
              {
                selectedCategory?.name
              }
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"

            color="text.secondary"

            sx={{
              mt: 1,
            }}
          >
            This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button
            onClick={
              handleCloseDeleteDialog
            }

            disabled={
              deleting
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"

            color="error"

            onClick={
              handleDeleteCategory
            }

            disabled={
              deleting
            }
          >
            {deleting
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Message */}

      <Snackbar
        open={Boolean(message)}

        autoHideDuration={
          3000
        }

        onClose={() =>
          setMessage("")
        }

        anchorOrigin={{
          vertical:
            "bottom",

          horizontal:
            "center",
        }}
      >
        <Alert
          severity={
            messageType
          }

          variant="filled"

          onClose={() =>
            setMessage("")
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminCategories;