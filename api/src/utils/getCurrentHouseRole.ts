import { prisma } from "@lib/prisma";

export async function getCurrentHouseRole(userId: string, houseId: string) {
  const currentRole = await prisma.houseRole.findFirst({
    where: {
      userId,
      houseId,
    },
  });

  return currentRole;
}
