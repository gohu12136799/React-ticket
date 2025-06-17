import { Ticket, User } from "@acme/shared-models";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Divider, Input, Modal, Spin, Table, Tag } from "antd";
import { CreateTicket } from "client/src/api/tickets.api";
import { handleToggleComplete } from "client/src/utils/ticketActions";
import { getAssigneeName } from "client/src/utils/user";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ModalConfirmCompleted from "../components/modalConfirmCompleted/index";
import styles from "./tickets.module.css";
export interface TicketsProps {
  tickets: Ticket[];
  users: User[];
  fetchTickets: () => void;
}

export function Tickets(props: TicketsProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [createModalLoading, setCreateModalLoading] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refetch) {
      props.fetchTickets();
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.refetch]);
  const onTagClick = (id: number, completed: boolean) => {
    handleToggleComplete({
      id,
      completed,
      setLoadingId,
      fetchTickets: props.fetchTickets,
    });
  };
  const handleCreateTicket = async () => {
    setCreateModalLoading(true);
    try {
      await CreateTicket({ description: description });
      props.fetchTickets();
    } finally {
      setCreateModalLoading(false);
      setDescription("");
    }
  };

  const showConfirm = (id: number, completed: boolean) => {
    ModalConfirmCompleted({
      id,
      completed,
      onConfirm: () => onTagClick(id, completed),
    });
  };
  const columns: TableProps<Ticket>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Assignee",
      dataIndex: "assigneeId",
      key: "assigneeId",
      render: (assigneeId) => (
        <div>{getAssigneeName(props.users, assigneeId)}</div>
      ),
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      filters: [
        {
          text: "Completed",
          value: true,
        },
        {
          text: "InCompleted",
          value: false,
        },
      ],
      onFilter: (value, record) =>
        record.completed.toString().indexOf(value as string) === 0,
      render: (_, record) =>
        loadingId === record.id ? (
          <Spin size="small" />
        ) : (
          <Tag
            color={record.completed ? "green" : "red"}
            onClick={() => showConfirm(record.id, record.completed)}
            style={{ cursor: "pointer" }}
          >
            {record.completed ? "Completed" : "Incompleted"}
          </Tag>
        ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <div
          onClick={() => navigate(`/${record.id}`)}
          style={{ cursor: "pointer" }}
        >
          <EyeOutlined />
        </div>
      ),
    },
  ];
  return (
    <div className={styles["tickets"]}>
      <div className={styles["header-tickets"]}>
        <h2>List of Tickets</h2>
        <Button
          color="default"
          variant="outlined"
          onClick={() => setOpenCreateTicket(true)}
        >
          <PlusOutlined /> Add Tickets
        </Button>
      </div>

      {props.tickets ? (
        <Table<Ticket>
          columns={columns}
          dataSource={props.tickets}
          rowKey="id"
        />
      ) : (
        <span>No tickets</span>
      )}

      {/* modal create ticket */}
      <Modal
        title="Create Ticket"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openCreateTicket}
        onOk={() => {
          handleCreateTicket();
          setOpenCreateTicket(false);
        }}
        confirmLoading={createModalLoading}
        onCancel={() => setOpenCreateTicket(false)}
        okButtonProps={{ disabled: !description.trim() }}
      >
        <Divider style={{ margin: 0 }} />
        <div>
          <p>Description</p>
          <Input
            placeholder="Ticket description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Divider />
      </Modal>
    </div>
  );
}

export default Tickets;
