const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/", itemController.getAllItems);

router.get("/new", itemController.renderAddItemForm);

router.get("/:id", itemController.getItemById);

router.post("/", itemController.createItem);

router.get("/:id/edit", itemController.renderEditItemForm);

router.put("/:id", itemController.updateItem);

router.delete("/:id", itemController.deleteItem);

module.exports = router;
