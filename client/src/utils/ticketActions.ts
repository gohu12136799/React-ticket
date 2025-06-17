import { completeTicket, incompleteTicket } from "../api/tickets.api";

type HandleToggleCompleteProps = {
  id: number;
  completed: boolean;
  setLoadingId: (id: number | null) => void;
  fetchTickets: () => void;
};

export const handleToggleComplete = async ({
  id,
  completed,
  setLoadingId,
  fetchTickets,
}: HandleToggleCompleteProps) => {
  setLoadingId(id);
  try {
    if (completed) {
      await incompleteTicket(id);
    } else {
      await completeTicket(id);
    }
    await fetchTickets();
  } finally {
    setLoadingId(null);
  }
};
