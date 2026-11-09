import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { accountsRouter } from "./modules/accounts/router";
import { sessionsRouter } from "./modules/sessions/router";

export const router = new Elysia()
  .use(openapi())
  .use(accountsRouter)
  .use(sessionsRouter);
