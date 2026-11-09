import { prisma } from "../../../utils/prisma";

export function findAccountByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email },
    select: { id: true },
  });
}

export async function updateGoogleAccountByEmail(
  email: string,
  sub: string,
  profilePicture: string | null,
) {
  const account = await findAccountByEmail(email);
  if (!account) return null;

  return prisma.account.update({
    where: { id: account.id },
    data: { sub, profilePicture },
    select: { id: true },
  });
}
