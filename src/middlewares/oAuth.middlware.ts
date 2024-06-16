import { NextFunction, Request, Response } from "express";
import { claimCheck, InsufficientScopeError } from "express-oauth2-jwt-bearer";

export const checkRequiredPermissions = (requiredPermissions: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = payload.permissions || [];

      const hasPermissions = requiredPermissions.every((requiredPermission: any) =>
        // @ts-ignore
        permissions.includes(requiredPermission)
      );

      if (!hasPermissions) {
        throw new InsufficientScopeError();
      }

      return hasPermissions;
    });

    permissionCheck(req, res, next);
  };
};