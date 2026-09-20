import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../apiClient";

export function useNotifications(token, isStaff, onRefreshTickets) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const sinceRef = useRef(new Date().toISOString());

  const openNotification = useCallback(
    async (item, onOpenTicket) => {
      try {
        await onOpenTicket(item.ticketId);
      } catch (err) {
        if (err.status === 404) {
          setNotifications((current) => current.filter((n) => n.id !== item.id));
          return;
        }
        throw err;
      }
    },
    [],
  );

  function markSeen() {
    setUnread(0);
    sinceRef.current = new Date().toISOString();
    setNotifications([]);
  }

  useEffect(() => {
    if (!token || !isStaff) return undefined;
    const tick = async () => {
      try {
        const data = await api(`/notifications?since=${encodeURIComponent(sinceRef.current)}`, {
          token,
        });
        if (data.notifications.length) {
          setNotifications((prev) => {
            const ids = new Set(prev.map((item) => item.id));
            const extra = data.notifications.filter((item) => !ids.has(item.id));
            if (extra.length) setUnread((n) => n + extra.length);
            return [...extra, ...prev].slice(0, 50);
          });
          onRefreshTickets();
        }
      } catch {
        return;
      }
    };
    tick();
    const id = setInterval(tick, 8000);
    return () => clearInterval(id);
  }, [onRefreshTickets, isStaff, token]);

  function clearNotifications() {
    setNotifications([]);
    setUnread(0);
  }

  return { notifications, unread, openNotification, markSeen, clearNotifications };
}
