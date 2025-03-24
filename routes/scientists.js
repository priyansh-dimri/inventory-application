const express = require("express");
const router = express.Router();
const scientistController = require("../controllers/scientistController");

router.get("/", scientistController.getAllScientists);

router.get("/new", scientistController.renderAddScientistForm);

router.get("/:id", scientistController.getScientistById);

router.post("/", scientistController.createScientist);

router.get("/:id/edit", scientistController.renderEditScientistForm);

router.put("/:id", scientistController.updateScientist);

router.delete("/:id", scientistController.deleteScientist);

module.exports = router;
