import { UserRole } from "@prisma/client";

export type CreateUserRequest = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type CreateUserResponse = {
  id: string
  name: string;
  email: string;
  role: string;
};

export const createValidation = {
  name: "min:1|type:string",
  email: "email",
};

export const updateValidation = {
  name: "min:1|type:string",
  email: "email",
};