import { Audit, PrismaClient, Status } from "@prisma/client";
import { connect } from "http2";

const prisma = new PrismaClient();

const getByProject = async (projectId: string) => {
  const audits = await prisma.audit.findMany({
    where: {
      projectId: projectId,
    },
  });
  return audits;
};

const createByProject = async (projectId: string, body: Audit) => {
  const audit = await prisma.audit.create({
    data: {
      projectId: projectId,
      auditorId: body.auditorId,
      status: body.status,
      review: body.review,
      queries: body.queries,
      date: new Date(body.date),
      actionItem: body.actionItem,
    },
  });
  return audit;
};

module.exports = {
  getByProject,
  createByProject,
};
