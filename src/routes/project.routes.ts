import { Router } from "express";
import { claimCheck, claimEquals } from "express-oauth2-jwt-bearer";
const {
  create,
  get,
  getAll,
  remove,
  update,
  getAllProjects,
  getProjectDetails,
} = require("../controllers/project.controller");
const { checkRequiredPermissions } = require("../middlewares/oAuth.middlware");
const router = Router();
router.post("/", create);
// router.get("/all/admin", getAllProjects);
router.get("/:id", checkRequiredPermissions(["read:projects"]), get);
// @ts-ignore
router.get("/", checkRequiredPermissions(["read:projects"]), getAll);

router.delete("/:id", checkRequiredPermissions(["write:projects"]), remove);
router.put("/:id", checkRequiredPermissions(["write:projects"]), update);
router.get(
  "/details/:id",
  checkRequiredPermissions(["read:projects"]),
  getProjectDetails
);
module.exports = router;
