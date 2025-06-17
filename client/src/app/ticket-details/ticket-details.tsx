import { Ticket, User } from "@acme/shared-models";
import {
  CloseOutlined,
  EllipsisOutlined,
  EyeFilled,
  LinkOutlined,
  MergeOutlined,
  TagsFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Image, Select, Spin, Tooltip } from "antd";
import Avatar from "antd/es/avatar/Avatar.js";
import { getTicketById } from "client/src/api/tickets.api";
import { assignTicket, getUserById } from "client/src/api/users.api";
import { handleToggleComplete } from "client/src/utils/ticketActions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalConfirmCompleted from "../components/modalConfirmCompleted/index";
import styles from "./ticket-details.module.css";
/* eslint-disable-next-line */
export interface TicketDetailsProps {
  users: User[];
}

export function TicketDetails(props: TicketDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectUser, setSelectUser] = useState<User | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const fetchTicket = async () => {
    if (!id) return;
    try {
      const data = await getTicketById(Number(id));
      setSelectedTicket(data);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserById(Number(selectedTicket?.assigneeId));
        setSelectUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchUser();
  }, [selectedTicket]);
  const handleAssign = async (ticketId: number, userId: number) => {
    try {
      await assignTicket(ticketId, userId);
    } catch (err) {
      console.error("Error assigning ticket:", err);
    }
  };

  const onTagClick = (id: number, completed: boolean) => {
    handleToggleComplete({
      id,
      completed,
      setLoadingId,
      fetchTickets: fetchTicket,
    });
  };

  const showConfirm = (id: number, completed: boolean) => {
    ModalConfirmCompleted({
      id,
      completed,
      onConfirm: () => onTagClick(id, completed),
    });
  };

  return (
    <>
      {/* Header ticket */}
      <div className={styles["ticket-header"]}>
        <div style={{ display: "flex", gap: "8px" }}>
          <TagsFilled style={{ color: "green" }} />
          <span style={{ color: "#8b8d89" }}>TICKET-{selectedTicket?.id}</span>
        </div>
        <div style={{ display: "flex" }}>
          <Button variant="text" color="default">
            <EyeFilled style={{ fontSize: 20 }} />
          </Button>
          <Button variant="text" color="default">
            <EllipsisOutlined style={{ fontSize: 20 }} />
          </Button>
          <Tooltip title="Go to home page">
            <Button
              variant="text"
              color="default"
              onClick={() => navigate("/", { state: { refetch: true } })}
            >
              <CloseOutlined style={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </div>
      </div>
      {/* Container ticket */}
      <div className={styles["container"]}>
        {/* Left ticket */}
        <div className={styles["ticket"]}>
          <h2 className={styles["title-ticket"]}>
            {selectedTicket?.description || "null"}
          </h2>

          <div style={{ display: "flex", gap: "8px" }}>
            <Button color="default" variant="filled">
              <LinkOutlined />
            </Button>
            <Button color="default" variant="filled">
              <MergeOutlined />
            </Button>
            <Button color="default" variant="filled">
              <EllipsisOutlined />
            </Button>
          </div>

          <div
            style={{ marginTop: "20px", lineHeight: "1.5", color: "#4b4c4a" }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className={styles["attachments-title"]}>Attchments</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Image
                width={100}
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              />
              <Image
                width={100}
                src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
              />
            </div>
          </div>
        </div>
        {/* Right ticket */}
        <div className={styles["info"]}>
          <div className={styles["status"]}>
            <p className={styles["status-title"]}>Status:</p>
            {selectedTicket &&
              typeof selectedTicket.completed === "boolean" && (
                <div>
                  {loadingId === selectedTicket?.id ? (
                    <Spin size="small" />
                  ) : (
                    <div
                      style={{
                        color: "white",
                        cursor: "pointer",
                        backgroundColor: selectedTicket?.completed
                          ? "#065906"
                          : "#c61212",
                        padding: "8px",
                        width: "fit-content",
                        borderRadius: "2px",
                      }}
                      onClick={() =>
                        showConfirm(
                          Number(id),
                          selectedTicket?.completed ?? false
                        )
                      }
                    >
                      {selectedTicket?.completed ? "Completed" : "Incompleted"}
                    </div>
                  )}
                </div>
              )}
          </div>
          <div className={styles["assignee"]}>
            <p className={styles["assignee-title"]}>Assignee:</p>
            <Select
              labelInValue
              value={
                selectUser
                  ? {
                      value: selectUser.id,
                      label: (
                        <div
                          className={styles["avatar"]}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Avatar
                            size="small"
                            style={{ backgroundColor: "#3931d4" }}
                            icon={<UserOutlined />}
                          />
                          <span>{selectUser.name}</span>
                        </div>
                      ),
                    }
                  : undefined
              }
              style={{ width: 200 }}
              onChange={(option) => {
                const userId = option.value;
                const user = props.users.find((u) => u.id === userId);
                setSelectUser(user || null);
                handleAssign(Number(id), Number(userId));
              }}
              options={props.users.map((user) => ({
                value: user.id,
                label: (
                  <div
                    className={styles["avatar"]}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Avatar
                      size="small"
                      style={{ backgroundColor: "#3931d4" }}
                      icon={<UserOutlined />}
                    />
                    <span>{user.name}</span>
                  </div>
                ),
              }))}
            />
          </div>
          <div className={styles["assignee"]}>
            <p className={styles["assignee-title"]}>Label:</p>
            <p style={{ color: "#8b8d89" }}>None</p>
          </div>
          <div className={styles["assignee"]}>
            <p className={styles["assignee-title"]}>Reporter:</p>
            <div className={styles["avatar"]}>
              <Avatar
                size="small"
                style={{ backgroundColor: "#70736e" }}
                icon={<UserOutlined />}
              />
              <div>Leader</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketDetails;
