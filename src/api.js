// ═══════════════════════════════════════════════
//  Nexus Pro — API Service Layer
//  Base URL configurable via env or default
// ═══════════════════════════════════════════════

export const BASE_URL = import.meta?.env?.VITE_API_URL || "http://115.124.114.201:6009";

// ─── Token helpers ────────────────────────────
export const getToken = () => localStorage.getItem("nexus_token");
export const setToken = (t) => localStorage.setItem("nexus_token", t);
export const getRefreshToken = () => localStorage.getItem("nexus_refresh");
export const setRefreshToken = (t) => localStorage.setItem("nexus_refresh", t);
export const clearTokens = () => { localStorage.removeItem("nexus_token"); localStorage.removeItem("nexus_refresh"); };

// ─── Core fetch wrapper ───────────────────────
async function req(method, path, body, isPublic = false) {
  const headers = { "Content-Type": "application/json" };
  if (!isPublic) {
    const tok = getToken();
    if (tok) headers["Authorization"] = `Bearer ${tok}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || json?.error || `Error ${res.status}`);
  return json?.data !== undefined ? json.data : json;
}

const get    = (p)       => req("GET",    p, null);
const post   = (p, b)    => req("POST",   p, b);
const patch  = (p, b)    => req("PATCH",  p, b);
const put    = (p, b)    => req("PUT",    p, b);
const del    = (p)       => req("DELETE", p, null);
const postPub = (p, b)   => req("POST",   p, b, true);

// ═══════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════
export const auth = {
  sendOtp:   (email)           => postPub("/api/auth/send-otp",   { email }),
  verifyOtp: (email, otp)      => postPub("/api/auth/verify-otp", { email, otp }),
  refresh:   (refreshToken)    => fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "X-Refresh-Token": refreshToken, "Content-Type": "application/json" }
  }).then(r => r.json()).then(j => j.data || j),
};

// ═══════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════
export const users = {
  me:          ()         => get("/api/users/me"),
  all:         ()         => get("/api/users"),
  leaderboard: ()         => get("/api/users/leaderboard"),
  byId:        (id)       => get(`/api/users/${id}`),
  create:      (data)     => post("/api/users", data),
  update:      (id, data) => patch(`/api/users/${id}`, data),
  deactivate:  (id)       => del(`/api/users/${id}`),
};

// ═══════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════
export const projects = {
  all:          ()                  => get("/api/projects"),
  byId:         (id)                => get(`/api/projects/${id}`),
  create:       (data)              => post("/api/projects", data),
  update:       (id, data)          => patch(`/api/projects/${id}`, data),
  delete:       (id)                => del(`/api/projects/${id}`),
  kanban:       (id)                => get(`/api/projects/${id}/kanban`),
  addMember:    (id, userId)        => post(`/api/projects/${id}/members/${userId}`, {}),
  manageTeam:   (id, team, uids)    => put(`/api/projects/${id}/team/${team}`, uids),
};

// ═══════════════════════════════════════════════
//  TASKS
// ═══════════════════════════════════════════════
export const tasks = {
  my:         ()            => get("/api/tasks/my"),
  all:        ()            => get("/api/tasks"),
  byId:       (id)          => get(`/api/tasks/${id}`),
  create:     (data)        => post("/api/tasks", data),
  update:     (id, data)    => patch(`/api/tasks/${id}`, data),
  markDone:   (id)          => post(`/api/tasks/${id}/done`, {}),
  moveKanban: (id, column)  => patch(`/api/tasks/${id}/kanban/${column}`, {}),
  delete:     (id)          => del(`/api/tasks/${id}`),
};

// ═══════════════════════════════════════════════
//  TEAMS
// ═══════════════════════════════════════════════
export const teams = {
  all:          ()                   => get("/api/teams"),
  byId:         (id)                 => get(`/api/teams/${id}`),
  create:       (data)               => post("/api/teams", data),
  addMember:    (teamId, userId)     => post(`/api/teams/${teamId}/members/${userId}`, {}),
  removeMember: (teamId, userId)     => del(`/api/teams/${teamId}/members/${userId}`),
};

// ═══════════════════════════════════════════════
//  CHAT
// ═══════════════════════════════════════════════
export const chat = {
  rooms:        ()                         => get("/api/chat/rooms"),
  roomById:     (id)                       => get(`/api/chat/rooms/${id}`),
  createRoom:   (data)                     => post("/api/chat/rooms", data),
  messages:     (roomId, page=0, size=50)  => get(`/api/chat/rooms/${roomId}/messages?page=${page}&size=${size}`),
  send:         (roomId, text, replyToId)  => post(`/api/chat/rooms/${roomId}/messages`, { text, replyToId }),
  edit:         (msgId, text)              => patch(`/api/chat/messages/${msgId}`, { text }),
  delete:       (msgId)                    => del(`/api/chat/messages/${msgId}`),
};

// ═══════════════════════════════════════════════
//  CALENDAR
// ═══════════════════════════════════════════════
export const calendar = {
  all:      ()                   => get("/api/calendar"),
  upcoming: ()                   => get("/api/calendar/upcoming"),
  range:    (from, to)           => get(`/api/calendar/range?from=${from}&to=${to}`),
  create:   (data)               => post("/api/calendar", data),
  delete:   (id)                 => del(`/api/calendar/${id}`),
};

// ═══════════════════════════════════════════════
//  POINTS & REDEEMS
// ═══════════════════════════════════════════════
export const points = {
  history:         ()       => get("/api/points/history"),
  myRedeems:       ()       => get("/api/points/redeems/my"),
  requestRedeem:   (data)   => post("/api/points/redeems", data),
};
export const redeems = {
  all:     ()    => get("/api/redeems"),
  approve: (id)  => post(`/api/redeems/${id}/approve`, {}),
  reject:  (id)  => post(`/api/redeems/${id}/reject`, {}),
};

// ═══════════════════════════════════════════════
//  INFRASTRUCTURE
// ═══════════════════════════════════════════════
export const servers = {
  all:    ()           => get("/api/servers"),
  stats:  ()           => get("/api/servers/stats"),
  byId:   (id)         => get(`/api/servers/${id}`),
  create: (data)       => post("/api/servers", data),
  update: (id, data)   => put(`/api/servers/${id}`, data),
  delete: (id)         => del(`/api/servers/${id}`),
};
export const databases = {
  all:    ()           => get("/api/databases"),
  byId:   (id)         => get(`/api/databases/${id}`),
  create: (data)       => post("/api/databases", data),
  update: (id, data)   => put(`/api/databases/${id}`, data),
  delete: (id)         => del(`/api/databases/${id}`),
};

// ═══════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════
export const dashboard = { get: () => get("/api/dashboard") };

// ═══════════════════════════════════════════════
//  WEBSOCKET (Chat)
// ═══════════════════════════════════════════════
export function connectWS(roomId, onMessage) {
  const wsBase = BASE_URL.replace(/^http/, "ws");
  const ws = new WebSocket(`${wsBase}/ws`);
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "subscribe", roomId }));
  };
  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch {}
  };
  return ws;
}
