import { PrismaClient, User, UserRole } from "@prisma/client";
import axios from "axios";

import { authHederConfig, authRoleConfig } from "../configs/oAuth.config";
import { combineAllProjects } from "../utils/combine";

const prisma = new PrismaClient();
const getAll = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const get = async (_id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: _id,
    },
  });
  return user;
};

const create = async (_id: string, _name: string, _email: string) => {
  let _authRoleConfig =
    (authRoleConfig.url = `https://dev-r07u7mel6oip3xhm.us.auth0.com/api/v2/users/${_id}/roles`);

  const role: any = await axios.get(
    `https://dev-r07u7mel6oip3xhm.us.auth0.com/api/v2/users/${_id}/roles`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
      },
    }
  );

  if (!role.data[0]) {
    const userRole: any = await axios.post(
      `https://dev-r07u7mel6oip3xhm.us.auth0.com/api/v2/users/${_id}/roles`,
      { roles: [process.env.CLIENT_ROLE_ID] },
      {
        headers: {
          Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
        },
      }
    );
  }

  let _userRole = role.data[0] ? role.data[0].name : "CLIENT";
  let user = await prisma.user.findUnique({ where: { id: _id } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: _id,
        name: _name,
        email: _email,
        role: _userRole as UserRole,
      },
    });
  }

  return user;
};

const remove = async (_id: string) => {
  const user = await prisma.user.delete({
    where: {
      id: _id,
    },
  });
  return user;
};

const update = async (userId: string, body: User) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: body.name,
      email: body.email,
      role: body.role as UserRole,
    },
  });
  return user;
};

const getByRole = async (_role: string) => {
  const users = await prisma.user.findMany({
    where: { role: _role as UserRole },
  });
  return users;
};

const getUserProjects = async (_id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: _id,
    },
  });
  if (user?.role === UserRole.ADMIN) {
    const project = await prisma.project.findMany({
      include: { manager: true },
    });
    //@ts-ignore
    user.projects = project;
    // @ts-ignore
    const projects = user;

    if (projects) {
      // @ts-ignore
      for (let i = 0; i < projects.projects.length; i++) {
        // @ts-ignore
        const project = projects.projects[i];
        const memberCount = await getMemeberCount(project.id);
        // @ts-ignore
        projects.projects[i].members = memberCount;
      }
    }

    return projects;
  } else {
    const projects = await prisma.user.findUnique({
      where: {
        id: _id,
      },
      include: {
        clientProjects: {
          include: {
            client: true,
            project: {
              include: {
                manager: true,
              },
            },
          },
        },
        managedProjects: {
          include: {
            manager: true,
          },
        },
        auditedProjects: {
          include: {
            project: {
              include: {
                manager: true,
              },
            },
          },
        },
      },
    });

    if (projects) {
      // Fetch and assign member counts for clientProjects
      for (let i = 0; i < projects.clientProjects.length; i++) {
        const project = projects.clientProjects[i];
        const memberCount = await getMemeberCount(project.project.id);
        // @ts-ignore
        project.project.members = memberCount;
      }

      // Fetch and log member counts for auditedProjects (example)
      for (let i = 0; i < projects.auditedProjects.length; i++) {
        const project = projects.auditedProjects[i];
        const memberCount = await getMemeberCount(project.project.id);
        // @ts-ignore
        project.project.members = memberCount;
      }
      // @ts-ignore
      projects.projects = combineAllProjects(projects as any);
    }

    return projects;
  }
};

const getMemeberCount = async (_projectId: string) => {
  const auditorCount = await prisma.projectsOnAuditors.groupBy({
    by: ["projectId"],
    where: { projectId: _projectId },
    _count: { auditorId: true },
  });
  const clientCount = await prisma.projectsOnClients.groupBy({
    by: ["projectId"],
    where: { projectId: _projectId },
    _count: { clientId: true },
  });
  const totalClients = clientCount[0]?._count.clientId || 0;
  const totalAuditors = auditorCount[0]?._count.auditorId || 0;
  return totalClients + totalAuditors;
};
module.exports = {
  getAll,
  get,
  create,
  remove,
  update,
  getByRole,
  getUserProjects,
};
