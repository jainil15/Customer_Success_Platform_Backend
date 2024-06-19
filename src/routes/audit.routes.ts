import { Router } from "express";
const {
  getByProject,
  createByProject,
} = require("../controllers/audit.controller.ts");
const router = Router();
router.get("/project/:id", getByProject);
router.post("/project/:id", createByProject);
module.exports = router;
