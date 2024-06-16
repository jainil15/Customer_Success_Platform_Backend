import { connect } from "http2";
import {
  AddAuditorType,
  AddClientType,
  projectCreateRequest,
} from "./../models/project.model";
import { PrismaClient, Project, ProjectStatus, UserRole } from "@prisma/client";
import axios from "axios";
import { passwordGen } from "../utils/passwordGen";

const prisma = new PrismaClient();
const get = async (_id: string) => {
  const project = await prisma.project.findUnique({ where: { id: _id } });
  return project;
};

const getAll = async () => {
  const projects = await prisma.project.findMany();
  return projects;
};
const create = async (body: projectCreateRequest) => {
  const _clients = [];
  for (let _client of body.clients) {
    const clientDBCheck = await prisma.user.findUnique({
      where: { email: _client.email },
    });
    console.log("here");
    if (!clientDBCheck) {
      console.log(clientDBCheck);
      const clientPassword = passwordGen(12);
      const data = {
        email: _client.email,
        password: clientPassword,
        connection: "Username-Password-Authentication",
      };
      console.log(clientPassword);
      const client = await axios.post(
        `https://dev-r07u7mel6oip3xhm.us.auth0.com/api/v2/users`,
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
          },
        }
      );
      const roleData = { roles: [process.env.CLIENT_ROLE_ID] };
      const role = await axios.post(
        `https://dev-r07u7mel6oip3xhm.us.auth0.com/api/v2/users/${client.data.user_id}/roles`,
        roleData,
        {
          headers: {
            Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
          },
        }
      );
      _clients.push({
        id: client.data.user_id,
        name: client.data.nickname,
        email: client.data.email,
      });
    } else {
      _clients.push(clientDBCheck);
    }
  }
  body.clients = _clients as any;
  const project = await prisma.project.create({
    data: {
      name: body.name,
      projectScope: body.projectScope,
      status: body.status as ProjectStatus,
      description: body.description,
      manager: {
        connect: {
          id: body.managerId,
        },
      },
      clients: {
        create: body.clients.map((client) => ({
          client: {
            connectOrCreate: {
              where: { email: client.email },
              create: {
                id: client.id,
                role: UserRole.CLIENT,
                name: client.name,
                email: client.email,
              },
            },
          },
        })) as any,
      },
      projectStack: {
        connectOrCreate: {
          where: {
            id: body.projectStackId,
          },
          create: {
            id: body.projectStackId,
            name: "AI",
          },
        },
      },
    },
  });
  return project;
};

const remove = async (_id: string) => {
  const project = prisma.project.delete({
    where: {
      id: _id,
    },
  });
  return project;
};

const addAuditor = async (body: AddAuditorType) => {
  const project = prisma.project.update({
    where: {
      id: String(body.projectId),
    },
    data: {
      auditors: {
        create: body.auditors.map((auditor) => ({
          auditor: {
            connectOrCreate: {
              where: {
                email: auditor.email,
              },
              create: {
                role: UserRole.AUDITOR,
                name: auditor.name,
                email: auditor.email,
              },
            },
          },
        })) as any,
      },
    },
  });
  return project;
};

const addClient = async (body: AddClientType) => {
  const project = prisma.project.update({
    where: {
      id: String(body.projectId),
    },
    data: {
      clients: {
        create: body.clients.map((client) => ({
          client: {
            connectOrCreate: {
              where: {
                email: client.email,
              },
              create: {
                role: UserRole.CLIENT,
                name: client.name,
                email: client.email,
              },
            },
          },
        })) as any,
      },
    },
  });
  return project;
};

const getAllProjects = async () => {
  const projects = await prisma.project.findMany({
    include: {
      clients: true,
      manager: true,
      auditors: true,
      _count: {
        select: {
          auditors: true,
          clients: true,
        },
      },
    },
  });
  return projects;
};
const updateTest = async (body: any) => {
  const project = prisma.project.update({
    where: {
      id: body.id,
    },
    data: body,
  });
  return project;
};
const update = async (body: any) => {
  const project = prisma.project.update({
    where: { id: body.id },
    data: {
      name: body.name,
      managerId: body.managerId,
      status: body.status,
      description: body.description,
      projectStackId: body.projectStackId,
      projectScope: body.projectScope,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      updatedAt: new Date(),

      auditors: {
        connect: body.auditors.map((auditor: any) => ({
          projectId_auditorId: {
            auditorId: auditor.auditorId,
            auditorEmail: auditor.auditorEmail,
          },
        })),
      },

      audits: {
        set: body.audits.map((audit: any) => ({
          id: audit.id,
        })),
      },

      clients: {
        connect: body.clients.map((client: any) => ({
          projectId_clientId: {
            projectId: body.id,
            clientId: client.clientId,
          },
        })),
      },

      feedbacks: {
        set: body.feedbacks.map((feedback: any) => ({
          id: feedback.id,
        })),
      },

      phases: {
        set: body.phases.map((phase: any) => ({
          id: phase.id,
        })),
      },

      risks: {
        set: body.risks.map((risk: any) => ({
          id: risk.id,
        })),
      },

      sprints: {
        set: body.sprints.map((sprint: any) => ({
          id: sprint.id,
        })),
      },

      versions: {
        set: body.versions.map((version: any) => ({
          id: version.id,
        })),
      },
    },
  });
  return project;
};
const getProjectDetails = async (_id: string) => {
  const project = await prisma.project.findUnique({
    where: { id: _id },
    include: {
      auditors: true,
      audits: true,
      clients: true,
      feedbacks: true,
      manager: true,
      overview: true,
      phases: true,
      projectStack: true,
      risks: true,
      sprints: true,
      versions: true,
    },
  });

  return project;
};
module.exports = {
  create,
  update,
  remove,
  get,
  getAll,
  addAuditor,
  addClient,
  getAllProjects,
  getProjectDetails,
};
