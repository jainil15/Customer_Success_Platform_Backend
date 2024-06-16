
import { UserRole, Project, Overview } from "@prisma/client";

export type projectCreateRequest = {
  name: string;
  managerId: string;
  projectStackId: number;
  projectScope: string;
  status: string;
  description: string;
  clients: Client[];
};

export const projectCreateSchema = {
  name: "type:string|min:3|max:100",
  managerId: "type:string",
  projectStackId: "number",
  projectScope: "type:string|min:10|max:1000",
  status: "type:string",
  description: "type:string|min:10|max:1000",
};

export const userCreateSchema = {
  name: "min:1|type:string",
  email: "email|type:string",
  role: "",
};


export const clientCreateSchema = {
  name: "min:1|type:string",
  email: "email|type:string",

};

export const createValidation = {
  name: "min:1|type:string",
  email: "email",
  role: "",
};

export type Client = {
  name: string;
  email: string;
  role: UserRole;
  id: string;
};

export type Auditor = {
  name: string;
  email: string;
  role: UserRole;
  id: string;
};
export type AddAuditorType = {
  projectId: string;
  auditors: Auditor[];
};

export type AddClientType = {
  projectId: string;
  clients: Client[];
};

export type UpdateProjectType = {
  id: string;
  name: string;
  managerId: string;
  projectStackId: number;
  projectScope: string;
  status: string;
  description: string;
  clients: Client[];
  auditors: Auditor[];
  overview: Overview;
};
