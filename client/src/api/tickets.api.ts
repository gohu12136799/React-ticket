// =====================
// 1. handle the complete ticket
// =====================
export async function completeTicket(id: number) {
  const res = await fetch(`/api/tickets/${id}/complete`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to complete ticket");
  }

  if (res.status === 204) {
    return null;
  }
  return await res.json();
}

// =====================
// 2. handle the complete ticket
// =====================
export async function incompleteTicket(id: number) {
  const res = await fetch(`/api/tickets/${id}/complete`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to complete ticket");
  }

  if (res.status === 204) {
    return null;
  }
  return await res.json();
}

// =====================
// 3. handle add ticket
// =====================
export async function CreateTicket(params: { description: string }) {
  console.log("params", params);
  const res = await fetch(`/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to create ticket");
  }

  if (res.status === 204) {
    return null;
  }
  return await res.json();
}

// =====================
// 4. handle detail ticket
// =====================

export async function getTicketById(id: number) {
  const res = await fetch(`/api/tickets/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ticket details");
  }

  return await res.json();
}
