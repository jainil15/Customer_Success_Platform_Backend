import {
  clientCreateSchema,
  UpdateProjectType,
  userCreateSchema,
} from "./../models/project.model";
import { Request, Response } from "express";
import {
  projectCreateRequest,
  projectCreateSchema,
} from "../models/project.model";
import { validate } from "../utils/validator";
const projectService = require("../services/project.services.ts");

const create = async (req: Request, res: Response) => {
  try {
    const body: projectCreateRequest = req.body as projectCreateRequest;

    const valid = validate(body, projectCreateSchema);
    for (let i of body.clients) {
      const tmpValid = validate(i, clientCreateSchema);
      if (!tmpValid.valid) {
        valid.valid = tmpValid.valid;
        valid.errors = valid.errors.concat(tmpValid.errors);
      }
    }
    if (valid.valid === true) {
      const project = await projectService.create(body);
      return res.status(200).json({ project: project });
    }
    return res.status(400).json({ error: valid.errors });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error" + e] });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const project = await projectService.get(req.params.id);
      return res.status(200).json({ project: project });
    }
    return res.status(400).json({ error: ["Missing project id required"] });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getAll();
    return res.status(200).json({ projects: projects });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const body: UpdateProjectType = req.body as UpdateProjectType;
    const project = await projectService.update(body);
    return res.status(200).json({ project: project });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const project = await projectService.remove(req.params.id);
      return res.status(200).json({ project: project });
    }
    return res.status(400).json("Missing project id");
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
    return res.status(200).json({ projects: projects });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const getProjectDetails = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const project = await projectService.getProjectDetails(req.params.id);
      return res.status(200).json({ project: project });
    }
    return res.status(400).json("Missing project id");
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  } 
};
module.exports = {
  create,
  get,
  getAll,
  remove,
  update,
  getAllProjects,
  getProjectDetails,
};
