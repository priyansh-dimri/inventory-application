const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/new", categoryController.renderAddCategoryForm);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.get("/:id/edit", categoryController.renderEditCategoryForm);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
