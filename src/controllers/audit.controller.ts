import { Audit } from "@prisma/client";
import { Request, Response } from "express";

const auditService = require("../services/audit.services.ts");

const getByProject = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const audits = await auditService.getByProject(req.params.id);
      return res.status(200).json({ audits: audits });
    }
    return res.status(400).json({ error: ["Required Project Id"] });
  } catch (e) {
    return res.status(500).json({ error: ["Internal Server Error"] });
  }
};

const createByProject = async (req: Request, res: Response) => {
  try {
    if (req.params.id && req.body) {
      const audits = await auditService.createByProject(
        req.params.id,
        req.body as Audit
      );
      return res.status(200).json({ audits: audits });
    }
    return res.status(400).json({ error: ["Required Project Id"] });
  } catch (e) {
    return res.status(500).json({ error: ["Internal Server Error", e] });
  }
};

module.exports = { getByProject, createByProject };
