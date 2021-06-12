import { prisma } from "src";

export async function getCurrentHouseRole(userId: string, houseId: string) {
  const currentRole = await prisma.houseRole.findFirst({
    where: {
      userId,
      houseId,
    },
  });

  return currentRole;
}
