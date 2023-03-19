import { PrismaClient, User } from ".prisma/client";
import { WebsocketMethod } from "express-ws";
// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      db: PrismaClient;
      user: User?;
      customs: Record<any, any>;
    
    }

    export interface Router {
        ws: WebsocketMethod<this>;
    }
  }
}