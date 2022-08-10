import { trpc } from "utils/trpc";

export function useUser() {
  const userQuery = trpc.useQuery(["user.getSession"]);
  return { user: userQuery.data?.user, ...userQuery };
}
