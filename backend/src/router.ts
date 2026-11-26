import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { accountsRouter } from "./modules/accounts/router";
import { sessionsRouter } from "./modules/sessions/router";
import { departmentsRouter } from "./modules/departments/router";
import { documentsRouter } from "./modules/documents/router";
import { logsRouter } from "./modules/logs/router";

const allowedOrigin =
  process.env.FRONTEND_URL?.trim() || "http://localhost:5173";

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "access-control-allow-headers": "Authorization, Content-Type",
    vary: "Origin",
  };

  if (origin === allowedOrigin) {
    headers["access-control-allow-origin"] = allowedOrigin;
  }

  return headers;
}

export const router = new Elysia()
  .onRequest(({ request, set }) => {
    const corsHeaders = getCorsHeaders(request);
    for (const [key, value] of Object.entries(corsHeaders)) {
      set.headers[key] = value;
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
  })
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
  .use(departmentsRouter)
  .use(documentsRouter)
  .use(logsRouter);
