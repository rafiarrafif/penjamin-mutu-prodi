export function getClientIpAddress(
  request: Request,
  server: {
    requestIP: (request: Request) => { address: string } | null;
  } | null,
): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedAddress = forwardedFor?.split(",", 1)[0]?.trim();
  if (forwardedAddress) return forwardedAddress;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return server?.requestIP(request)?.address ?? null;
}
