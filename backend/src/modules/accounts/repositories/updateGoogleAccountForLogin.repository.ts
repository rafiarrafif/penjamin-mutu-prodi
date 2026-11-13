import { prisma } from "../../../utils/prisma";

export function findAccountForGoogleLogin(email: string) {
  return prisma.account.findUnique({
    where: { email },
    select: { id: true },
  });
}

export async function updateGoogleAccountForLogin(
  email: string,
  sub: string,
  profilePicture: string | null,
) {
  const account = await findAccountForGoogleLogin(email);
  if (!account) return null;

  return prisma.account.update({
    where: { id: account.id },
    data: { sub, profilePicture },
  });
}
