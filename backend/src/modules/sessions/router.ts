import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";

export const sessionsRouter = new Elysia({ name: "sessions" }).use(openapi());
