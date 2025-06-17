import { User } from "@acme/shared-models";

export function getAssigneeName(users: User[], assigneeId: number): string {
  const user = users.find((user) => user.id === assigneeId);
  return user ? user.name : "Unknown";
}
