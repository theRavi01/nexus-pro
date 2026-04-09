import { useState, useEffect, useRef, useCallback } from "react";
import * as API from "./api";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES  (injected once)
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg0:#0d0f14;--bg1:#12151c;--bg2:#171b25;--bg3:#1e2330;--bg4:#242a38;
  --tx0:#e8eaf0;--tx1:#9ba3b8;--tx2:#5a6280;--tx3:#363d55;
  --br:#242a38;--br2:#2e3548;
  --acc:#4f8ef7;--acc2:#6fa3ff;--acc-bg:rgba(79,142,247,.1);--acc-glow:rgba(79,142,247,.25);
  --grn:#22d3a2;--grn-bg:rgba(34,211,162,.1);--grn2:#10b981;
  --amb:#f59e0b;--amb-bg:rgba(245,158,11,.1);
  --red:#f43f5e;--red-bg:rgba(244,63,94,.1);
  --pur:#a78bfa;--pur-bg:rgba(167,139,250,.1);
  --cyn:#22d3ee;--cyn-bg:rgba(34,211,238,.1);
  --pnk:#ec4899;--pnk-bg:rgba(236,72,153,.1);
  --r:10px;--rs:7px;
  --sh:0 1px 3px rgba(0,0,0,.4);
  --sh-md:0 4px 16px rgba(0,0,0,.4),0 1px 4px rgba(0,0,0,.3);
  --sh-lg:0 12px 48px rgba(0,0,0,.6),0 4px 16px rgba(0,0,0,.4);
}
body{font-family:'Sora',system-ui,sans-serif;background:var(--bg0);min-height:100vh;color:var(--tx0);line-height:1.5;}
code,kbd,.mono{font-family:'JetBrains Mono',monospace;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:4px;}

/* ── LAYOUT ── */
.app-wrap{display:flex;height:100vh;overflow:hidden;}
.sidebar{width:230px;background:var(--bg1);border-right:1px solid var(--br);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;}
.main{flex:1;overflow-y:auto;background:var(--bg0);}
.main-inner{padding:24px;display:flex;flex-direction:column;gap:16px;min-height:100%;}

/* ── SIDEBAR ── */
.sb-brand{padding:18px 16px;border-bottom:1px solid var(--br);display:flex;align-items:center;gap:10px;}
.sb-logo{width:32px;height:32px;background:linear-gradient(135deg,var(--acc),var(--pur));border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800;flex-shrink:0;}
.sb-brand-n{font-size:15px;font-weight:800;color:var(--tx0);letter-spacing:-.4px;}
.sb-brand-s{font-size:10px;color:var(--tx2);text-transform:uppercase;letter-spacing:.06em;font-weight:600;}
.nav-sec{font-size:9px;color:var(--tx3);padding:16px 16px 5px;text-transform:uppercase;letter-spacing:.1em;font-weight:700;}
.nav-item{display:flex;align-items:center;gap:9px;padding:8px 12px;font-size:12.5px;color:var(--tx2);cursor:pointer;transition:.12s;margin:1px 8px;border-radius:var(--rs);white-space:nowrap;font-weight:600;position:relative;border:none;background:none;width:calc(100% - 16px);text-align:left;}
.nav-item:hover{background:var(--bg3);color:var(--tx0);}
.nav-item.active{background:var(--acc-bg);color:var(--acc);}
.nav-item.active::before{content:'';position:absolute;left:-8px;top:50%;transform:translateY(-50%);width:3px;height:60%;background:var(--acc);border-radius:2px;}
.nav-icon{font-size:13px;width:20px;text-align:center;flex-shrink:0;}
.nav-badge{margin-left:auto;background:var(--red);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:20px;min-width:18px;text-align:center;}
.sb-user{margin-top:auto;padding:12px 14px;border-top:1px solid var(--br);}
.sb-user-row{display:flex;align-items:center;gap:9px;}
.logout-lnk{font-size:11px;color:var(--red);cursor:pointer;margin-top:8px;display:inline-block;font-weight:600;background:none;border:none;}
.logout-lnk:hover{text-decoration:underline;}

/* ── TOPBAR ── */
.topbar{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.topbar-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.pg-title{font-size:22px;font-weight:800;color:var(--tx0);letter-spacing:-.5px;line-height:1.2;}
.pg-sub{font-size:12px;color:var(--tx2);margin-top:3px;}
.pg-back{font-size:12px;color:var(--acc);cursor:pointer;margin-bottom:4px;font-weight:600;display:inline-flex;align-items:center;gap:4px;background:none;border:none;}
.pg-back:hover{text-decoration:underline;}

/* ── CARDS ── */
.card{background:var(--bg1);border:1px solid var(--br);border-radius:var(--r);padding:18px;box-shadow:var(--sh);}
.card-title{font-size:12px;font-weight:700;color:var(--tx1);margin-bottom:14px;display:flex;align-items:center;gap:6px;text-transform:uppercase;letter-spacing:.06em;}

/* ── STAT CARDS ── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.stats-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.stats-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
.stat-card{background:var(--bg1);border:1px solid var(--br);border-radius:var(--r);padding:16px;box-shadow:var(--sh);position:relative;overflow:hidden;transition:.2s;}
.stat-card:hover{border-color:var(--br2);transform:translateY(-1px);}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent-line,var(--acc));opacity:.6;}
.stat-lbl{font-size:10px;color:var(--tx2);margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;}
.stat-val{font-size:28px;font-weight:800;color:var(--tx0);line-height:1;letter-spacing:-.8px;}
.stat-sub{font-size:11px;color:var(--tx2);margin-top:6px;}
.stat-icon{font-size:20px;margin-bottom:10px;}

/* ── BADGES ── */
.badge{font-size:10px;padding:3px 9px;border-radius:20px;font-weight:700;display:inline-block;text-transform:uppercase;letter-spacing:.04em;}
.b-admin{background:rgba(236,72,153,.15);color:#f9a8d4;}
.b-ADMIN{background:rgba(236,72,153,.15);color:#f9a8d4;}
.b-manager{background:var(--acc-bg);color:var(--acc2);}
.b-MANAGER{background:var(--acc-bg);color:var(--acc2);}
.b-tl{background:var(--grn-bg);color:var(--grn);}
.b-TL{background:var(--grn-bg);color:var(--grn);}
.b-employee{background:var(--amb-bg);color:var(--amb);}
.b-DEV{background:var(--amb-bg);color:var(--amb);}
.b-frontend{background:var(--pur-bg);color:var(--pur);}
.b-FRONTEND{background:var(--pur-bg);color:var(--pur);}
.b-backend{background:var(--cyn-bg);color:var(--cyn);}
.b-BACKEND{background:var(--cyn-bg);color:var(--cyn);}
.b-fullstack{background:rgba(34,211,162,.15);color:var(--grn);}
.b-FULLSTACK{background:rgba(34,211,162,.15);color:var(--grn);}
.b-designer{background:rgba(236,72,153,.15);color:var(--pnk);}
.b-devops{background:rgba(245,158,11,.15);color:var(--amb);}
.b-DEVOPS{background:rgba(245,158,11,.15);color:var(--amb);}
.b-QA{background:var(--pur-bg);color:var(--pur);}
.b-done{background:var(--grn-bg);color:var(--grn);}
.b-pending{background:var(--amb-bg);color:var(--amb);}
.b-approved{background:var(--grn-bg);color:var(--grn);}
.b-APPROVED{background:var(--grn-bg);color:var(--grn);}
.b-rejected{background:var(--red-bg);color:var(--red);}
.b-REJECTED{background:var(--red-bg);color:var(--red);}
.b-PENDING{background:var(--amb-bg);color:var(--amb);}
.b-critical{background:rgba(244,63,94,.2);color:#fca5a5;}
.b-high{background:var(--red-bg);color:var(--red);}
.b-medium{background:var(--amb-bg);color:var(--amb);}
.b-low{background:var(--grn-bg);color:var(--grn);}
.b-online{background:var(--grn-bg);color:var(--grn);}
.b-offline{background:var(--red-bg);color:var(--red);}
.b-warning{background:var(--amb-bg);color:var(--amb);}
.b-active{background:var(--grn-bg);color:var(--grn);}
.b-inactive{background:var(--bg3);color:var(--tx2);}
.b-holiday{background:rgba(236,72,153,.15);color:var(--pnk);}
.b-event{background:var(--acc-bg);color:var(--acc);}
.b-meeting{background:var(--pur-bg);color:var(--pur);}
.b-public{background:var(--acc-bg);color:var(--acc);}
.b-team{background:var(--grn-bg);color:var(--grn);}
.b-project{background:var(--pur-bg);color:var(--pur);}
.b-announcement{background:var(--amb-bg);color:var(--amb);}
.pts-chip{background:rgba(34,211,162,.12);color:var(--grn);padding:7px 14px;border-radius:20px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(34,211,162,.2);}

/* ── STATUS DOTS ── */
.status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;display:inline-block;}
.sd-grn{background:var(--grn);box-shadow:0 0 6px var(--grn);}
.sd-red{background:var(--red);box-shadow:0 0 6px var(--red);}
.sd-amb{background:var(--amb);box-shadow:0 0 6px var(--amb);}
.sd-gray{background:var(--tx3);}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(.85);}}
.pulse{animation:pulse 2s infinite;}

/* ── BUTTONS ── */
.btn{padding:8px 16px;border-radius:var(--rs);font-size:13px;font-weight:700;cursor:pointer;border:none;transition:.15s;display:inline-flex;align-items:center;gap:6px;font-family:inherit;white-space:nowrap;}
.btn:hover{opacity:.88;transform:translateY(-1px);}
.btn:active{transform:translateY(0);}
.btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}
.btn-pri{background:linear-gradient(135deg,var(--acc),#6366f1);color:#fff;box-shadow:0 2px 12px var(--acc-glow);}
.btn-grn{background:var(--grn);color:#0d0f14;font-weight:800;}
.btn-red{background:var(--red);color:#fff;}
.btn-amb{background:var(--amb);color:#0d0f14;font-weight:800;}
.btn-ghost{background:var(--bg3);color:var(--tx0);border:1px solid var(--br2);}
.btn-ghost:hover{background:var(--bg4);}
.btn-sm{padding:5px 12px;font-size:11px;border-radius:20px;}
.btn-xs{padding:3px 8px;font-size:10px;border-radius:20px;}
.icon-btn{width:34px;height:34px;border-radius:var(--rs);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;border:1px solid var(--br2);background:var(--bg3);color:var(--tx1);font-size:14px;transition:.13s;}
.icon-btn:hover{background:var(--bg4);color:var(--tx0);}

/* ── FORMS ── */
.fg{margin-bottom:14px;}
.fl-lbl{font-size:10px;color:var(--tx2);margin-bottom:6px;display:block;font-weight:700;text-transform:uppercase;letter-spacing:.07em;}
.fc{width:100%;padding:10px 13px;border:1.5px solid var(--br2);border-radius:var(--rs);font-size:13px;color:var(--tx0);background:var(--bg2);outline:none;font-family:inherit;transition:.15s;}
.fc:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-bg);}
.fc::placeholder{color:var(--tx3);}
textarea.fc{resize:vertical;min-height:75px;}
select.fc option{background:var(--bg2);}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}

/* ── TABLES ── */
.tbl{width:100%;border-collapse:collapse;font-size:13px;}
.tbl th{font-size:10px;color:var(--tx2);font-weight:700;padding:8px 13px;text-align:left;border-bottom:1px solid var(--br);white-space:nowrap;text-transform:uppercase;letter-spacing:.07em;}
.tbl td{padding:12px 13px;border-bottom:1px solid var(--br);color:var(--tx0);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tbody tr:hover td{background:var(--bg2);}

/* ── MODAL ── */
.modal-ov{display:flex;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
.modal-box{background:var(--bg1);border:1px solid var(--br2);border-radius:14px;padding:30px;width:560px;max-width:96vw;max-height:92vh;overflow-y:auto;box-shadow:var(--sh-lg);animation:modal-in .2s ease;}
.modal-lg{width:720px!important;}
.modal-xl{width:900px!important;}
@keyframes modal-in{from{opacity:0;transform:scale(.95) translateY(12px);}to{opacity:1;transform:none;}}
.modal-title{font-size:18px;font-weight:800;color:var(--tx0);margin-bottom:20px;letter-spacing:-.4px;}
.modal-footer{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--br);}

/* ── TOAST ── */
@keyframes toast-in{from{opacity:0;transform:translateX(100%);}to{opacity:1;transform:none;}}
.toast{position:fixed;bottom:24px;right:24px;background:var(--bg2);border:1px solid var(--br2);border-radius:10px;padding:12px 18px;font-size:13px;font-weight:600;color:var(--tx0);box-shadow:var(--sh-md);animation:toast-in .25s ease;z-index:999;}
.t-grn{border-color:rgba(34,211,162,.3);color:var(--grn);}
.t-red{border-color:rgba(244,63,94,.3);color:var(--red);}
.t-amb{border-color:rgba(245,158,11,.3);color:var(--amb);}
.t-acc{border-color:rgba(79,142,247,.3);color:var(--acc2);}

/* ── TASKS ── */
.task-card{background:var(--bg1);border:1px solid var(--br);border-radius:var(--r);padding:14px 16px;display:flex;align-items:center;gap:12px;transition:.15s;cursor:pointer;}
.task-card:hover{border-color:var(--br2);box-shadow:var(--sh-md);transform:translateY(-1px);}
.task-card.overdue{border-left:3px solid var(--red);}
.task-card.due-soon{border-left:3px solid var(--amb);}
.task-card.on-track{border-left:3px solid var(--grn);}
.task-card.done{border-left:3px solid var(--tx3);opacity:.65;}
.task-list{display:flex;flex-direction:column;gap:8px;}
.task-info{flex:1;min-width:0;}
.task-name{font-size:13px;font-weight:700;color:var(--tx0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.task-meta{font-size:11px;color:var(--tx2);margin-top:3px;}
.task-right{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0;}
.countdown{font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;font-family:'JetBrains Mono',monospace;}
.cd-red{background:var(--red-bg);color:var(--red);border:1px solid rgba(244,63,94,.2);}
.cd-amb{background:var(--amb-bg);color:var(--amb);border:1px solid rgba(245,158,11,.2);}
.cd-grn{background:var(--grn-bg);color:var(--grn);border:1px solid rgba(34,211,162,.2);}
.cd-teal{background:var(--cyn-bg);color:var(--cyn);border:1px solid rgba(34,211,238,.2);}
.pts-badge{font-size:11px;color:var(--tx2);font-weight:700;}

/* ── PROJECTS ── */
.proj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.proj-card{background:var(--bg1);border:1px solid var(--br);border-radius:var(--r);padding:20px;cursor:pointer;transition:.15s;position:relative;overflow:hidden;}
.proj-card:hover{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc),var(--sh-md);transform:translateY(-2px);}
.proj-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--proj-color,linear-gradient(90deg,var(--acc),var(--pur)));}
.proj-name{font-size:15px;font-weight:800;color:var(--tx0);margin-bottom:5px;letter-spacing:-.3px;}
.proj-desc{font-size:12px;color:var(--tx2);margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.6;}
.proj-foot{display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--tx2);font-weight:600;}

/* ── KANBAN ── */
.kanban-wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;align-items:start;}
.kanban-col{background:var(--bg2);border:1px solid var(--br);border-radius:var(--r);min-height:200px;}
.kanban-col-hdr{padding:12px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--br);}
.kanban-col-title{font-size:12px;font-weight:800;color:var(--tx0);text-transform:uppercase;letter-spacing:.06em;}
.kanban-count{background:var(--bg3);color:var(--tx2);font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700;}
.kanban-cards{padding:10px;display:flex;flex-direction:column;gap:8px;}
.kcard{background:var(--bg1);border:1px solid var(--br);border-radius:var(--rs);padding:12px;cursor:pointer;transition:.12s;}
.kcard:hover{border-color:var(--br2);box-shadow:var(--sh);}
.kcard-title{font-size:12px;font-weight:700;color:var(--tx0);margin-bottom:6px;}
.kcard-meta{font-size:10px;color:var(--tx2);display:flex;align-items:center;gap:6px;}

/* ── INFRA ── */
.infra-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.server-card{background:var(--bg1);border:1px solid var(--br);border-radius:var(--r);padding:18px;cursor:pointer;transition:.15s;position:relative;}
.server-card:hover{box-shadow:var(--sh-md);transform:translateY(-2px);}
.server-card.sv-online{border-top:3px solid var(--grn);}
.server-card.sv-offline{border-top:3px solid var(--red);}
.server-card.sv-warning{border-top:3px solid var(--amb);}
.server-name{font-size:14px;font-weight:800;color:var(--tx0);margin-bottom:3px;}
.server-url{font-size:11px;color:var(--tx2);font-family:'JetBrains Mono',monospace;margin-bottom:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.server-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;}
.sv-metric{background:var(--bg2);border-radius:var(--rs);padding:9px;text-align:center;}
.sv-metric-val{font-size:17px;font-weight:800;color:var(--tx0);font-family:'JetBrains Mono',monospace;}
.sv-metric-lbl{font-size:9px;color:var(--tx2);text-transform:uppercase;letter-spacing:.06em;margin-top:3px;font-weight:700;}
.prog-wrap{background:var(--bg3);border-radius:20px;height:5px;overflow:hidden;margin-top:4px;}
.prog-bar{height:100%;border-radius:20px;transition:width .5s ease;}
.pb-grn{background:var(--grn);}
.pb-amb{background:var(--amb);}
.pb-red{background:var(--red);}
.pb-acc{background:var(--acc);}
.db-card{background:var(--bg1);border:1px solid var(--br);border-radius:var(--r);padding:18px;cursor:pointer;transition:.15s;}
.db-card:hover{border-color:var(--br2);box-shadow:var(--sh-md);transform:translateY(-2px);}
.db-name{font-size:14px;font-weight:800;color:var(--tx0);margin-bottom:2px;}
.db-host{font-size:11px;color:var(--tx2);font-family:'JetBrains Mono',monospace;margin-bottom:10px;}
.db-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px;}
.db-stat{background:var(--bg2);border-radius:var(--rs);padding:8px;text-align:center;}
.db-stat-v{font-size:15px;font-weight:800;color:var(--tx0);font-family:'JetBrains Mono',monospace;}
.db-stat-l{font-size:9px;color:var(--tx2);margin-top:1px;font-weight:700;}
.terminal{background:#060810;border:1px solid #1e2535;border-radius:var(--r);padding:16px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#7ca7d3;max-height:200px;overflow-y:auto;line-height:1.7;}

/* ── CHAT ── */
.chat-wrap{display:flex;height:100%;overflow:hidden;}
.chat-sidebar{width:240px;border-right:1px solid var(--br);display:flex;flex-direction:column;background:var(--bg1);flex-shrink:0;}
.chat-room-item{padding:10px 14px;cursor:pointer;transition:.12s;display:flex;align-items:center;gap:9px;border-radius:var(--rs);margin:2px 6px;}
.chat-room-item:hover{background:var(--bg3);}
.chat-room-item.active{background:var(--acc-bg);}
.chat-room-name{font-size:13px;font-weight:600;color:var(--tx0);}
.chat-room-last{font-size:11px;color:var(--tx2);}
.chat-area{flex:1;display:flex;flex-direction:column;background:var(--bg0);overflow:hidden;}
.chat-header{padding:14px 18px;border-bottom:1px solid var(--br);display:flex;align-items:center;gap:10px;background:var(--bg1);flex-shrink:0;}
.chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}
.msg-row{display:flex;gap:10px;align-items:flex-start;}
.msg-row.mine{flex-direction:row-reverse;}
.msg-bubble{background:var(--bg2);border:1px solid var(--br);border-radius:12px;padding:10px 14px;max-width:70%;font-size:13px;line-height:1.5;}
.msg-bubble.mine{background:var(--acc-bg);border-color:rgba(79,142,247,.25);color:var(--acc2);}
.msg-meta{font-size:10px;color:var(--tx2);margin-top:4px;}
.chat-input-row{padding:12px 16px;border-top:1px solid var(--br);display:flex;gap:8px;background:var(--bg1);flex-shrink:0;}
.chat-input{flex:1;background:var(--bg2);border:1px solid var(--br2);border-radius:var(--rs);padding:10px 14px;color:var(--tx0);font-family:inherit;font-size:13px;outline:none;resize:none;}
.chat-input:focus{border-color:var(--acc);}

/* ── CALENDAR ── */
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;}
.cal-hdr{font-size:10px;color:var(--tx2);text-align:center;padding:6px 2px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
.cal-day{background:var(--bg2);border:1px solid var(--br);border-radius:var(--rs);padding:8px 6px;min-height:72px;cursor:pointer;transition:.12s;position:relative;}
.cal-day:hover{border-color:var(--br2);background:var(--bg3);}
.cal-day.today{border-color:var(--acc);background:var(--acc-bg);}
.cal-day.has-holiday{background:rgba(236,72,153,.05);border-color:rgba(236,72,153,.2);}
.cal-day.other-month{background:transparent;border-color:transparent;}
.cal-day-num{font-size:12px;font-weight:700;color:var(--tx0);margin-bottom:4px;}
.cal-day.today .cal-day-num{color:var(--acc);}
.cal-event-dot{font-size:9px;padding:2px 5px;border-radius:4px;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}

/* ── POINTS ── */
.ph-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--br);}
.ph-item:last-child{border-bottom:none;}
.ph-pos{color:var(--grn);font-weight:700;font-family:'JetBrains Mono',monospace;}
.ph-neg{color:var(--red);font-weight:700;font-family:'JetBrains Mono',monospace;}
.ph-blue{color:var(--acc);font-weight:700;font-family:'JetBrains Mono',monospace;}

/* ── LEADERBOARD ── */
.lb-row{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--br);}
.lb-row:last-child{border-bottom:none;}
.lb-rank{font-size:12px;color:var(--tx2);width:22px;font-weight:700;text-align:center;}
.lb-name{flex:1;font-size:13px;color:var(--tx0);font-weight:600;}
.lb-bar-w{width:80px;height:4px;background:var(--bg3);border-radius:3px;overflow:hidden;}
.lb-bar{height:100%;border-radius:3px;transition:width .6s ease;}
.lb-pts{font-size:12px;color:var(--tx1);width:60px;text-align:right;font-weight:700;font-family:'JetBrains Mono',monospace;}

/* ── TEAMS ── */
.team-section{background:var(--bg2);border:1px solid var(--br);border-radius:var(--r);padding:16px;margin-bottom:10px;}
.team-section-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
.member-card{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--br);}
.member-card:last-child{border-bottom:none;}
.member-info{flex:1;min-width:0;}
.member-name{font-size:13px;font-weight:700;color:var(--tx0);}
.member-title{font-size:11px;color:var(--tx2);}

/* ── MISC ── */
.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;}
.av-md{width:34px;height:34px;font-size:11px;}
.av-sm{width:28px;height:28px;font-size:10px;}
.av-xs{width:24px;height:24px;font-size:8px;}
.av-lg{width:48px;height:48px;font-size:16px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start;}
.two-col-wide{display:grid;grid-template-columns:2fr 1fr;gap:16px;align-items:start;}
.two-col-chat{display:flex;height:100%;}
.sec-title{font-size:14px;font-weight:800;color:var(--tx0);letter-spacing:-.3px;}
.empty-state{text-align:center;padding:40px 20px;color:var(--tx2);}
.empty-icon{font-size:32px;margin-bottom:8px;}
.empty-title{font-size:14px;font-weight:700;color:var(--tx1);margin-bottom:4px;}
.loading{display:flex;align-items:center;justify-content:center;padding:40px;color:var(--tx2);gap:8px;}
.banner-info{background:var(--acc-bg);border:1px solid rgba(79,142,247,.2);border-radius:var(--r);padding:14px 18px;}
.section-divider{display:flex;align-items:center;gap:10px;margin:14px 0;font-size:11px;color:var(--tx2);font-weight:700;text-transform:uppercase;letter-spacing:.07em;}
.section-divider::before,.section-divider::after{content:'';flex:1;height:1px;background:var(--br);}
.chip{background:var(--bg3);color:var(--tx1);font-size:10px;padding:2px 8px;border-radius:20px;font-weight:600;border:1px solid var(--br);}

/* ── LOGIN ── */
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;background:radial-gradient(ellipse at 30% 20%,rgba(79,142,247,.08) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(34,211,162,.06) 0%,transparent 60%),var(--bg0);}
.login-box{background:var(--bg1);border:1px solid var(--br2);border-radius:16px;padding:42px 38px;width:420px;max-width:100%;box-shadow:var(--sh-lg);}
.login-brand{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
.brand-mark{width:40px;height:40px;background:linear-gradient(135deg,var(--acc),var(--pur));border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;box-shadow:0 4px 16px var(--acc-glow);}
.brand-name{font-size:22px;font-weight:800;letter-spacing:-.5px;}
.brand-tag{font-size:11px;color:var(--tx2);margin-bottom:30px;letter-spacing:.08em;text-transform:uppercase;}
.login-lbl{font-size:10px;color:var(--tx2);font-weight:700;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em;}
.login-group{margin-bottom:14px;}
.fi{width:100%;padding:11px 14px;border:1.5px solid var(--br2);border-radius:var(--rs);font-size:13.5px;color:var(--tx0);outline:none;font-family:inherit;background:var(--bg2);transition:.15s;}
.fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-bg);}
.fi::placeholder{color:var(--tx3);}
.login-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--acc),var(--pur));color:#fff;border:none;border-radius:var(--rs);font-size:14px;font-weight:700;cursor:pointer;margin-top:8px;letter-spacing:.3px;transition:.2s;font-family:inherit;box-shadow:0 4px 20px var(--acc-glow);}
.login-btn:hover{opacity:.92;transform:translateY(-1px);}
.login-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.login-err{font-size:12px;color:var(--red);margin-top:10px;text-align:center;background:var(--red-bg);padding:9px;border-radius:var(--rs);border:1px solid rgba(244,63,94,.2);}
.login-info{font-size:12px;color:var(--acc);margin-top:10px;text-align:center;background:var(--acc-bg);padding:9px;border-radius:var(--rs);border:1px solid rgba(79,142,247,.2);}
.demo-wrap{margin-top:24px;padding-top:20px;border-top:1px solid var(--br);}
.demo-lbl{font-size:10px;color:var(--tx2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;font-weight:700;}
.demo-chips{display:flex;flex-wrap:wrap;gap:6px;}
.demo-chip{font-size:11px;padding:7px 14px;background:var(--bg3);border:1px solid var(--br2);border-radius:20px;cursor:pointer;color:var(--tx1);transition:.15s;font-family:inherit;font-weight:600;}
.demo-chip:hover{background:var(--bg4);border-color:var(--acc);color:var(--acc);}
@media(max-width:900px){
  .stats-grid{grid-template-columns:repeat(2,1fr);}
  .proj-grid,.infra-grid,.two-col,.two-col-wide,.kanban-wrap{grid-template-columns:1fr;}
  .sidebar{width:200px;}
  .grid2,.grid3{grid-template-columns:1fr;}
}
`;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const todayStr  = () => new Date().toISOString().slice(0,10);
const ini = (n) => String(n||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const avStyle = (color="#4f8ef7") => ({ background:`${color}22`, color });
const rl  = (r) => ({ ADMIN:"Admin", MANAGER:"Manager", TL:"Team Lead", DEV:"Employee", admin:"Admin", manager:"Manager", tl:"Team Lead", employee:"Employee" }[r] || r || "");
const trl = (t) => ({ FRONTEND:"Frontend", BACKEND:"Backend", DESIGNER:"Designer", DEVOPS:"DevOps", FULLSTACK:"Full Stack", QA:"QA", frontend:"Frontend", backend:"Backend", designer:"Designer", devops:"DevOps", fullstack:"Full Stack" }[t] || t || "");

function cdText(dl) {
  if (!dl) return { cls:"cd-gray", txt:"No date", sc:"on-track" };
  const today = todayStr();
  const now = new Date();
  const dlDate = new Date(dl+"T23:59:59");
  const diffMs = dlDate - now;
  const diffD = Math.ceil(diffMs / 86400000);
  if (dl < today) return { cls:"cd-red", txt:`${Math.abs(diffD)}d overdue`, sc:"overdue" };
  if (diffD <= 1) return { cls:"cd-amb", txt:`${Math.ceil(diffMs/3600000)}h left`, sc:"due-soon" };
  return { cls:"cd-grn", txt:`${diffD}d left`, sc:"on-track" };
}

function fmtDateShort(s) {
  if (!s) return "—";
  try { return new Date(s+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}); }
  catch { return s; }
}
function fmtDate(d) {
  return d.toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
}
function addDays(base, n) {
  const d = new Date(base+"T00:00:00");
  d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}
function pbClass(v) { return v>80?"pb-red":v>60?"pb-amb":"pb-grn"; }
function fmtUptime(sec) {
  if (!sec) return "—";
  const d = Math.floor(sec/86400);
  const h = Math.floor((sec%86400)/3600);
  return d>0 ? `${d}d ${h}h` : `${h}h`;
}
function dbIcon(type) {
  return { postgresql:"🐘", mysql:"🐬", redis:"🔴", mongodb:"🍃", sqlite:"💿" }[type] || "🗄";
}

/* ═══════════════════════════════════════════════
   TOAST HOOK
═══════════════════════════════════════════════ */
function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const show = useCallback((msg, cls="") => {
    setToast({ msg, cls });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 3400);
  }, []);
  const Toast = toast ? (
    <div className={`toast ${toast.cls}`}>{toast.msg}</div>
  ) : null;
  return { show, Toast };
}

/* ═══════════════════════════════════════════════
   MODAL HOOK
═══════════════════════════════════════════════ */
function useModal() {
  const [modal, setModal] = useState(null);
  const open  = useCallback((content, size="") => setModal({ content, size }), []);
  const close = useCallback(() => setModal(null), []);
  const Modal = modal ? (
    <div className="modal-ov" onClick={e => { if (e.target.classList.contains("modal-ov")) close(); }}>
      <div className={`modal-box ${modal.size}`}>{modal.content}</div>
    </div>
  ) : null;
  return { open, close, Modal };
}

/* ═══════════════════════════════════════════════
   AVATAR
═══════════════════════════════════════════════ */
function Av({ name, color, size="av-sm" }) {
  return (
    <div className={`avatar ${size}`} style={avStyle(color)}>
      {ini(name)}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [step, setStep]   = useState("email"); // email | otp
  const [email, setEmail] = useState("");
  const [otp, setOtp]     = useState("");
  const [err, setErr]     = useState("");
  const [info, setInfo]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email.trim()) { setErr("Email is required."); return; }
    setLoading(true); setErr(""); setInfo("");
    try {
      await API.auth.sendOtp(email.trim());
      setInfo(`OTP sent to ${email}. Check your inbox.`);
      setStep("otp");
    } catch(ex) {
      setErr(ex.message || "Failed to send OTP.");
    } finally { setLoading(false); }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp.trim()) { setErr("OTP is required."); return; }
    setLoading(true); setErr("");
    try {
      const res = await API.auth.verifyOtp(email.trim(), otp.trim());
      API.setToken(res.accessToken || res.token);
      if (res.refreshToken) API.setRefreshToken(res.refreshToken);
      // fetch current user
      const me = await API.users.me();
      onLogin(me);
    } catch(ex) {
      setErr(ex.message || "Invalid OTP. Please try again.");
    } finally { setLoading(false); }
  }

  // Demo: directly set a mock token and user for demo purposes
  function demoLogin(role, name, color) {
    // Use a mock token so UI can be demoed without a live backend
    API.setToken("demo-token-"+role);
    onLogin({ id:`demo-${role}`, name, email:`${role.toLowerCase()}@nexus.com`, role, color,
      track: role==="DEV"?"frontend":"FULLSTACK", title: rl(role), pts:740, earned:900, redeemed:0, active:true });
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-brand">
          <div className="brand-mark">N</div>
          <div className="brand-name">Nexus Pro</div>
        </div>
        <div className="brand-tag">Company OS · Sign in to continue</div>

        {step === "email" ? (
          <form onSubmit={handleSendOtp}>
            <div className="login-group">
              <label className="login-lbl">Work Email</label>
              <input className="fi" type="email" placeholder="you@company.com"
                value={email} onChange={e=>setEmail(e.target.value)} autoFocus />
            </div>
            {err && <div className="login-err">{err}</div>}
            {info && <div className="login-info">{info}</div>}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send OTP →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{fontSize:12,color:"var(--tx2)",marginBottom:14}}>
              OTP sent to <strong style={{color:"var(--acc)"}}>{email}</strong>
              <button type="button" onClick={()=>{setStep("email");setErr("");setInfo("");}}
                style={{marginLeft:8,background:"none",border:"none",color:"var(--acc)",cursor:"pointer",fontSize:11,fontWeight:700}}>
                Change ↩
              </button>
            </div>
            <div className="login-group">
              <label className="login-lbl">Enter OTP</label>
              <input className="fi" type="text" placeholder="6-digit code" maxLength={10}
                value={otp} onChange={e=>setOtp(e.target.value)} autoFocus />
            </div>
            {err && <div className="login-err">{err}</div>}
            {info && <div className="login-info">{info}</div>}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Verifying…" : "Verify & Sign In →"}
            </button>
          </form>
        )}

        <div className="demo-wrap">
          <div className="demo-lbl">Quick Demo Access</div>
          <div className="demo-chips">
            <button className="demo-chip" onClick={()=>demoLogin("ADMIN","Aarav Kumar","#4f8ef7")}>🔑 Admin</button>
            <button className="demo-chip" onClick={()=>demoLogin("MANAGER","Priya Sharma","#22d3a2")}>📊 Manager</button>
            <button className="demo-chip" onClick={()=>demoLogin("TL","Aryan Singh","#a78bfa")}>⚡ Team Lead</button>
            <button className="demo-chip" onClick={()=>demoLogin("DEV","Isha Patel","#ec4899")}>💻 Dev</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════ */
function Dashboard({ user, showToast, openModal, closeModal, nav }) {
  const [data, setData]   = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projs, setProjs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.dashboard.get().catch(()=>null),
      API.tasks.my().catch(()=>[]),
      API.users.all().catch(()=>[]),
      API.projects.all().catch(()=>[]),
    ]).then(([dash, t, u, p]) => {
      setData(dash);
      setTasks(Array.isArray(t)?t:[]);
      setUsers(Array.isArray(u)?u:[]);
      setProjs(Array.isArray(p)?p:[]);
      setLoading(false);
    });
  }, []);

  const hr = new Date().getHours();
  const greet = hr<12?"Good morning ☀️":hr<17?"Good afternoon ⚡":"Good evening 🌙";
  const fn = (user.name||"").split(" ")[0];
  const isAdmin = ["ADMIN","admin"].includes(user.role);
  const canMgr = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);
  const today = todayStr();
  const myPend = tasks.filter(t=>t.status==="pending"||t.status==="PENDING");
  const myOvd  = myPend.filter(t=>t.deadline<today||t.dl<today);
  const leaderboard = [...users].sort((a,b)=>(b.pts||0)-(a.pts||0)).slice(0,5);
  const maxPts = leaderboard[0]?.pts || 1;

  if (loading) return <div className="loading">⬡ Loading dashboard…</div>;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="pg-title">{greet}, {fn}</div>
          <div className="pg-sub">{fmtDate(new Date())}</div>
        </div>
        <div className="topbar-right">
          <span className={`badge b-${user.role}`}>{rl(user.role)}</span>
          {user.track && <span className={`badge b-${user.track}`}>{trl(user.track)}</span>}
          <div className="pts-chip">★ {(user.pts||0).toLocaleString()} pts</div>
        </div>
      </div>

      {canMgr && (
        <div className="stats-grid">
          <div className="stat-card" style={{"--accent-line":"var(--acc)"}}>
            <div className="stat-icon">📋</div>
            <div className="stat-lbl">Active Tasks</div>
            <div className="stat-val">{data?.activeTasks ?? tasks.length}</div>
            <div className="stat-sub">{myOvd.length} overdue</div>
          </div>
          <div className="stat-card" style={{"--accent-line":"var(--grn)"}}>
            <div className="stat-icon">◫</div>
            <div className="stat-lbl">Active Projects</div>
            <div className="stat-val">{data?.activeProjects ?? projs.filter(p=>p.status==="active").length}</div>
            <div className="stat-sub">In progress</div>
          </div>
          <div className="stat-card" style={{"--accent-line":"var(--pur)"}}>
            <div className="stat-icon">👥</div>
            <div className="stat-lbl">Team Members</div>
            <div className="stat-val">{data?.totalUsers ?? users.length}</div>
            <div className="stat-sub">Active</div>
          </div>
          <div className="stat-card" style={{"--accent-line":"var(--amb)"}}>
            <div className="stat-icon">★</div>
            <div className="stat-lbl">My Points</div>
            <div className="stat-val">{user.pts||0}</div>
            <div className="stat-sub">= ₹{user.pts||0}</div>
          </div>
        </div>
      )}

      <div className="two-col">
        <div>
          <div className="sec-title" style={{marginBottom:10}}>📋 My Tasks</div>
          <div className="task-list">
            {myPend.length===0 ? (
              <div className="empty-state"><div className="empty-icon">✓</div><div className="empty-title">All caught up!</div>No pending tasks.</div>
            ) : myPend.slice(0,5).map(t => (
              <TaskCard key={t.id} task={t} showDone showToast={showToast} openModal={openModal} closeModal={closeModal} onRefresh={()=>API.tasks.my().then(r=>setTasks(Array.isArray(r)?r:[]))} />
            ))}
            {myPend.length>0 && <button className="btn btn-ghost btn-sm" onClick={()=>nav("my-tasks")} style={{marginTop:4}}>View all →</button>}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card">
            <div className="card-title">🏆 Leaderboard</div>
            {leaderboard.map((u,i) => (
              <div className="lb-row" key={u.id}>
                <div className="lb-rank">{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
                <Av name={u.name} color={u.color} size="av-xs"/>
                <div className="lb-name">{u.name?.split(" ")[0]}</div>
                <div className="lb-bar-w"><div className="lb-bar" style={{width:`${((u.pts||0)/maxPts)*100}%`,background:u.color||"var(--acc)"}}/></div>
                <div className="lb-pts">★{(u.pts||0).toLocaleString()}</div>
              </div>
            ))}
          </div>
          {projs.length>0 && (
            <div className="card">
              <div className="card-title">◫ Active Projects</div>
              {projs.filter(p=>p.status==="active").slice(0,3).map(p=>(
                <div key={p.id} onClick={()=>nav("proj-detail",p.id)} style={{padding:"8px 0",borderBottom:"1px solid var(--br)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--tx0)"}}>{p.name}</div>
                    <div style={{fontSize:11,color:"var(--tx2)"}}>{fmtDateShort(p.deadline)}</div>
                  </div>
                  <span className={`badge b-${p.status||"active"}`}>{p.status||"active"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   TASK CARD COMPONENT
═══════════════════════════════════════════════ */
function TaskCard({ task, showDone, showToast, openModal, closeModal, onRefresh, currentUser }) {
  const dl  = task.deadline || task.dl || "";
  const cd  = (task.status==="done"||task.status==="DONE") ? {cls:"cd-teal",txt:"Done ✓",sc:"done"} : cdText(dl);
  const canDone = showDone && (task.status==="pending"||task.status==="PENDING");
  const dotMap = { overdue:"sd-red", "due-soon":"sd-amb", "on-track":"sd-grn pulse", done:"sd-gray" };

  async function markDone(e) {
    e.stopPropagation();
    try {
      await API.tasks.markDone(task.id);
      showToast(`✅ Task completed!`, "t-grn");
      onRefresh?.();
    } catch(ex) { showToast(ex.message||"Failed","t-red"); }
  }

  function showDetail() {
    openModal(
      <TaskDetail task={task} closeModal={closeModal} showToast={showToast} onRefresh={onRefresh} />,
      "modal-lg"
    );
  }

  return (
    <div className={`task-card ${cd.sc}`} onClick={showDetail}>
      <div className={`status-dot ${dotMap[cd.sc]||"sd-grn"}`}/>
      <div className="task-info">
        <div className="task-name">{task.title}</div>
        <div className="task-meta">
          <span className={`badge b-${task.priority||task.pri||"medium"}`}>{task.priority||task.pri||"medium"}</span>
          {task.department||task.dept ? <span className={`badge b-${task.department||task.dept}`} style={{marginLeft:4}}>{trl(task.department||task.dept)}</span> : null}
        </div>
      </div>
      <div className="task-right">
        <div className={`countdown ${cd.cls}`}>{cd.txt}</div>
        <div className="pts-badge">+{task.pts||task.points||0} pts</div>
        {canDone && <button className="btn btn-sm btn-grn" onClick={markDone}>✓ Done</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TASK DETAIL MODAL
═══════════════════════════════════════════════ */
function TaskDetail({ task, closeModal, showToast, onRefresh }) {
  const dl  = task.deadline || task.dl || "";
  const cd  = (task.status==="done"||task.status==="DONE") ? {cls:"cd-teal",txt:"Completed ✓"} : cdText(dl);
  const canDone = task.status==="pending"||task.status==="PENDING";

  async function markDone() {
    try {
      await API.tasks.markDone(task.id);
      showToast("✅ Task completed!","t-grn");
      onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
  }

  return (
    <>
      <div className="modal-title">📋 {task.title}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <span className={`badge b-${task.priority||task.pri||"medium"}`}>{task.priority||task.pri||"medium"}</span>
        <span className={`badge b-${task.status}`}>{task.status}</span>
        {(task.department||task.dept) && <span className={`badge b-${task.department||task.dept}`}>{trl(task.department||task.dept)}</span>}
        <span className={`countdown ${cd.cls}`} style={{fontSize:11}}>{cd.txt}</span>
      </div>
      {task.description && (
        <div style={{background:"var(--bg2)",border:"1px solid var(--br)",borderRadius:"var(--rs)",padding:13,marginBottom:16,fontSize:13,color:"var(--tx1)",lineHeight:1.6}}>
          {task.description}
        </div>
      )}
      <div className="grid2">
        <div><div className="fl-lbl">Deadline</div><div style={{fontSize:13,fontWeight:700}}>{fmtDateShort(dl)}</div></div>
        <div><div className="fl-lbl">Points</div><div className="pts-chip" style={{padding:"4px 10px",fontSize:12}}>★ {task.pts||task.points||0}</div></div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Close</button>
        {canDone && <button className="btn btn-grn" onClick={markDone}>✓ Mark Complete</button>}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   MY TASKS
═══════════════════════════════════════════════ */
function MyTasks({ user, showToast, openModal, closeModal }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const t = await API.tasks.my();
      setTasks(Array.isArray(t)?t:[]);
    } catch { setTasks([]); }
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); },[load]);

  const today = todayStr();
  const filtered = tasks.filter(t => {
    if (filter==="pending") return t.status==="pending"||t.status==="PENDING";
    if (filter==="done")    return t.status==="done"||t.status==="DONE";
    if (filter==="overdue") return (t.status==="pending"||t.status==="PENDING") && (t.deadline||t.dl)<today;
    return true;
  });

  return (
    <>
      <div className="topbar">
        <div>
          <div className="pg-title">My Tasks</div>
          <div className="pg-sub">{tasks.length} total tasks</div>
        </div>
        <div className="topbar-right">
          {["all","pending","done","overdue"].map(f=>(
            <button key={f} className={`btn btn-sm ${filter===f?"btn-pri":"btn-ghost"}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid-3">
        <div className="stat-card" style={{"--accent-line":"var(--amb)"}}>
          <div className="stat-lbl">Pending</div>
          <div className="stat-val">{tasks.filter(t=>t.status==="pending"||t.status==="PENDING").length}</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--grn)"}}>
          <div className="stat-lbl">Completed</div>
          <div className="stat-val">{tasks.filter(t=>t.status==="done"||t.status==="DONE").length}</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--red)"}}>
          <div className="stat-lbl">Overdue</div>
          <div className="stat-val">{tasks.filter(t=>(t.status==="pending"||t.status==="PENDING")&&(t.deadline||t.dl)<today).length}</div>
        </div>
      </div>

      {loading ? <div className="loading">Loading tasks…</div> : (
        <div className="task-list">
          {filtered.length===0 ? (
            <div className="empty-state"><div className="empty-icon">✓</div><div className="empty-title">No tasks here</div></div>
          ) : filtered.map(t=>(
            <TaskCard key={t.id} task={t} showDone currentUser={user}
              showToast={showToast} openModal={openModal} closeModal={closeModal} onRefresh={load} />
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════ */
function Projects({ user, showToast, openModal, closeModal, nav }) {
  const [projs, setProjs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMgr = ["ADMIN","MANAGER","admin","manager"].includes(user.role);

  const load = useCallback(async () => {
    try { setProjs(Array.isArray(await API.projects.all()) ? await API.projects.all() : []); }
    catch { setProjs([]); }
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); },[load]);

  function openCreate() {
    openModal(<CreateProjectModal closeModal={closeModal} showToast={showToast} onRefresh={load} />, "modal-lg");
  }

  return (
    <>
      <div className="topbar">
        <div><div className="pg-title">Projects</div><div className="pg-sub">{projs.length} projects</div></div>
        {isMgr && <button className="btn btn-pri" onClick={openCreate}>＋ New Project</button>}
      </div>
      {loading ? <div className="loading">Loading projects…</div> : (
        <div className="proj-grid">
          {projs.length===0 ? <div className="empty-state"><div className="empty-icon">◫</div><div className="empty-title">No projects yet</div></div>
          : projs.map(p => (
            <div key={p.id} className="proj-card" style={{"--proj-color":p.color||"linear-gradient(90deg,var(--acc),var(--pur))"}} onClick={()=>nav("proj-detail",p.id)}>
              <div className="proj-name">{p.name}</div>
              <div className="proj-desc">{p.description||"No description."}</div>
              <div className="proj-foot">
                <span>{fmtDateShort(p.deadline)}</span>
                <span className={`badge b-${p.status||"active"}`}>{p.status||"active"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   CREATE PROJECT MODAL
═══════════════════════════════════════════════ */
function CreateProjectModal({ closeModal, showToast, onRefresh, existing }) {
  const [form, setForm] = useState(existing || { name:"", description:"", type:"fullstack", deadline:addDays(todayStr(),30), color:"#4f8ef7" });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function save() {
    if (!form.name.trim()) { showToast("Project name required.","t-red"); return; }
    setSaving(true);
    try {
      if (existing) await API.projects.update(existing.id, form);
      else          await API.projects.create(form);
      showToast(`✅ Project ${existing?"updated":"created"}!`,"t-grn");
      onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }

  return (
    <>
      <div className="modal-title">{existing?"✏ Edit":"◫ Create"} Project</div>
      <div className="fg"><label className="fl-lbl">Project Name *</label>
        <input className="fc" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Customer Portal v3" /></div>
      <div className="fg"><label className="fl-lbl">Description</label>
        <textarea className="fc" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What is this project about?" rows={2}/></div>
      <div className="grid2">
        <div className="fg"><label className="fl-lbl">Type</label>
          <select className="fc" value={form.type} onChange={e=>set("type",e.target.value)}>
            <option value="fullstack">Full Stack</option><option value="frontend">Frontend</option><option value="backend">Backend</option>
          </select></div>
        <div className="fg"><label className="fl-lbl">Deadline</label>
          <input className="fc" type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)} /></div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Saving…":"Save Project"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   PROJECT DETAIL
═══════════════════════════════════════════════ */
function ProjectDetail({ user, projId, showToast, openModal, closeModal, nav }) {
  const [proj, setProj]     = useState(null);
  const [tasks, setTasks]   = useState([]);
  const [allUsers, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = ["ADMIN","MANAGER","admin","manager"].includes(user.role);
  const canMgr  = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);

  const load = useCallback(async () => {
    try {
      const [p, t, u] = await Promise.all([
        API.projects.byId(projId),
        API.tasks.all().catch(()=>API.tasks.my()),
        API.users.all().catch(()=>[]),
      ]);
      setProj(p); setTasks(Array.isArray(t)?t.filter(x=>x.projectId===projId||x.pid===projId):[]);
      setUsers(Array.isArray(u)?u:[]);
    } catch { }
    setLoading(false);
  }, [projId]);

  useEffect(()=>{ load(); },[load]);

  function openAddTask() {
    openModal(<AddTaskModal projId={projId} users={allUsers} closeModal={closeModal} showToast={showToast} onRefresh={load} />, "modal-lg");
  }
  function openAddMember() {
    const nonMem = allUsers.filter(u => !(proj?.members||[]).includes(u.id));
    openModal(<AddMemberModal projId={projId} users={nonMem} closeModal={closeModal} showToast={showToast} onRefresh={load} />);
  }
  async function deleteProject() {
    if (!window.confirm("Delete this project?")) return;
    try { await API.projects.delete(projId); showToast("Project deleted.","t-amb"); nav("projects"); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
  }

  if (loading) return <div className="loading">Loading project…</div>;
  if (!proj)   return <div className="loading" style={{color:"var(--red)"}}>Project not found.</div>;

  const members = allUsers.filter(u => (proj.members||[]).includes(u.id));
  const pendTasks = tasks.filter(t=>t.status==="pending"||t.status==="PENDING");
  const doneTasks = tasks.filter(t=>t.status==="done"||t.status==="DONE");
  const doneCount = doneTasks.length;
  const pct = tasks.length ? Math.round((doneCount/tasks.length)*100) : 0;

  return (
    <>
      <button className="pg-back" onClick={()=>nav("projects")}>← Projects</button>
      <div className="topbar">
        <div>
          <div className="pg-title">{proj.name}</div>
          <div className="pg-sub">{proj.description}</div>
        </div>
        <div className="topbar-right">
          <span className={`badge b-${proj.status||"active"}`}>{proj.status||"active"}</span>
          <span className={`badge b-${proj.type||"fullstack"}`}>{trl(proj.type)||"Full Stack"}</span>
          {canMgr && <button className="btn btn-pri" onClick={openAddTask}>＋ Add Task</button>}
          {canMgr && <button className="btn btn-ghost" onClick={openAddMember}>＋ Member</button>}
          {isAdmin && <button className="btn btn-sm" style={{background:"var(--red-bg)",color:"var(--red)",border:"1px solid rgba(244,63,94,.2)"}} onClick={deleteProject}>Delete</button>}
        </div>
      </div>

      <div className="stats-grid-3">
        <div className="stat-card" style={{"--accent-line":"var(--amb)"}}>
          <div className="stat-lbl">Total Tasks</div><div className="stat-val">{tasks.length}</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--grn)"}}>
          <div className="stat-lbl">Completed</div><div className="stat-val">{doneCount}</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--acc)"}}>
          <div className="stat-lbl">Progress</div><div className="stat-val">{pct}%</div>
          <div className="prog-wrap" style={{marginTop:8}}><div className="prog-bar pb-acc" style={{width:`${pct}%`}}/></div>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="sec-title" style={{marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            📋 Tasks
            <button className="btn btn-sm btn-ghost" onClick={()=>nav("kanban",projId)}>📋 Kanban Board →</button>
          </div>
          <div className="task-list">
            {tasks.length===0 ? <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No tasks yet</div></div>
            : tasks.map(t=>(
              <TaskCard key={t.id} task={t} showToast={showToast} openModal={openModal} closeModal={closeModal} onRefresh={load} />
            ))}
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title">👥 Team Members ({members.length})</div>
            {members.map(u=>(
              <div className="member-card" key={u.id}>
                <Av name={u.name} color={u.color} size="av-sm"/>
                <div className="member-info">
                  <div className="member-name">{u.name}</div>
                  <div className="member-title">{u.title||rl(u.role)}</div>
                </div>
                <span className={`badge b-${u.track||u.role}`}>{trl(u.track)||rl(u.role)}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{marginTop:12}}>
            <div className="card-title">📅 Project Info</div>
            <div className="ph-item"><span style={{color:"var(--tx2)",fontSize:12}}>Deadline</span><span style={{fontWeight:700}}>{fmtDateShort(proj.deadline)}</span></div>
            <div className="ph-item"><span style={{color:"var(--tx2)",fontSize:12}}>Type</span><span className={`badge b-${proj.type||"fullstack"}`}>{trl(proj.type)||"Full Stack"}</span></div>
            <div className="ph-item"><span style={{color:"var(--tx2)",fontSize:12}}>Status</span><span className={`badge b-${proj.status||"active"}`}>{proj.status||"active"}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   ADD TASK MODAL
═══════════════════════════════════════════════ */
function AddTaskModal({ projId, users, closeModal, showToast, onRefresh }) {
  const [form, setForm] = useState({
    title:"", description:"", projectId:projId, assignedToId:users[0]?.id||"",
    reviewerId:users[0]?.id||"", deadline:addDays(todayStr(),7), priority:"medium",
    department:"frontend", pts:80, duration:3
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function save() {
    if (!form.title.trim()) { showToast("Task title required.","t-red"); return; }
    setSaving(true);
    try {
      await API.tasks.create(form);
      showToast("✅ Task assigned!","t-grn"); onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }

  return (
    <>
      <div className="modal-title">📋 Add Task</div>
      <div className="fg"><label className="fl-lbl">Title *</label>
        <input className="fc" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="What needs to be done?" /></div>
      <div className="fg"><label className="fl-lbl">Description</label>
        <textarea className="fc" value={form.description} onChange={e=>set("description",e.target.value)} rows={2}/></div>
      <div className="grid2">
        <div className="fg"><label className="fl-lbl">Assign To *</label>
          <select className="fc" value={form.assignedToId} onChange={e=>set("assignedToId",e.target.value)}>
            {users.map(u=><option key={u.id} value={u.id}>{u.name} ({trl(u.track)||rl(u.role)})</option>)}
          </select></div>
        <div className="fg"><label className="fl-lbl">Reviewer</label>
          <select className="fc" value={form.reviewerId} onChange={e=>set("reviewerId",e.target.value)}>
            {users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
          </select></div>
      </div>
      <div className="grid3">
        <div className="fg"><label className="fl-lbl">Deadline *</label>
          <input className="fc" type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)} /></div>
        <div className="fg"><label className="fl-lbl">Priority</label>
          <select className="fc" value={form.priority} onChange={e=>set("priority",e.target.value)}>
            <option value="critical">Critical</option><option value="high">High</option>
            <option value="medium">Medium</option><option value="low">Low</option>
          </select></div>
        <div className="fg"><label className="fl-lbl">Points</label>
          <input className="fc" type="number" value={form.pts} min={10} onChange={e=>set("pts",parseInt(e.target.value)||80)} /></div>
      </div>
      <div className="fg"><label className="fl-lbl">Department</label>
        <select className="fc" value={form.department} onChange={e=>set("department",e.target.value)}>
          <option value="frontend">Frontend</option><option value="backend">Backend</option>
          <option value="devops">DevOps</option><option value="fullstack">Full Stack</option>
        </select></div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Saving…":"Assign Task"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   ADD MEMBER MODAL
═══════════════════════════════════════════════ */
function AddMemberModal({ projId, users, closeModal, showToast, onRefresh }) {
  const [uid, setUid] = useState(users[0]?.id||"");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!uid) { showToast("Select a member.","t-red"); return; }
    setSaving(true);
    try {
      await API.projects.addMember(projId, uid);
      showToast("Member added!","t-grn"); onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }

  if (!users.length) return (
    <>
      <div className="modal-title">＋ Add Member</div>
      <div style={{color:"var(--tx2)",fontSize:13}}>Everyone is already a member!</div>
      <div className="modal-footer"><button className="btn btn-ghost" onClick={closeModal}>Close</button></div>
    </>
  );

  return (
    <>
      <div className="modal-title">＋ Add Member</div>
      <div className="fg"><label className="fl-lbl">Select Member</label>
        <select className="fc" value={uid} onChange={e=>setUid(e.target.value)}>
          {users.map(u=><option key={u.id} value={u.id}>{u.name} — {trl(u.track)||rl(u.role)}</option>)}
        </select></div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Adding…":"Add Member"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   KANBAN BOARD
═══════════════════════════════════════════════ */
function KanbanBoard({ projId, user, showToast, nav }) {
  const [cols, setCols] = useState({ todo:[], inprogress:[], review:[], done:[] });
  const [proj, setProj] = useState(null);
  const [loading, setLoading] = useState(true);
  const COLS = [
    { key:"todo",       label:"To Do",      color:"var(--tx2)" },
    { key:"inprogress", label:"In Progress", color:"var(--amb)" },
    { key:"review",     label:"Review",      color:"var(--acc)" },
    { key:"done",       label:"Done",        color:"var(--grn)" },
  ];

  const load = useCallback(async () => {
    try {
      const [board, p] = await Promise.all([API.projects.kanban(projId), API.projects.byId(projId)]);
      setCols(typeof board==="object" ? board : { todo:[], inprogress:[], review:[], done:[] });
      setProj(p);
    } catch { setCols({ todo:[], inprogress:[], review:[], done:[] }); }
    setLoading(false);
  }, [projId]);

  useEffect(()=>{ load(); },[load]);

  async function move(taskId, col) {
    try {
      await API.tasks.moveKanban(taskId, col);
      showToast("Moved!","t-acc"); load();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
  }

  if (loading) return <div className="loading">Loading kanban…</div>;

  return (
    <>
      <button className="pg-back" onClick={()=>nav("proj-detail",projId)}>← {proj?.name||"Project"}</button>
      <div className="topbar">
        <div><div className="pg-title">Kanban Board</div><div className="pg-sub">{proj?.name}</div></div>
      </div>
      <div className="kanban-wrap">
        {COLS.map(c=>{
          const cards = Array.isArray(cols[c.key]) ? cols[c.key] : [];
          return (
            <div key={c.key} className="kanban-col">
              <div className="kanban-col-hdr">
                <span className="kanban-col-title" style={{color:c.color}}>{c.label}</span>
                <span className="kanban-count">{cards.length}</span>
              </div>
              <div className="kanban-cards">
                {cards.map(t=>(
                  <div key={t.id} className="kcard">
                    <div className="kcard-title">{t.title}</div>
                    <div className="kcard-meta">
                      <span className={`badge b-${t.priority||t.pri||"medium"}`}>{t.priority||t.pri||"medium"}</span>
                      <span style={{marginLeft:"auto",fontSize:10,color:"var(--grn)"}}>+{t.pts||0}pts</span>
                    </div>
                    {c.key!=="done" && (
                      <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                        {COLS.filter(x=>x.key!==c.key).map(x=>(
                          <button key={x.key} className="btn btn-xs btn-ghost" onClick={()=>move(t.id,x.key)}>→{x.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   ASSIGN TASK
═══════════════════════════════════════════════ */
function AssignTask({ user, showToast }) {
  const [form, setForm] = useState({ title:"", description:"", projectId:"", assignedToId:"",
    reviewerId:"", deadline:addDays(todayStr(),7), priority:"medium", department:"frontend", pts:80, duration:3 });
  const [users, setUsers] = useState([]);
  const [projs, setProjs] = useState([]);
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(()=>{
    Promise.all([API.users.all().catch(()=>[]), API.projects.all().catch(()=>[])]).then(([u,p])=>{
      setUsers(Array.isArray(u)?u:[]); setProjs(Array.isArray(p)?p:[]);
      if(p?.length) set("projectId",p[0].id);
      if(u?.length) { set("assignedToId",u[0].id); set("reviewerId",u[0].id); }
    });
  },[]);

  const pendingByUser = (uid) => {
    // can't know without fetching all tasks; show as 0 here
    return 0;
  };

  async function save() {
    if (!form.title.trim()) { showToast("Task title required.","t-red"); return; }
    if (!form.projectId)    { showToast("Select a project.","t-red"); return; }
    setSaving(true);
    try {
      await API.tasks.create(form);
      showToast("✅ Task assigned!","t-grn");
      setForm(f=>({...f, title:"", description:""}));
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }

  return (
    <>
      <div className="topbar"><div><div className="pg-title">Assign Task</div><div className="pg-sub">Create and assign work to team members</div></div></div>
      <div className="two-col-wide">
        <div className="card">
          <div className="card-title">📋 New Task</div>
          <div className="fg"><label className="fl-lbl">Task Title *</label>
            <input className="fc" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="What needs to be done?" /></div>
          <div className="fg"><label className="fl-lbl">Description</label>
            <textarea className="fc" value={form.description} onChange={e=>set("description",e.target.value)} rows={3} placeholder="Describe the task…"/></div>
          <div className="grid2">
            <div className="fg"><label className="fl-lbl">Project *</label>
              <select className="fc" value={form.projectId} onChange={e=>set("projectId",e.target.value)}>
                {projs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select></div>
            <div className="fg"><label className="fl-lbl">Department</label>
              <select className="fc" value={form.department} onChange={e=>set("department",e.target.value)}>
                <option value="frontend">Frontend</option><option value="backend">Backend</option>
                <option value="devops">DevOps</option><option value="fullstack">Full Stack</option>
              </select></div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="fl-lbl">Assign To *</label>
              <select className="fc" value={form.assignedToId} onChange={e=>set("assignedToId",e.target.value)}>
                {users.map(u=><option key={u.id} value={u.id}>{u.name} ({trl(u.track)||rl(u.role)})</option>)}
              </select></div>
            <div className="fg"><label className="fl-lbl">Reviewer</label>
              <select className="fc" value={form.reviewerId} onChange={e=>set("reviewerId",e.target.value)}>
                {users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
              </select></div>
          </div>
          <div className="grid3">
            <div className="fg"><label className="fl-lbl">Deadline *</label>
              <input className="fc" type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)} /></div>
            <div className="fg"><label className="fl-lbl">Duration (days)</label>
              <input className="fc" type="number" value={form.duration} min={1} onChange={e=>set("duration",parseInt(e.target.value)||3)} /></div>
            <div className="fg"><label className="fl-lbl">Priority</label>
              <select className="fc" value={form.priority} onChange={e=>set("priority",e.target.value)}>
                <option value="critical">Critical</option><option value="high">High</option>
                <option value="medium">Medium</option><option value="low">Low</option>
              </select></div>
          </div>
          <div className="fg"><label className="fl-lbl">Points on Complete</label>
            <input className="fc" type="number" value={form.pts} min={10} max={500} onChange={e=>set("pts",parseInt(e.target.value)||80)} /></div>
          <button className="btn btn-pri" onClick={save} disabled={saving} style={{width:"100%",justifyContent:"center"}}>
            {saving?"Assigning…":"↗ Assign Task"}
          </button>
        </div>
        <div className="card">
          <div className="card-title">📊 Team</div>
          {users.map(u=>(
            <div key={u.id} style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <Av name={u.name} color={u.color} size="av-xs"/>
                <div style={{flex:1,fontSize:12,fontWeight:600}}>{u.name?.split(" ")[0]}</div>
                <span className={`badge b-${u.track||u.role}`}>{trl(u.track)||rl(u.role)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   TEAMS
═══════════════════════════════════════════════ */
function Teams({ user, showToast, openModal, closeModal, nav }) {
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = ["ADMIN","admin"].includes(user.role);

  const load = useCallback(async ()=>{
    const [t, u] = await Promise.all([API.teams.all().catch(()=>[]), API.users.all().catch(()=>[])]);
    setTeams(Array.isArray(t)?t:[]); setAllUsers(Array.isArray(u)?u:[]);
    setLoading(false);
  },[]);

  useEffect(()=>{ load(); },[load]);

  function openCreate() {
    openModal(<CreateTeamModal users={allUsers} closeModal={closeModal} showToast={showToast} onRefresh={load} />);
  }

  return (
    <>
      <div className="topbar">
        <div><div className="pg-title">Teams & Roles</div><div className="pg-sub">{teams.length} teams</div></div>
        {isAdmin && <button className="btn btn-pri" onClick={openCreate}>＋ Create Team</button>}
      </div>
      {loading ? <div className="loading">Loading teams…</div> : (
        <div className="two-col">
          <div>
            <div className="sec-title" style={{marginBottom:10}}>🏢 Teams</div>
            {teams.map(tm=>{
              const members = allUsers.filter(u=>(tm.members||[]).includes(u.id));
              return (
                <div key={tm.id} className="team-section">
                  <div className="team-section-hdr">
                    <div>
                      <div style={{fontSize:15,fontWeight:800,color:tm.color||"var(--acc)"}}>{tm.name}</div>
                      <div style={{fontSize:11,color:"var(--tx2)",marginTop:2}}>{tm.description||""}</div>
                    </div>
                    <button className="btn btn-sm btn-ghost" onClick={()=>nav("team-detail",tm.id)}>View →</button>
                  </div>
                  {members.map(u=>(
                    <div className="member-card" key={u.id}>
                      <Av name={u.name} color={u.color} size="av-sm"/>
                      <div className="member-info">
                        <div className="member-name">{u.name} {u.id===tm.leadId&&<span style={{fontSize:10,color:"var(--amb)"}}>Lead</span>}</div>
                        <div className="member-title">{u.title||rl(u.role)}</div>
                      </div>
                      <span className={`badge b-${u.track||u.role}`}>{trl(u.track)||rl(u.role)}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div>
            <div className="card">
              <div className="card-title">👤 All Members</div>
              <table className="tbl">
                <thead><tr><th>Member</th><th>Track</th><th>Role</th><th>Pts</th></tr></thead>
                <tbody>
                  {[...allUsers].sort((a,b)=>(b.pts||0)-(a.pts||0)).map(u=>(
                    <tr key={u.id}>
                      <td><div style={{display:"flex",alignItems:"center",gap:8}}>
                        <Av name={u.name} color={u.color} size="av-xs"/>
                        <div><div style={{fontWeight:700}}>{u.name}</div><div style={{fontSize:10,color:"var(--tx2)"}}>{u.email}</div></div>
                      </div></td>
                      <td><span className={`badge b-${u.track}`}>{trl(u.track)}</span></td>
                      <td><span className={`badge b-${u.role}`}>{rl(u.role)}</span></td>
                      <td><span style={{fontWeight:700,color:"var(--grn)",fontFamily:"monospace"}}>★{u.pts||0}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   TEAM DETAIL
═══════════════════════════════════════════════ */
function TeamDetail({ teamId, user, showToast, openModal, closeModal, nav }) {
  const [team, setTeam] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = ["ADMIN","admin"].includes(user.role);

  const load = useCallback(async ()=>{
    const [t, u] = await Promise.all([API.teams.byId(teamId).catch(()=>null), API.users.all().catch(()=>[])]);
    setTeam(t); setAllUsers(Array.isArray(u)?u:[]);
    setLoading(false);
  },[teamId]);

  useEffect(()=>{ load(); },[load]);

  async function removeMember(uid) {
    try { await API.teams.removeMember(teamId, uid); showToast("Member removed.","t-amb"); load(); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
  }

  function openAddMember() {
    const nonMem = allUsers.filter(u=>!(team?.members||[]).includes(u.id));
    openModal(
      <AddTeamMemberModal teamId={teamId} users={nonMem} closeModal={closeModal} showToast={showToast} onRefresh={load} />
    );
  }

  if (loading) return <div className="loading">Loading team…</div>;
  if (!team)   return <div className="loading">Team not found.</div>;

  const members = allUsers.filter(u=>(team.members||[]).includes(u.id));

  return (
    <>
      <button className="pg-back" onClick={()=>nav("teams")}>← Teams</button>
      <div className="topbar">
        <div><div className="pg-title" style={{color:team.color||"var(--acc)"}}>{team.name}</div>
          <div className="pg-sub">{team.description}</div></div>
        {isAdmin && <button className="btn btn-ghost" onClick={openAddMember}>＋ Add Member</button>}
      </div>
      <div className="card">
        <div className="card-title">Team Members ({members.length})</div>
        {members.map(u=>(
          <div className="member-card" key={u.id}>
            <Av name={u.name} color={u.color} size="av-md"/>
            <div className="member-info">
              <div className="member-name">{u.name} {u.id===team.leadId&&<span style={{fontSize:10,background:"var(--amb-bg)",color:"var(--amb)",padding:"2px 6px",borderRadius:20,marginLeft:4}}>Lead</span>}</div>
              <div className="member-title">{u.title||rl(u.role)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--grn)"}}>★ {u.pts||0} pts</div>
              <span className={`badge b-${u.track||u.role}`}>{trl(u.track)||rl(u.role)}</span>
            </div>
            {isAdmin && <button className="btn btn-xs btn-ghost" style={{color:"var(--red)"}} onClick={()=>removeMember(u.id)}>Remove</button>}
          </div>
        ))}
      </div>
    </>
  );
}

function AddTeamMemberModal({ teamId, users, closeModal, showToast, onRefresh }) {
  const [uid, setUid] = useState(users[0]?.id||"");
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    try { await API.teams.addMember(teamId, uid); showToast("Member added!","t-grn"); onRefresh?.(); closeModal(); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }
  if (!users.length) return (<><div className="modal-title">＋ Add Member</div><div style={{color:"var(--tx2)"}}>Everyone is already a member.</div><div className="modal-footer"><button className="btn btn-ghost" onClick={closeModal}>Close</button></div></>);
  return (
    <>
      <div className="modal-title">＋ Add to Team</div>
      <div className="fg"><label className="fl-lbl">Select Member</label>
        <select className="fc" value={uid} onChange={e=>setUid(e.target.value)}>
          {users.map(u=><option key={u.id} value={u.id}>{u.name} — {trl(u.track)||rl(u.role)}</option>)}
        </select></div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Adding…":"Add Member"}</button>
      </div>
    </>
  );
}

function CreateTeamModal({ users, closeModal, showToast, onRefresh }) {
  const COLORS = ["#4f8ef7","#22d3a2","#a78bfa","#f59e0b","#ec4899"];
  const [form, setForm] = useState({ name:"", description:"", leadId:users[0]?.id||"", color:COLORS[0] });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  async function save() {
    if (!form.name.trim()) { showToast("Team name required.","t-red"); return; }
    setSaving(true);
    try { await API.teams.create({ ...form, memberIds:[form.leadId] }); showToast("✅ Team created!","t-grn"); onRefresh?.(); closeModal(); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }
  return (
    <>
      <div className="modal-title">⬡ Create Team</div>
      <div className="fg"><label className="fl-lbl">Team Name *</label>
        <input className="fc" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Mobile Team"/></div>
      <div className="fg"><label className="fl-lbl">Description</label>
        <input className="fc" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What does this team work on?"/></div>
      <div className="grid2">
        <div className="fg"><label className="fl-lbl">Team Lead</label>
          <select className="fc" value={form.leadId} onChange={e=>set("leadId",e.target.value)}>
            {users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
          </select></div>
        <div className="fg"><label className="fl-lbl">Color</label>
          <div style={{display:"flex",gap:8,marginTop:6}}>
            {COLORS.map(c=><div key={c} onClick={()=>set("color",c)} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?"3px solid #fff":"3px solid transparent"}}/>)}
          </div></div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Creating…":"Create Team"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   ADD EMPLOYEE
═══════════════════════════════════════════════ */
function AddEmployee({ user, showToast }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"employee", track:"frontend", department:"frontend", title:"", color:"#4f8ef7" });
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(()=>{ API.users.all().catch(()=>[]).then(u=>setEmployees(Array.isArray(u)?u:[])); },[]);

  async function save() {
    if (!form.name||!form.email||!form.password) { showToast("Name, email and password required.","t-red"); return; }
    if (form.password.length<6) { showToast("Password min 6 chars.","t-red"); return; }
    setSaving(true);
    try {
      await API.users.create(form);
      showToast("✅ Employee added!","t-grn");
      setForm({ name:"", email:"", password:"", role:"DEV", track:"FRONTEND", department:"frontend", title:"", color:"#4f8ef7" });
      API.users.all().then(u=>setEmployees(Array.isArray(u)?u:[]));
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }

  return (
    <>
      <div className="topbar"><div><div className="pg-title">Add Employee</div><div className="pg-sub">Onboard a new team member</div></div></div>
      <div className="two-col-wide">
        <div className="card">
          <div className="card-title">👤 New Employee</div>
          <div className="grid2">
            <div className="fg"><label className="fl-lbl">Full Name *</label>
              <input className="fc" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="John Doe"/></div>
            <div className="fg"><label className="fl-lbl">Work Email *</label>
              <input className="fc" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="john@company.com"/></div>
          </div>
          <div className="grid2">
            <div className="fg"><label className="fl-lbl">Password *</label>
              <input className="fc" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Min 6 chars"/></div>
            <div className="fg"><label className="fl-lbl">Job Title</label>
              <input className="fc" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Frontend Developer"/></div>
          </div>
          <div className="grid3">
            <div className="fg"><label className="fl-lbl">Role</label>
              <select className="fc" value={form.role} onChange={e=>set("role",e.target.value)}>
                <option value="DEV">Employee</option><option value="TL">Team Lead</option><option value="MANAGER">Manager</option>
              </select></div>
            <div className="fg"><label className="fl-lbl">Track</label>
              <select className="fc" value={form.track} onChange={e=>set("track",e.target.value)}>
                <option value="frontend">Frontend</option><option value="backend">Backend</option> 
                <option value="DESIGNER">Designer</option><option value="DEVOPS">DevOps</option><option value="FULLSTACK">Full Stack</option><option value="QA">QA</option>
              </select></div>
            <div className="fg"><label className="fl-lbl">Department</label>
              <select className="fc" value={form.department} onChange={e=>set("department",e.target.value)}>
                <option value="frontend">Frontend</option><option value="backend">Backend</option>
                <option value="devops">DevOps</option><option value="management">Management</option>
              </select></div>
          </div>
          <button className="btn btn-pri" onClick={save} disabled={saving} style={{width:"100%",justifyContent:"center"}}>
            {saving?"Adding…":"＋ Add Employee"}
          </button>
        </div>
        <div className="card">
          <div className="card-title">👥 Current Employees ({employees.length})</div>
          {employees.map(u=>(
            <div className="member-card" key={u.id}>
              <Av name={u.name} color={u.color} size="av-sm"/>
              <div className="member-info"><div className="member-name">{u.name}</div><div className="member-title">{u.title||rl(u.role)}</div></div>
              <span className={`badge b-${u.role}`}>{rl(u.role)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   POINTS & REWARDS
═══════════════════════════════════════════════ */
function PointsRewards({ user, showToast }) {
  const [hist, setHist]       = useState([]);
  const [myRedeems, setMyR]   = useState([]);
  const [pts, setPts]         = useState(user.pts||0);
  const [note, setNote]       = useState("Amazon voucher");
  const [amount, setAmount]   = useState(200);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([API.points.history().catch(()=>[]), API.points.myRedeems().catch(()=>[])]).then(([h,r])=>{
      setHist(Array.isArray(h)?h:[]); setMyR(Array.isArray(r)?r:[]);
      setLoading(false);
    });
  },[]);

  async function redeem() {
    if (amount<100) { showToast("Minimum 100 points.","t-red"); return; }
    if (amount>pts) { showToast("Not enough points!","t-red"); return; }
    setSaving(true);
    try {
      await API.points.requestRedeem({ pts:amount, note });
      showToast(`💳 Redemption requested for ₹${amount}!`,"t-grn");
      setPts(p=>p-amount);
      API.points.myRedeems().then(r=>setMyR(Array.isArray(r)?r:[]));
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }

  return (
    <>
      <div className="topbar">
        <div><div className="pg-title">Points & Rewards</div><div className="pg-sub">Earn points by completing tasks</div></div>
        <div className="pts-chip" style={{fontSize:16,padding:"10px 18px"}}>★ {pts.toLocaleString()} pts</div>
      </div>
      <div className="stats-grid">
        <div className="stat-card" style={{"--accent-line":"var(--grn)"}}>
          <div className="stat-icon">★</div><div className="stat-lbl">Current Points</div>
          <div className="stat-val">{pts}</div><div className="stat-sub">= ₹{pts}</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--acc)"}}>
          <div className="stat-icon">📈</div><div className="stat-lbl">Total Earned</div>
          <div className="stat-val">{user.earned||pts}</div><div className="stat-sub">All time</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--pur)"}}>
          <div className="stat-icon">💸</div><div className="stat-lbl">Redeemed</div>
          <div className="stat-val">₹{user.redeemed||0}</div><div className="stat-sub">Total cashout</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--amb)"}}>
          <div className="stat-icon">📋</div><div className="stat-lbl">Completed</div>
          <div className="stat-val">{hist.filter(h=>h.type==="task"||h.type==="TASK").length}</div><div className="stat-sub">Tasks done</div>
        </div>
      </div>
      <div className="banner-info">
        <div style={{fontSize:13,fontWeight:700,color:"var(--acc)"}}>💡 How to earn points</div>
        <div style={{fontSize:11,color:"var(--tx1)",marginTop:3}}>Complete tasks on time: full points · Late: 50% pts − 10 penalty · Daily login: +2 pts</div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">📋 Point History</div>
          {loading ? <div className="loading" style={{padding:24}}>Loading…</div>
          : hist.length===0 ? <div className="empty-state" style={{padding:24}}>No history yet.</div>
          : hist.slice(0,20).map((h,i)=>(
            <div className="ph-item" key={h.id||i}>
              <div>
                <div style={{fontSize:13,color:"var(--tx0)"}}>{h.description||h.desc||h.type}</div>
                <div style={{fontSize:10,color:"var(--tx2)"}}>{h.date||h.createdAt||""}</div>
              </div>
              <span className={h.pts>0?"ph-pos":h.pts<0?"ph-neg":"ph-blue"}>{h.pts>0?"+":""}{h.pts}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card">
            <div className="card-title">💳 Redeem Points</div>
            <div style={{fontSize:13,color:"var(--tx1)",marginBottom:14}}>Min 100 pts · 1 pt = ₹1</div>
            <div className="fg"><label className="fl-lbl">Amount (pts)</label>
              <input className="fc" type="number" min={100} max={pts} value={amount} onChange={e=>setAmount(parseInt(e.target.value)||100)} /></div>
            <div className="fg"><label className="fl-lbl">Redeem For</label>
              <select className="fc" value={note} onChange={e=>setNote(e.target.value)}>
                <option>Amazon voucher</option><option>Swiggy credits</option><option>Flipkart voucher</option><option>UPI transfer</option><option>Zomato credits</option>
              </select></div>
            <button className="btn btn-grn" style={{width:"100%",justifyContent:"center"}} onClick={redeem} disabled={saving}>
              {saving?"Requesting…":"💰 Request Redemption"}
            </button>
          </div>
          <div className="card">
            <div className="card-title">📜 My Requests</div>
            {myRedeems.length===0 ? <div style={{fontSize:12,color:"var(--tx2)"}}>No redemptions yet</div>
            : myRedeems.map((r,i)=>(
              <div className="ph-item" key={r.id||i}>
                <div>
                  <div style={{fontSize:12,color:"var(--tx0)"}}>₹{r.pts} — {r.note}</div>
                  <div style={{fontSize:10,color:"var(--tx2)"}}>{r.date||r.createdAt||""}</div>
                </div>
                <span className={`badge b-${(r.status||"").toLowerCase()}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   REDEEMS (MANAGER)
═══════════════════════════════════════════════ */
function Redeems({ showToast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async ()=>{
    try { setList(Array.isArray(await API.redeems.all()) ? await API.redeems.all() : []); }
    catch { setList([]); }
    setLoading(false);
  },[]);

  useEffect(()=>{ load(); },[load]);

  async function approve(id) {
    try { await API.redeems.approve(id); showToast("✅ Approved!","t-grn"); load(); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
  }
  async function reject(id) {
    try { await API.redeems.reject(id); showToast("Rejected. Points refunded.","t-amb"); load(); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
  }

  const pending = list.filter(r=>(r.status||"").toLowerCase()==="pending").length;

  return (
    <>
      <div className="topbar"><div><div className="pg-title">Redeem Requests</div><div className="pg-sub">{pending} pending</div></div></div>
      <div className="card">
        {loading ? <div className="loading">Loading…</div>
        : <table className="tbl">
          <thead><tr><th>Employee</th><th>Amount</th><th>For</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {list.length===0 ? <tr><td colSpan={6} style={{textAlign:"center",padding:30,color:"var(--tx2)"}}>No requests</td></tr>
            : list.map(r=>(
              <tr key={r.id}>
                <td>{r.userName||r.userId||"—"}</td>
                <td><span style={{fontWeight:700,color:"var(--grn)"}}>₹{r.pts}</span></td>
                <td>{r.note}</td>
                <td style={{color:"var(--tx2)"}}>{r.date||r.createdAt||""}</td>
                <td><span className={`badge b-${(r.status||"").toUpperCase()}`}>{r.status}</span></td>
                <td>
                  {(r.status||"").toLowerCase()==="pending" ? <>
                    <button className="btn btn-xs btn-grn" onClick={()=>approve(r.id)}>✓ Approve</button>{" "}
                    <button className="btn btn-xs btn-red" onClick={()=>reject(r.id)}>✗ Reject</button>
                  </> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SERVERS
═══════════════════════════════════════════════ */
function Servers({ user, showToast, openModal, closeModal, nav }) {
  const [svrs, setSvrs]   = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const canMgr = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);

  const load = useCallback(async ()=>{
    const [s, st] = await Promise.all([API.servers.all().catch(()=>[]), API.servers.stats().catch(()=>({}))]);
    setSvrs(Array.isArray(s)?s:[]); setStats(st||{});
    setLoading(false);
  },[]);

  useEffect(()=>{ load(); },[load]);

  function openCreate() {
    openModal(<CreateServerModal closeModal={closeModal} showToast={showToast} onRefresh={load} />);
  }

  const online  = svrs.filter(s=>s.status==="online").length;
  const offline = svrs.filter(s=>s.status==="offline").length;
  const warning = svrs.filter(s=>s.status==="warning").length;

  return (
    <>
      <div className="topbar">
        <div><div className="pg-title">Services</div><div className="pg-sub">{svrs.length} registered servers</div></div>
        {canMgr && <button className="btn btn-pri" onClick={openCreate}>＋ Add Service</button>}
      </div>
      <div className="stats-grid-3">
        <div className="stat-card" style={{"--accent-line":"var(--grn)"}}>
          <div className="stat-icon">🟢</div><div className="stat-lbl">Online</div><div className="stat-val">{online}</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--amb)"}}>
          <div className="stat-icon">⚠️</div><div className="stat-lbl">Warning</div><div className="stat-val">{warning}</div>
        </div>
        <div className="stat-card" style={{"--accent-line":"var(--red)"}}>
          <div className="stat-icon">🔴</div><div className="stat-lbl">Offline</div><div className="stat-val">{offline}</div>
        </div>
      </div>
      {loading ? <div className="loading">Loading servers…</div>
      : <div className="infra-grid">
        {svrs.length===0 ? <div className="empty-state"><div className="empty-icon">🖥</div><div className="empty-title">No servers added</div></div>
        : svrs.map(s=>(
          <div key={s.id} className={`server-card sv-${s.status||"offline"}`} onClick={()=>nav("server-detail",s.id)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
              <div className="server-name">{s.name}</div>
              <span className={`badge b-${s.status||"offline"}`}>{s.status||"offline"}</span>
            </div>
            <div className="server-url">{s.url}</div>
            <div style={{display:"flex",gap:8}}>
              <span className={`badge b-${s.type||"node"}`}>{s.type||""}</span>
              <span className={`badge b-${s.environment||s.env||"production"}`}>{s.environment||s.env||""}</span>
            </div>
            <div className="server-metrics">
              {[["CPU",s.cpu||0],[" MEM",s.mem||0],["DISK",s.disk||0]].map(([l,v])=>(
                <div key={l} className="sv-metric">
                  <div className={`sv-metric-val`} style={{color:v>80?"var(--red)":v>60?"var(--amb)":"var(--grn)"}}>{v}%</div>
                  <div className="sv-metric-lbl">{l}</div>
                  <div className="prog-wrap"><div className={`prog-bar ${pbClass(v)}`} style={{width:`${v}%`}}/></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>}
    </>
  );
}

function CreateServerModal({ closeModal, showToast, onRefresh, existing }) {
  const [form, setForm] = useState(existing||{ name:"", url:"", type:"node", environment:"production", status:"online", region:"", cpu:0, mem:0, disk:0 });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  async function save() {
    if (!form.name.trim()) { showToast("Name required.","t-red"); return; }
    setSaving(true);
    try {
      if (existing) await API.servers.update(existing.id, form);
      else          await API.servers.create(form);
      showToast(`✅ Service ${existing?"updated":"added"}!`,"t-grn"); onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }
  return (
    <>
      <div className="modal-title">{existing?"✏ Edit":"🖥 Add"} Service</div>
      <div className="grid2">
        <div className="fg"><label className="fl-lbl">Name *</label><input className="fc" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="API Gateway"/></div>
        <div className="fg"><label className="fl-lbl">URL</label><input className="fc" value={form.url} onChange={e=>set("url",e.target.value)} placeholder="api.example.com"/></div>
      </div>
      <div className="grid3">
        <div className="fg"><label className="fl-lbl">Type</label>
          <select className="fc" value={form.type} onChange={e=>set("type",e.target.value)}>
            {["nginx","node","python","java","go","docker"].map(t=><option key={t}>{t}</option>)}
          </select></div>
        <div className="fg"><label className="fl-lbl">Environment</label>
          <select className="fc" value={form.environment} onChange={e=>set("environment",e.target.value)}>
            {["production","staging","development"].map(t=><option key={t}>{t}</option>)}
          </select></div>
        <div className="fg"><label className="fl-lbl">Status</label>
          <select className="fc" value={form.status} onChange={e=>set("status",e.target.value)}>
            {["online","warning","offline"].map(t=><option key={t}>{t}</option>)}
          </select></div>
      </div>
      <div className="fg"><label className="fl-lbl">Region</label><input className="fc" value={form.region} onChange={e=>set("region",e.target.value)} placeholder="Mumbai"/></div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Saving…":"Save Service"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SERVER DETAIL
═══════════════════════════════════════════════ */
function ServerDetail({ serverId, user, showToast, openModal, closeModal, nav }) {
  const [sv, setSv] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = ["ADMIN","admin"].includes(user.role);
  const canMgr = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);

  const load = useCallback(async()=>{
    try { setSv(await API.servers.byId(serverId)); } catch {}
    setLoading(false);
  },[serverId]);
  useEffect(()=>{ load(); },[load]);

  async function deleteServer() {
    if (!window.confirm("Delete this server?")) return;
    try { await API.servers.delete(serverId); showToast("Server deleted.","t-amb"); nav("servers"); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
  }
  function openEdit() {
    openModal(<CreateServerModal existing={sv} closeModal={closeModal} showToast={showToast} onRefresh={load} />);
  }

  if (loading) return <div className="loading">Loading server…</div>;
  if (!sv) return <div className="loading">Server not found.</div>;

  return (
    <>
      <button className="pg-back" onClick={()=>nav("servers")}>← Services</button>
      <div className="topbar">
        <div>
          <div className="pg-title">{sv.name}</div>
          <div className="pg-sub" style={{fontFamily:"monospace"}}>{sv.url}</div>
        </div>
        <div className="topbar-right">
          <span className={`badge b-${sv.status}`}>{sv.status}</span>
          {canMgr && <button className="btn btn-ghost" onClick={openEdit}>✏ Edit</button>}
          {isAdmin && <button className="btn btn-sm" style={{background:"var(--red-bg)",color:"var(--red)",border:"1px solid rgba(244,63,94,.2)"}} onClick={deleteServer}>Delete</button>}
        </div>
      </div>
      <div className="two-col">
        <div>
          <div className="card">
            <div className="card-title">📊 Metrics</div>
            <div className="server-metrics">
              {[["CPU",sv.cpu||0],["Memory",sv.mem||0],["Disk",sv.disk||0]].map(([l,v])=>(
                <div key={l} className="sv-metric">
                  <div className="sv-metric-val" style={{color:v>80?"var(--red)":v>60?"var(--amb)":"var(--grn)"}}>{v}%</div>
                  <div className="sv-metric-lbl">{l}</div>
                  <div className="prog-wrap"><div className={`prog-bar ${pbClass(v)}`} style={{width:`${v}%`}}/></div>
                </div>
              ))}
            </div>
          </div>
          {sv.endpoints?.length>0 && (
            <div className="card" style={{marginTop:12}}>
              <div className="card-title">🔗 Endpoints</div>
              <div className="terminal">
                {sv.endpoints.map((e,i)=><div key={i}><span style={{color:"var(--grn)"}}>GET </span>{e}</div>)}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="card">
            <div className="card-title">ℹ️ Info</div>
            {[["Type",sv.type],["Environment",sv.environment||sv.env],["Region",sv.region||"—"],["Uptime",fmtUptime(sv.uptime)],["Last Check",sv.lastCheck||"—"]].map(([l,v])=>(
              <div className="ph-item" key={l}>
                <span style={{color:"var(--tx2)",fontSize:12}}>{l}</span>
                <span style={{fontWeight:700,fontFamily:"monospace"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   DATABASES
═══════════════════════════════════════════════ */
function Databases({ user, showToast, openModal, closeModal, nav }) {
  const [dbs, setDbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const canMgr = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);

  const load = useCallback(async()=>{
    try { setDbs(Array.isArray(await API.databases.all()) ? await API.databases.all() : []); }
    catch { setDbs([]); }
    setLoading(false);
  },[]);
  useEffect(()=>{ load(); },[load]);

  function openCreate() {
    openModal(<CreateDbModal closeModal={closeModal} showToast={showToast} onRefresh={load} />);
  }

  return (
    <>
      <div className="topbar">
        <div><div className="pg-title">Databases</div><div className="pg-sub">{dbs.length} databases</div></div>
        {canMgr && <button className="btn btn-pri" onClick={openCreate}>＋ Add Database</button>}
      </div>
      {loading ? <div className="loading">Loading databases…</div>
      : <div className="infra-grid">
        {dbs.length===0 ? <div className="empty-state"><div className="empty-icon">🗄</div><div className="empty-title">No databases added</div></div>
        : dbs.map(db=>(
          <div key={db.id} className="db-card" onClick={()=>nav("db-detail",db.id)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <div><span style={{fontSize:24,marginRight:8}}>{dbIcon(db.type)}</span><span className="db-name">{db.name}</span></div>
              <span className={`badge b-${db.status||"online"}`}>{db.status||"online"}</span>
            </div>
            <div className="db-host">{db.host}:{db.port||5432}</div>
            <div style={{display:"flex",gap:8}}>
              <span className={`badge b-${db.type}`}>{db.type}</span>
              <span className={`badge b-${db.environment||db.env||"production"}`}>{db.environment||db.env}</span>
            </div>
            <div className="db-stats">
              {[["Size",db.size||"—"],["Tables",db.tables??"—"],["Conns",db.connections??db.activeConnections??"—"]].map(([l,v])=>(
                <div key={l} className="db-stat"><div className="db-stat-v">{v}</div><div className="db-stat-l">{l}</div></div>
              ))}
            </div>
          </div>
        ))}
      </div>}
    </>
  );
}

function CreateDbModal({ closeModal, showToast, onRefresh, existing }) {
  const [form, setForm] = useState(existing||{ name:"", host:"", port:5432, type:"postgresql", environment:"production", databaseName:"", username:"", version:"" });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  async function save() {
    if (!form.name.trim()||!form.host.trim()) { showToast("Name and host required.","t-red"); return; }
    setSaving(true);
    try {
      if (existing) await API.databases.update(existing.id, form);
      else          await API.databases.create(form);
      showToast(`✅ Database ${existing?"updated":"added"}!`,"t-grn"); onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }
  return (
    <>
      <div className="modal-title">{existing?"✏ Edit":"🗄 Add"} Database</div>
      <div className="grid2">
        <div className="fg"><label className="fl-lbl">Name *</label><input className="fc" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Primary DB"/></div>
        <div className="fg"><label className="fl-lbl">Host *</label><input className="fc" value={form.host} onChange={e=>set("host",e.target.value)} placeholder="db.example.com"/></div>
      </div>
      <div className="grid3">
        <div className="fg"><label className="fl-lbl">Type</label>
          <select className="fc" value={form.type} onChange={e=>set("type",e.target.value)}>
            {["postgresql","mysql","redis","mongodb","sqlite"].map(t=><option key={t}>{t}</option>)}
          </select></div>
        <div className="fg"><label className="fl-lbl">Port</label><input className="fc" type="number" value={form.port} onChange={e=>set("port",parseInt(e.target.value)||5432)}/></div>
        <div className="fg"><label className="fl-lbl">Environment</label>
          <select className="fc" value={form.environment} onChange={e=>set("environment",e.target.value)}>
            {["production","staging","development"].map(t=><option key={t}>{t}</option>)}
          </select></div>
      </div>
      <div className="grid2">
        <div className="fg"><label className="fl-lbl">Database Name</label><input className="fc" value={form.databaseName} onChange={e=>set("databaseName",e.target.value)} placeholder="myapp_db"/></div>
        <div className="fg"><label className="fl-lbl">Username</label><input className="fc" value={form.username} onChange={e=>set("username",e.target.value)} placeholder="app_user"/></div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Saving…":"Save Database"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   DATABASE DETAIL
═══════════════════════════════════════════════ */
function DbDetail({ dbId, user, showToast, openModal, closeModal, nav }) {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = ["ADMIN","admin"].includes(user.role);
  const canMgr = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);

  const load = useCallback(async()=>{
    try { setDb(await API.databases.byId(dbId)); } catch {}
    setLoading(false);
  },[dbId]);
  useEffect(()=>{ load(); },[load]);

  async function deleteDb() {
    if (!window.confirm("Delete this database entry?")) return;
    try { await API.databases.delete(dbId); showToast("Database deleted.","t-amb"); nav("databases"); }
    catch(ex) { showToast(ex.message||"Error","t-red"); }
  }
  function openEdit() {
    openModal(<CreateDbModal existing={db} closeModal={closeModal} showToast={showToast} onRefresh={load} />);
  }

  if (loading) return <div className="loading">Loading database…</div>;
  if (!db) return <div className="loading">Database not found.</div>;

  return (
    <>
      <button className="pg-back" onClick={()=>nav("databases")}>← Databases</button>
      <div className="topbar">
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:32}}>{dbIcon(db.type)}</span>
            <div><div className="pg-title">{db.name}</div><div className="pg-sub" style={{fontFamily:"monospace"}}>{db.host}:{db.port}</div></div>
          </div>
        </div>
        <div className="topbar-right">
          <span className={`badge b-${db.status||"online"}`}>{db.status||"online"}</span>
          {canMgr && <button className="btn btn-ghost" onClick={openEdit}>✏ Edit</button>}
          {isAdmin && <button className="btn btn-sm" style={{background:"var(--red-bg)",color:"var(--red)",border:"1px solid rgba(244,63,94,.2)"}} onClick={deleteDb}>Delete</button>}
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">🔧 Connection Info</div>
          <div className="terminal">
            <div><span style={{color:"var(--tx2)"}}>host:    </span> <span style={{color:"var(--tx0)"}}>{db.host}</span></div>
            <div><span style={{color:"var(--tx2)"}}>port:    </span> <span style={{color:"var(--cyn)"}}>{db.port}</span></div>
            <div><span style={{color:"var(--tx2)"}}>type:    </span> <span style={{color:"var(--pur)"}}>{db.type}</span></div>
            <div><span style={{color:"var(--tx2)"}}>dbname:  </span> <span style={{color:"var(--tx0)"}}>{db.databaseName||"—"}</span></div>
            <div><span style={{color:"var(--tx2)"}}>user:    </span> <span style={{color:"var(--tx0)"}}>{db.username||"—"}</span></div>
            <div><span style={{color:"var(--tx2)"}}>version: </span> <span style={{color:"var(--tx0)"}}>{db.version||"—"}</span></div>
            <div><span style={{color:"var(--tx2)"}}>env:     </span> <span style={{color:(db.environment||db.env)==="production"?"var(--red)":"var(--amb)"}}>{db.environment||db.env}</span></div>
          </div>
        </div>
        {(db.tables||db.connections||db.qps||db.size) ? (
          <div className="card">
            <div className="card-title">📊 Statistics</div>
            {[["Tables",db.tables],["Active Connections",db.connections||db.activeConnections],["Queries/sec",db.qps],["Total Size",db.size]].filter(([,v])=>v!=null).map(([l,v])=>(
              <div className="ph-item" key={l}>
                <span style={{color:"var(--tx2)",fontSize:12}}>{l}</span>
                <span style={{fontWeight:700,fontFamily:"monospace"}}>{v}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   CHAT
═══════════════════════════════════════════════ */
function Chat({ user, showToast, openModal, closeModal }) {
  const [rooms, setRooms]     = useState([]);
  const [activeRoom, setAR]   = useState(null);
  const [messages, setMsgs]   = useState([]);
  const [text, setText]       = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const msgsRef = useRef(null);
  const wsRef   = useRef(null);

  const loadRooms = useCallback(async()=>{
    try { const r = await API.chat.rooms(); setRooms(Array.isArray(r)?r:[]); if(r?.[0]) setAR(r[0]); }
    catch { setRooms([]); }
    setLoading(false);
  },[]);

  const loadMsgs = useCallback(async(roomId)=>{
    if (!roomId) return;
    try { const m = await API.chat.messages(roomId); setMsgs(Array.isArray(m)?m:[]); }
    catch { setMsgs([]); }
    setTimeout(()=>{ if(msgsRef.current) msgsRef.current.scrollTop=msgsRef.current.scrollHeight; },50);
  },[]);

  useEffect(()=>{ loadRooms(); },[loadRooms]);
  useEffect(()=>{ if(activeRoom) loadMsgs(activeRoom.id); },[activeRoom, loadMsgs]);

  // WebSocket connection
  useEffect(()=>{
    if (!activeRoom) return;
    wsRef.current?.close();
    try {
      const ws = API.connectWS(activeRoom.id, (msg)=>{
        if (msg.type==="MESSAGE"||msg.text) setMsgs(m=>[...m, msg]);
      });
      wsRef.current = ws;
    } catch {}
    return ()=>{ wsRef.current?.close(); };
  },[activeRoom]);

  async function send() {
    if (!text.trim()||!activeRoom) return;
    setSending(true);
    try {
      const m = await API.chat.send(activeRoom.id, text.trim(), null);
      setMsgs(prev=>[...prev, m]);
      setText("");
      setTimeout(()=>{ if(msgsRef.current) msgsRef.current.scrollTop=msgsRef.current.scrollHeight; },50);
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSending(false);
  }

  function openCreateRoom() {
    openModal(<CreateRoomModal closeModal={closeModal} showToast={showToast} onRefresh={loadRooms} />);
  }

  if (loading) return <div className="loading">Loading chat…</div>;

  return (
    <div className="chat-wrap" style={{height:"calc(100vh - 0px)",overflow:"hidden"}}>
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div style={{padding:"14px",borderBottom:"1px solid var(--br)",fontSize:12,fontWeight:800,color:"var(--tx0)",textTransform:"uppercase",letterSpacing:".06em"}}>
          💬 Channels
        </div>
        <div style={{overflowY:"auto",flex:1,padding:6}}>
          {rooms.map(r=>(
            <div key={r.id} className={`chat-room-item ${activeRoom?.id===r.id?"active":""}`} onClick={()=>setAR(r)}>
              <span style={{fontSize:16}}>{r.icon||"💬"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div className="chat-room-name">{r.name}</div>
                <div className="chat-room-last">{r.description||""}</div>
              </div>
              <span className={`badge b-${r.type||"public"}`} style={{fontSize:9}}>{r.type}</span>
            </div>
          ))}
        </div>
        <div style={{padding:12,borderTop:"1px solid var(--br)"}}>
          <button className="btn btn-sm btn-ghost" style={{width:"100%"}} onClick={openCreateRoom}>＋ Channel</button>
        </div>
      </div>
      {/* Chat Area */}
      <div className="chat-area">
        {activeRoom ? (
          <>
            <div className="chat-header">
              <span style={{fontSize:20}}>{activeRoom.icon||"💬"}</span>
              <div>
                <div style={{fontWeight:800,color:"var(--tx0)"}}>{activeRoom.name}</div>
                <div style={{fontSize:11,color:"var(--tx2)"}}>{activeRoom.description}</div>
              </div>
              <span className={`badge b-${activeRoom.type}`} style={{marginLeft:"auto"}}>{activeRoom.type}</span>
            </div>
            <div className="chat-msgs" ref={msgsRef}>
              {messages.length===0 ? (
                <div className="empty-state"><div className="empty-icon">💬</div><div className="empty-title">No messages yet</div>Be the first to say something!</div>
              ) : messages.map((msg,i)=>{
                const isMe = msg.senderId===user.id || msg.userId===user.id;
                const senderName = msg.senderName||msg.userName||"User";
                return (
                  <div key={msg.id||i} className={`msg-row ${isMe?"mine":""}`}>
                    {!isMe && <div className="avatar av-xs" style={{background:"var(--acc-bg)",color:"var(--acc)"}}>{ini(senderName)}</div>}
                    <div>
                      {!isMe && <div style={{fontSize:10,color:"var(--tx2)",marginBottom:3,fontWeight:700}}>{senderName}</div>}
                      <div className={`msg-bubble ${isMe?"mine":""}`}>{msg.text||msg.content||""}</div>
                      <div className="msg-meta" style={isMe?{textAlign:"right"}:{}}>{msg.sentAt||msg.at||msg.createdAt||""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chat-input-row">
              <textarea className="chat-input" rows={1} value={text} onChange={e=>setText(e.target.value)}
                placeholder={`Message #${activeRoom.name}…`}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }} />
              <button className="btn btn-pri" onClick={send} disabled={sending}>Send</button>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{margin:"auto"}}>
            <div className="empty-icon">💬</div>
            <div className="empty-title">Select a channel</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateRoomModal({ closeModal, showToast, onRefresh }) {
  const [form, setForm] = useState({ name:"", description:"", type:"public", icon:"💬" });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const icons = { public:"💬", team:"👥", project:"📋", announcement:"📢" };
  async function save() {
    if (!form.name.trim()) { showToast("Channel name required.","t-red"); return; }
    setSaving(true);
    try {
      await API.chat.createRoom({ ...form, icon: icons[form.type]||"💬" });
      showToast("✅ Channel created!","t-grn"); onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }
  return (
    <>
      <div className="modal-title">💬 Create Channel</div>
      <div className="fg"><label className="fl-lbl">Channel Name *</label><input className="fc" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. design-review"/></div>
      <div className="fg"><label className="fl-lbl">Description</label><input className="fc" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What is this channel for?"/></div>
      <div className="fg"><label className="fl-lbl">Type</label>
        <select className="fc" value={form.type} onChange={e=>set("type",e.target.value)}>
          <option value="public">Public</option><option value="team">Team</option><option value="project">Project</option><option value="announcement">Announcement</option>
        </select></div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Creating…":"Create Channel"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   CALENDAR
═══════════════════════════════════════════════ */
function Calendar({ user, showToast, openModal, closeModal }) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMgr = ["ADMIN","MANAGER","admin","manager"].includes(user.role);
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const load = useCallback(async()=>{
    try { const e = await API.calendar.all(); setEvents(Array.isArray(e)?e:[]); }
    catch { setEvents([]); }
    setLoading(false);
  },[]);
  useEffect(()=>{ load(); },[load]);

  function prev() { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }
  function next() { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }

  const today   = todayStr();
  const firstDow = (new Date(year,month,1).getDay()+6)%7;
  const lastDay  = new Date(year,month+1,0).getDate();

  function dateStr(d) { return `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  function eventsOn(ds) { return events.filter(e=>e.date===ds||e.eventDate===ds); }

  function showDay(ds) {
    const dayEvs = eventsOn(ds);
    if (!dayEvs.length) return;
    openModal(
      <>
        <div className="modal-title">📅 {fmtDateShort(ds)}</div>
        {dayEvs.map((e,i)=>(
          <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--br)",borderRadius:"var(--rs)",padding:14,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:20}}>{e.type==="holiday"?"🏖️":e.type==="meeting"?"📊":"⭐"}</span>
              <div>
                <div style={{fontWeight:800,color:"var(--tx0)"}}>{e.title}</div>
                <span className={`badge b-${e.type}`}>{e.type}</span>
              </div>
            </div>
            {e.description && <div style={{fontSize:12,color:"var(--tx1)"}}>{e.description}</div>}
          </div>
        ))}
        <div className="modal-footer"><button className="btn btn-ghost" onClick={closeModal}>Close</button></div>
      </>
    );
  }

  function openAddEvent() {
    openModal(<AddEventModal closeModal={closeModal} showToast={showToast} onRefresh={load} />);
  }

  const upcoming = [...events].filter(e=>(e.date||e.eventDate)>=today).sort((a,b)=>(a.date||a.eventDate).localeCompare(b.date||b.eventDate));

  return (
    <>
      <div className="topbar">
        <div><div className="pg-title">Calendar</div><div className="pg-sub">Holidays, events and meetings</div></div>
        {isMgr && <button className="btn btn-pri" onClick={openAddEvent}>＋ Event</button>}
      </div>
      <div className="two-col-wide">
        <div className="card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <button className="btn btn-ghost btn-sm" onClick={prev}>‹ Prev</button>
            <div style={{fontSize:16,fontWeight:800}}>{MONTHS[month]} {year}</div>
            <button className="btn btn-ghost btn-sm" onClick={next}>Next ›</button>
          </div>
          <div className="cal-grid">
            {DAYS.map(d=><div key={d} className="cal-hdr">{d}</div>)}
            {Array(firstDow).fill(null).map((_,i)=><div key={`e-${i}`} className="cal-day other-month"/>)}
            {Array.from({length:lastDay},(_,i)=>{
              const ds = dateStr(i+1);
              const dayEvs = eventsOn(ds);
              const isToday = ds===today;
              const hasHoliday = dayEvs.some(e=>e.type==="holiday");
              return (
                <div key={i} className={`cal-day ${isToday?"today":""} ${hasHoliday?"has-holiday":""}`} onClick={()=>showDay(ds)}>
                  <div className="cal-day-num">{i+1}</div>
                  {dayEvs.slice(0,2).map((e,j)=>(
                    <div key={j} className="cal-event-dot" style={{background:`${e.color||"#4f8ef7"}22`,color:e.color||"#4f8ef7"}}>
                      {e.title}
                    </div>
                  ))}
                  {dayEvs.length>2 && <div style={{fontSize:9,color:"var(--tx2)",marginTop:2}}>+{dayEvs.length-2} more</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card">
            <div className="card-title">📅 Upcoming Events</div>
            {loading ? <div className="loading" style={{padding:16}}>Loading…</div>
            : upcoming.length===0 ? <div style={{fontSize:12,color:"var(--tx2)"}}>No upcoming events</div>
            : upcoming.slice(0,8).map((e,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid var(--br)"}}>
                <div style={{width:36,height:36,borderRadius:8,background:`${e.color||"#4f8ef7"}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                  {e.type==="holiday"?"🏖️":e.type==="meeting"?"📊":"⭐"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{e.title}</div>
                  <div style={{fontSize:11,color:"var(--tx2)"}}>{fmtDateShort(e.date||e.eventDate)}</div>
                  {e.description && <div style={{fontSize:11,color:"var(--tx2)",marginTop:2}}>{e.description}</div>}
                </div>
                <span className={`badge b-${e.type}`}>{e.type}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">🏖️ Holidays ({events.filter(e=>e.type==="holiday").length})</div>
            {events.filter(e=>e.type==="holiday").length===0 ? <div style={{fontSize:12,color:"var(--tx2)"}}>No holidays added</div>
            : events.filter(e=>e.type==="holiday").map((e,i)=>(
              <div className="ph-item" key={i}>
                <div><div style={{fontSize:12,fontWeight:700}}>{e.title}</div><div style={{fontSize:10,color:"var(--tx2)"}}>{fmtDateShort(e.date||e.eventDate)}</div></div>
                <span className="badge b-holiday">Holiday</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AddEventModal({ closeModal, showToast, onRefresh }) {
  const [form, setForm] = useState({ title:"", description:"", date:todayStr(), type:"meeting", color:"#22d3a2" });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const colorMap = { meeting:"#22d3a2", event:"#a78bfa", holiday:"#ec4899" };
  async function save() {
    if (!form.title.trim()) { showToast("Title required.","t-red"); return; }
    setSaving(true);
    try {
      await API.calendar.create({ ...form, color: colorMap[form.type]||form.color });
      showToast("✅ Event added!","t-grn"); onRefresh?.(); closeModal();
    } catch(ex) { showToast(ex.message||"Error","t-red"); }
    setSaving(false);
  }
  return (
    <>
      <div className="modal-title">📅 Add Event</div>
      <div className="fg"><label className="fl-lbl">Event Title *</label><input className="fc" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Team Offsite"/></div>
      <div className="fg"><label className="fl-lbl">Description</label><textarea className="fc" value={form.description} onChange={e=>set("description",e.target.value)} rows={2}/></div>
      <div className="grid2">
        <div className="fg"><label className="fl-lbl">Date *</label><input className="fc" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></div>
        <div className="fg"><label className="fl-lbl">Type</label>
          <select className="fc" value={form.type} onChange={e=>set("type",e.target.value)}>
            <option value="meeting">Meeting</option><option value="event">Event</option><option value="holiday">Holiday</option>
          </select></div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-pri" onClick={save} disabled={saving}>{saving?"Adding…":"Add Event"}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SIDEBAR NAV
═══════════════════════════════════════════════ */
function Sidebar({ user, screen, nav, onLogout, redeemCount, svWarn, dbWarn }) {
  const isAdmin = ["ADMIN","admin"].includes(user.role);
  const isMgr   = ["ADMIN","MANAGER","admin","manager"].includes(user.role);
  const canMgr  = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);

  return (
    <div className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">N</div>
        <div><div className="sb-brand-n">Nexus Pro</div><div className="sb-brand-s">Company OS</div></div>
      </div>
      <div id="nav-list">
        <div className="nav-sec">Workspace</div>
        {[
          ["dashboard","⬡","Dashboard"],
          ["my-tasks","✓","My Tasks"],
          ["projects","◫","Projects"],
          ["chat","💬","Team Chat"],
          ["calendar","📅","Calendar"],
          ["points","★","Points & Rewards"],
        ].map(([s,icon,label])=>(
          <button key={s} className={`nav-item ${screen===s?"active":""}`} onClick={()=>nav(s)}>
            <span className="nav-icon">{icon}</span>{label}
          </button>
        ))}
        {canMgr && <>
          <div className="nav-sec">Management</div>
          <button className={`nav-item ${screen==="teams"?"active":""}`} onClick={()=>nav("teams")}>
            <span className="nav-icon">⊞</span>Teams & Roles
          </button>
          <button className={`nav-item ${screen==="assign"?"active":""}`} onClick={()=>nav("assign")}>
            <span className="nav-icon">↗</span>Assign Task
          </button>
          {isMgr && (
            <button className={`nav-item ${screen==="redeems"?"active":""}`} onClick={()=>nav("redeems")}>
              <span className="nav-icon">💳</span>Redeems
              {redeemCount>0 && <span className="nav-badge">{redeemCount}</span>}
            </button>
          )}
          {isAdmin && (
            <button className={`nav-item ${screen==="add-emp"?"active":""}`} onClick={()=>nav("add-emp")}>
              <span className="nav-icon">＋</span>Add Employee
            </button>
          )}
          <div className="nav-sec">Infrastructure</div>
          <button className={`nav-item ${screen==="servers"?"active":""}`} onClick={()=>nav("servers")}>
            <span className="nav-icon">🖥</span>Services
            {svWarn>0 && <span className="nav-badge">{svWarn}</span>}
          </button>
          <button className={`nav-item ${screen==="databases"?"active":""}`} onClick={()=>nav("databases")}>
            <span className="nav-icon">🗄</span>Databases
            {dbWarn>0 && <span className="nav-badge">{dbWarn}</span>}
          </button>
        </>}
      </div>
      <div className="sb-user">
        <div className="sb-user-row">
          <div className="avatar av-md" style={avStyle(user.color||"#4f8ef7")}>{ini(user.name)}</div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"var(--tx0)"}}>{user.name}</div>
            <div style={{fontSize:10,color:"var(--tx2)"}}>{rl(user.role)}</div>
          </div>
        </div>
        <button className="logout-lnk" onClick={onLogout}>← Sign out</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════════ */
function AppShell({ user, onLogout }) {
  const [screen, setScreen] = useState("dashboard");
  const [param, setParam]   = useState(null);
  const [redeemCount, setRC] = useState(0);
  const [svWarn, setSW]      = useState(0);
  const [dbWarn, setDW]      = useState(0);
  const { show: showToast, Toast } = useToast();
  const { open: openModal, close: closeModal, Modal } = useModal();

  const nav = useCallback((s, p=null)=>{ setScreen(s); setParam(p); },[]);

  useEffect(()=>{
    const isMgr = ["ADMIN","MANAGER","admin","manager"].includes(user.role);
    const canMgr = ["ADMIN","MANAGER","TL","admin","manager","tl"].includes(user.role);
    if (isMgr) API.redeems.all().catch(()=>[]).then(r=>setRC(Array.isArray(r)?r.filter(x=>(x.status||"").toLowerCase()==="pending").length:0));
    if (canMgr) {
      API.servers.all().catch(()=>[]).then(s=>setSW(Array.isArray(s)?s.filter(x=>x.status!=="online").length:0));
      API.databases.all().catch(()=>[]).then(d=>setDW(Array.isArray(d)?d.filter(x=>x.status!=="online").length:0));
    }
  },[user.role]);

  const props = { user, showToast, openModal, closeModal, nav };

  function renderScreen() {
    const screenParts = screen.split("-");
    switch(screen) {
      case "dashboard":     return <Dashboard {...props} />;
      case "my-tasks":      return <MyTasks {...props} />;
      case "projects":      return <Projects {...props} />;
      case "proj-detail":   return <ProjectDetail {...props} projId={param} />;
      case "kanban":        return <KanbanBoard {...props} projId={param} />;
      case "teams":         return <Teams {...props} />;
      case "team-detail":   return <TeamDetail {...props} teamId={param} />;
      case "assign":        return <AssignTask {...props} />;
      case "points":        return <PointsRewards {...props} />;
      case "redeems":       return <Redeems {...props} />;
      case "add-emp":       return <AddEmployee {...props} />;
      case "servers":       return <Servers {...props} />;
      case "server-detail": return <ServerDetail {...props} serverId={param} />;
      case "databases":     return <Databases {...props} />;
      case "db-detail":     return <DbDetail {...props} dbId={param} />;
      case "chat":          return <Chat {...props} />;
      case "calendar":      return <Calendar {...props} />;
      default:              return <Dashboard {...props} />;
    }
  }

  const isFullHeight = screen==="chat";

  return (
    <div className="app-wrap">
      <Sidebar user={user} screen={screen} nav={nav} onLogout={onLogout}
        redeemCount={redeemCount} svWarn={svWarn} dbWarn={dbWarn}/>
      <div className="main">
        {isFullHeight ? (
          <div style={{height:"100%"}}>{renderScreen()}</div>
        ) : (
          <div className="main-inner">{renderScreen()}</div>
        )}
      </div>
      {Modal}
      {Toast}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);

  // Inject CSS once
  useEffect(()=>{
    if (!document.getElementById("nexus-css")) {
      const s = document.createElement("style");
      s.id = "nexus-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  },[]);

  // Try restoring session
  useEffect(()=>{
    const tok = API.getToken();
    if (tok) {
      API.users.me().then(me => setUser(me)).catch(()=>API.clearTokens());
    }
  },[]);

  function handleLogin(me) { setUser(me); }
  function handleLogout() { API.clearTokens(); setUser(null); }

  if (!user) return <Login onLogin={handleLogin} />;
  return <AppShell user={user} onLogout={handleLogout} />;
}
