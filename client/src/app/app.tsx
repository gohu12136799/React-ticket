import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Ticket, User } from "@acme/shared-models";

import styles from "./app.module.css";
import Tickets from "./tickets/tickets";
import TicketDetails from "./ticket-details/ticket-details";

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).

  async function fetchTickets() {
    const data = await fetch("/api/tickets").then();
    setTickets(await data.json());
  }
  useEffect(() => {
    async function fetchUsers() {
      const data = await fetch("/api/users").then();
      setUsers(await data.json());
    }

    fetchTickets();
    fetchUsers();
  }, []);

  return (
    <div className={styles["app"]}>
      <h1>Ticketing App</h1>
      <Routes>
        <Route
          path="/"
          element={
            <Tickets
              tickets={tickets}
              users={users}
              fetchTickets={fetchTickets}
            />
          }
        />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetails users={users} />} />
      </Routes>
    </div>
  );
};

export default App;
