import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { accountsRouter } from "./modules/accounts/router";
import { sessionsRouter } from "./modules/sessions/router";
import { departmentsRouter } from "./modules/departments/router";

export const router = new Elysia()
  .use(
    openapi({
      documentation: {
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  )
  .use(accountsRouter)
  .use(sessionsRouter)
  .use(departmentsRouter);
