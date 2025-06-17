// =====================
// 1. handle detail user
// =====================

export async function getUserById(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user details");
  }

  return await res.json();
}

// =====================
// 2. assign user to ticket
// =====================
export async function assignTicket(ticketId: number, userId: number) {
  const res = await fetch(`/api/tickets/${ticketId}/assign/${userId}`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to assign ticket");
  }

  if (res.status === 204) {
    return null;
  }
  return await res.json();
}
