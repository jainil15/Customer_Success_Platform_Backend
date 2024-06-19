import express from "express";
import { checkRequiredPermissions } from "../middlewares/oAuth.middlware";
const {
  create,
  remove,
  get,
  getAll,
  update,
  getByRole,
  getUserProjects,
} = require("../controllers/user.controller.ts");

const router = express.Router();
router.get("/", getAll);
router.get("/:id", get);
router.post("/", create);
router.put("/", update);
router.delete("/:id", remove);
router.put("/:id", update);
router.get("/role/:role", getByRole);
router.get("/projects/:id", getUserProjects);
module.exports = router;
