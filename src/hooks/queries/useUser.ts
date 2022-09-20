import { trpc } from "utils/trpc";

export function useUser() {
  const userQuery = trpc.user.getSession.useQuery();
  return { user: userQuery.data?.user, ...userQuery };
}
