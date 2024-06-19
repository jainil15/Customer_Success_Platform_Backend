import { createValidation } from "./../models/user.model";
import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { validate } from "../utils/validator";

import { CreateUserRequest } from "../models/user.model";
import { error } from "console";
const userService = require("../services/user.services.ts");
const userModel = require("../models/user.model.ts");
const prisma = new PrismaClient();

const create = async (req: Request, res: Response) => {
  let body: CreateUserRequest = req.body as CreateUserRequest;
  try {
    const valid = validate(body, userModel.createValidation);
    if (valid.valid === true) {
      const user = await userService.create(body.id, body.name, body.email);
      return res.status(200).json({ user: user });
    }
    return res.status(400).json({ error: valid.errors });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const user = await userService.remove(req.params.id);
      return res.status(200).json({ message: user.id });
    }
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const user = await userService.get(req.params.id);
      if (user) {
        return res.status(200).json({ user: user });
      }
    }
    return res.status(404).json({ error: ["User Not Found"] });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};
const getAll = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAll();
    return res.status(200).json({ users: users });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const getByRole = async (req: Request, res: Response) => {
  try {
    if (req.params.role && (req.params.role as UserRole)) {
      const users = await userService.getByRole(req.params.role);
      return res.status(200).json({ users: users });
    }
    return res.status(400).json({ error: ["Role required"] });
  } catch (e) {
    return res.status(500).json({ error: ["Internal server error"] });
  }
};

const getUserProjects = async(req:Request, res:Response) => {
  try {
    if (req.params.id) {
      const userProjects = await userService.getUserProjects(req.params.id)
      return res.status(200).json({users: userProjects});
    }
    return res.status(400).json({error: ["Required id and role"]})
  }catch(e) {
    
    return res.status(500).json({error: ["Internal server error", e]})
  }
}

const update = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const user = await userService.update(req.params.id, req.body)
      return res.status(200).json({user: user});
    }
    return res.status(400).json({error: ["Required user id"]})
  }catch(e) {
    
    return res.status(500).json({error: ["Internal server error", e]})
  }
};
module.exports = { create, remove, get, getAll, update, getByRole, getUserProjects };
