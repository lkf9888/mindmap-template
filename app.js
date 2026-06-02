const canvas = document.querySelector("#canvas");
const appShell = document.querySelector("#appShell");
const authScreen = document.querySelector("#authScreen");
const loginForm = document.querySelector("#loginForm");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginError = document.querySelector("#loginError");
const world = document.querySelector("#world");
const nodesLayer = document.querySelector("#nodesLayer");
const edgesLayer = document.querySelector("#edgesLayer");
const contextMenu = document.querySelector("#contextMenu");

const undoBtn = document.querySelector("#undoBtn");
const addNodeBtn = document.querySelector("#addNodeBtn");
const connectBtn = document.querySelector("#connectBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const zoomOutBtn = document.querySelector("#zoomOutBtn");
const zoomInBtn = document.querySelector("#zoomInBtn");
const resetViewBtn = document.querySelector("#resetViewBtn");
const layoutHorizontalBtn = document.querySelector("#layoutHorizontalBtn");
const layoutVerticalBtn = document.querySelector("#layoutVerticalBtn");
const shareBtn = document.querySelector("#shareBtn");
const languageBtn = document.querySelector("#languageBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const readonlyBadge = document.querySelector("#readonlyBadge");
const newMapBtn = document.querySelector("#newMapBtn");
const mapTitleInput = document.querySelector("#mapTitleInput");
const mapList = document.querySelector("#mapList");
const exportBackupBtn = document.querySelector("#exportBackupBtn");
const importBackupInput = document.querySelector("#importBackupInput");
const restoreBackupBtn = document.querySelector("#restoreBackupBtn");
const dataStatus = document.querySelector("#dataStatus");

const selectionHint = document.querySelector("#selectionHint");
const readonlyNotice = document.querySelector("#readonlyNotice");
const nodeForm = document.querySelector("#nodeForm");
const edgeForm = document.querySelector("#edgeForm");
const nodeType = document.querySelector("#nodeType");
const nodeText = document.querySelector("#nodeText");
const nodeUrl = document.querySelector("#nodeUrl");
const nodeUrlLabel = document.querySelector("#nodeUrlLabel");
const nodeShape = document.querySelector("#nodeShape");
const nodeColor = document.querySelector("#nodeColor");
const nodeColorPalette = document.querySelector("#nodeColorPalette");
const nodeFontSize = document.querySelector("#nodeFontSize");
const nodeFontFamily = document.querySelector("#nodeFontFamily");
const edgeLabel = document.querySelector("#edgeLabel");
const edgeShape = document.querySelector("#edgeShape");
const edgeLineStyle = document.querySelector("#edgeLineStyle");
const edgeArrow = document.querySelector("#edgeArrow");
const edgeColor = document.querySelector("#edgeColor");
const zoomLabel = document.querySelector("#zoomLabel");
const modeLabel = document.querySelector("#modeLabel");
const canvasHelp = document.querySelector(".canvas-help");
const noteEditor = document.querySelector("#noteEditor");
const noteForm = document.querySelector("#noteForm");
const noteTextArea = document.querySelector("#noteTextArea");
const noteCloseBtn = document.querySelector("#noteCloseBtn");
const noteCancelBtn = document.querySelector("#noteCancelBtn");

const MAP_STORAGE_KEY = "mindmap-template.maps.v1";
const MAP_BACKUP_STORAGE_KEY = "mindmap-template.maps.backups.v1";
const STORAGE_VERSION = 2;
const BACKUP_LIMIT = 50;
const UNDO_LIMIT = 80;
const UNDO_COALESCE_MS = 1200;
const EDGE_NODE_GAP = 8;
const LOCALE_STORAGE_KEY = "mindmap-template.locale";
const AUTH_SESSION_KEY = "mindmap-template.auth.session.v1";
const AUTH_EMAIL = "lkf9888@gmail.com";
const CLOUD_SAVE_DEBOUNCE_MS = 900;
const nodeColorOptions = [
  "#dbeafe",
  "#bfdbfe",
  "#e0f2fe",
  "#cffafe",
  "#ccfbf1",
  "#dcfce7",
  "#d9f99d",
  "#fef9c3",
  "#fef3c7",
  "#fed7aa",
  "#fee2e2",
  "#fecaca",
  "#fce7f3",
  "#fbcfe8",
  "#fae8ff",
  "#e9d5ff",
  "#ede9fe",
  "#e0e7ff",
  "#f1f5f9",
  "#e2e8f0",
  "#d1fae5",
  "#fde68a",
  "#fca5a5",
  "#c4b5fd",
];
const fontFamilies = {
  system: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif',
  serif: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", "Noto Sans Mono CJK SC", monospace',
  rounded: '"Arial Rounded MT Bold", "Nunito", "Noto Sans SC", sans-serif',
};

const state = {
  nodes: [
    {
      id: "node-1",
      x: 260,
      y: 230,
      type: "title",
      text: "项目计划",
      url: "",
      color: "#dbeafe",
      shape: "rounded",
      width: 184,
      height: 76,
      fontSize: 18,
      fontFamily: "system",
    },
    {
      id: "node-2",
      x: 560,
      y: 130,
      type: "paragraph",
      text: "收集需求、确认目标用户和主要使用场景。",
      url: "",
      color: "#dcfce7",
      shape: "note",
      width: 220,
      height: 92,
      fontSize: 14,
      fontFamily: "system",
    },
    {
      id: "node-3",
      x: 560,
      y: 330,
      type: "title",
      text: "设计原型",
      url: "",
      color: "#fef3c7",
      shape: "pill",
      width: 184,
      height: 72,
      fontSize: 18,
      fontFamily: "system",
    },
    {
      id: "node-4",
      x: 860,
      y: 230,
      type: "link",
      text: "参考资料",
      url: "https://example.com",
      color: "#fce7f3",
      shape: "circle",
      width: 136,
      height: 136,
      fontSize: 14,
      fontFamily: "system",
    },
  ],
  edges: [
    {
      id: "edge-1",
      from: "node-1",
      to: "node-2",
      color: "#2563eb",
      shape: "curved",
      arrow: "forward",
      label: "需求输入",
    },
    {
      id: "edge-2",
      from: "node-1",
      to: "node-3",
      color: "#0f766e",
      shape: "elbow",
      arrow: "forward",
      label: "进入设计",
    },
    {
      id: "edge-3",
      from: "node-3",
      to: "node-4",
      color: "#9333ea",
      shape: "straight",
      arrow: "both",
      label: "双向参考",
    },
  ],
  selectedNodeId: "node-1",
  selectedEdgeId: null,
  connectFromId: null,
  mode: "select",
  scale: 1,
  pan: { x: 80, y: 60 },
  drag: null,
  undoStack: [],
  isRestoringHistory: false,
  nextNodeId: 5,
  nextEdgeId: 4,
  readOnly: false,
  maps: [],
  activeMapId: "map-default",
  activeMapTitle: "项目计划",
  editingNoteId: null,
  cloudSaveTimer: null,
  cloudSaveInFlight: false,
  pendingCloudPayload: null,
  pendingCloudSilent: false,
  cloudAvailable: false,
  locale: getStoredLocale(),
};

const allowedNodeTypes = new Set(["title", "paragraph", "link"]);
const allowedNodeShapes = new Set(["rounded", "pill", "circle", "diamond", "note"]);
const allowedEdgeShapes = new Set(["curved", "straight", "elbow"]);
const allowedEdgeLineStyles = new Set(["solid", "dashed"]);
const allowedEdgeArrows = new Set(["forward", "backward", "both", "none"]);
const allowedFontFamilies = new Set(Object.keys(fontFamilies));

const i18n = {
  zh: {
    "app.title": "思维脑图绘制模板",
    "app.subtitle": "简易脑图模板",
    "toolbar.undo": "撤回",
    "toolbar.addNode": "新建节点",
    "toolbar.connect": "连接",
    "toolbar.delete": "删除",
    "toolbar.zoomOut": "缩小",
    "toolbar.zoomIn": "放大",
    "toolbar.reset": "归位",
    "toolbar.horizontal": "横向排布",
    "toolbar.vertical": "纵向排布",
    "toolbar.share": "分享只读链接",
    "toolbar.shareCopied": "已复制",
    "toolbar.shareCreated": "已生成",
    "toolbar.logout": "退出登录",
    "toolbar.readonlyBadge": "只读查看",
    "auth.subtitle": "登录后继续编辑脑图",
    "auth.email": "邮箱",
    "auth.password": "密码",
    "auth.login": "登录",
    "auth.error": "邮箱或密码不正确。",
    "maps.title": "脑图目录",
    "maps.new": "新建",
    "maps.currentName": "当前脑图名称",
    "maps.defaultTitle": "项目计划",
    "maps.untitled": "未命名脑图",
    "maps.sharedTitle": "分享脑图",
    "maps.nodeCount": "{count} 个节点",
    "maps.edgeCount": "{count} 条连接",
    "maps.exportBackup": "导出备份",
    "maps.importBackup": "导入备份",
    "maps.restoreBackup": "恢复最近备份",
    "maps.dataStatusReady": "数据会自动保存在此浏览器，并在每次覆盖前保留安全备份。",
    "maps.dataStatusSaved": "已保存，并已保留覆盖前备份。",
    "maps.dataStatusCloudLoading": "正在从云端加载脑图数据...",
    "maps.dataStatusCloudLoaded": "已加载云端脑图数据，并同步到此浏览器。",
    "maps.dataStatusCloudSaved": "已保存到此浏览器，并已同步到云端。",
    "maps.dataStatusCloudSaveFailed": "已保存到此浏览器，但云同步失败。请稍后重试或导出备份。",
    "maps.dataStatusCloudAuthRequired": "云同步需要重新登录一次。此浏览器本地数据仍然保留。",
    "maps.dataStatusCloudUnavailable": "当前无法连接云同步，已使用此浏览器本地数据。",
    "maps.dataStatusExported": "备份文件已导出。",
    "maps.dataStatusImported": "已导入 {count} 个脑图，原有数据未覆盖。",
    "maps.dataStatusRestored": "已从最近备份恢复。",
    "maps.dataStatusRecovered": "检测到存储异常，已从安全备份恢复。",
    "maps.dataStatusProtected": "检测到旧数据读取异常，原始内容已转存为安全备份。",
    "maps.dataStatusSaveFailed": "保存失败：浏览器存储空间不足或被限制。请立即导出备份。",
    "maps.dataStatusImportFailed": "导入失败：备份文件格式不正确。",
    "maps.dataStatusNoBackup": "没有可恢复的备份。",
    "canvas.helpEdit": "右键创建/删除 · 滚轮缩放 · 拖动画布平移 · 拖动节点移动 · 拖右下角调整节点大小",
    "canvas.helpReadonly": "只读查看 · 滚轮缩放 · 拖动画布平移 · 点击节点或连接线查看属性",
    "inspector.selection": "选择内容",
    "inspector.selectionHint": "选择一个节点或连接线后，在这里编辑属性。",
    "inspector.readonlyNotice": "当前是只读分享视图，可以查看、缩放和平移，不能编辑内容。",
    "node.title": "节点属性",
    "node.type": "类型",
    "node.typeTitle": "标题",
    "node.typeParagraph": "文字段落",
    "node.typeLink": "超链接",
    "node.content": "内容",
    "node.url": "链接地址",
    "node.shape": "形状",
    "node.shapeRounded": "圆角矩形",
    "node.shapePill": "胶囊",
    "node.shapeCircle": "圆形",
    "node.shapeDiamond": "菱形",
    "node.shapeNote": "便签",
    "node.color": "颜色",
    "node.palette": "快速颜色",
    "node.fontSize": "文字大小",
    "node.fontFamily": "字体",
    "node.fontSystem": "系统默认",
    "node.fontSerif": "衬线字体",
    "node.fontMono": "等宽字体",
    "node.fontRounded": "圆润字体",
    "node.new": "新节点",
    "node.child": "子节点",
    "node.branch": "新分支",
    "node.untitledTitle": "未命名标题",
    "node.paragraphFallback": "文字段落",
    "node.linkFallback": "超链接",
    "node.visitLink": "访问 Link",
    "node.noteTitle": "备注",
    "node.closeNote": "关闭备注",
    "edge.title": "连接线属性",
    "edge.label": "文字注释",
    "edge.labelPlaceholder": "例如：依赖、参考、下一步",
    "edge.shape": "线条形状",
    "edge.shapeCurved": "曲线",
    "edge.shapeStraight": "直线",
    "edge.shapeElbow": "折线",
    "edge.lineStyle": "线条样式",
    "edge.lineSolid": "实线",
    "edge.lineDashed": "虚线",
    "edge.arrow": "箭头方向",
    "edge.arrowForward": "正向",
    "edge.arrowBackward": "反向",
    "edge.arrowBoth": "双向",
    "edge.arrowNone": "无箭头",
    "edge.color": "颜色",
    "view.title": "视图",
    "view.zoom": "缩放",
    "view.mode": "模式",
    "mode.select": "选择",
    "mode.connect": "连接",
    "mode.readonly": "只读",
    "menu.connectFrom": "从此节点开始连线",
    "menu.copyNode": "复制本节点",
    "menu.addNote": "添加/编辑备注",
    "menu.copyChild": "复制一个子节点",
    "menu.deleteNode": "删除节点",
    "menu.reverseArrow": "反转箭头",
    "menu.deleteEdge": "删除连接线",
    "menu.createHere": "在这里新建节点",
    "menu.createLinked": "新建并连接所选节点",
    "menu.clearSelection": "清除选择",
    "prompt.copyReadonly": "复制这个只读链接",
    "prompt.nodeNote": "输入本节点备注内容，留空会删除备注：",
    "note.editorTitle": "编辑备注",
    "note.content": "备注内容",
    "note.placeholder": "输入详细备注，可换行记录更多信息。",
    "note.emptyHint": "保存空内容会删除本节点备注。",
    "note.save": "保存备注",
    "common.cancel": "取消",
    "common.close": "关闭",
    "maps.dataStatusUndone": "已撤回上一步操作。",
  },
  en: {
    "app.title": "Mind Map Drawing Template",
    "app.subtitle": "Simple mind map template",
    "toolbar.undo": "Undo",
    "toolbar.addNode": "New node",
    "toolbar.connect": "Connect",
    "toolbar.delete": "Delete",
    "toolbar.zoomOut": "Zoom out",
    "toolbar.zoomIn": "Zoom in",
    "toolbar.reset": "Reset",
    "toolbar.horizontal": "Horizontal",
    "toolbar.vertical": "Vertical",
    "toolbar.share": "Share read-only link",
    "toolbar.shareCopied": "Copied",
    "toolbar.shareCreated": "Created",
    "toolbar.logout": "Log out",
    "toolbar.readonlyBadge": "Read only",
    "auth.subtitle": "Sign in to continue editing",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.login": "Sign in",
    "auth.error": "Email or password is incorrect.",
    "maps.title": "Mind maps",
    "maps.new": "New",
    "maps.currentName": "Current map name",
    "maps.defaultTitle": "Project plan",
    "maps.untitled": "Untitled map",
    "maps.sharedTitle": "Shared map",
    "maps.nodeCount": "{count} nodes",
    "maps.edgeCount": "{count} links",
    "maps.exportBackup": "Export backup",
    "maps.importBackup": "Import backup",
    "maps.restoreBackup": "Restore latest backup",
    "maps.dataStatusReady": "Data is saved in this browser with a safety backup before each overwrite.",
    "maps.dataStatusSaved": "Saved, with a pre-overwrite safety backup kept.",
    "maps.dataStatusCloudLoading": "Loading mind map data from the cloud...",
    "maps.dataStatusCloudLoaded": "Loaded cloud mind map data and synced it to this browser.",
    "maps.dataStatusCloudSaved": "Saved in this browser and synced to the cloud.",
    "maps.dataStatusCloudSaveFailed": "Saved in this browser, but cloud sync failed. Try again later or export a backup.",
    "maps.dataStatusCloudAuthRequired": "Cloud sync requires signing in again. Local browser data is still preserved.",
    "maps.dataStatusCloudUnavailable": "Cloud sync is unavailable right now; using this browser's local data.",
    "maps.dataStatusExported": "Backup file exported.",
    "maps.dataStatusImported": "Imported {count} maps without overwriting existing data.",
    "maps.dataStatusRestored": "Restored from the latest backup.",
    "maps.dataStatusRecovered": "Storage issue detected; recovered from a safety backup.",
    "maps.dataStatusProtected": "Stored data could not be read; the raw content was preserved as a safety backup.",
    "maps.dataStatusSaveFailed": "Save failed: browser storage is full or blocked. Export a backup now.",
    "maps.dataStatusImportFailed": "Import failed: the backup file format is invalid.",
    "maps.dataStatusNoBackup": "No restorable backup found.",
    "canvas.helpEdit": "Right-click to create/delete · Wheel to zoom · Drag canvas to pan · Drag nodes to move · Drag lower-right handle to resize",
    "canvas.helpReadonly": "Read-only view · Wheel to zoom · Drag canvas to pan · Click nodes or links to inspect",
    "inspector.selection": "Selection",
    "inspector.selectionHint": "Select a node or link, then edit its properties here.",
    "inspector.readonlyNotice": "This is a read-only shared view. You can inspect, zoom, and pan, but cannot edit.",
    "node.title": "Node properties",
    "node.type": "Type",
    "node.typeTitle": "Title",
    "node.typeParagraph": "Paragraph",
    "node.typeLink": "Link",
    "node.content": "Content",
    "node.url": "URL",
    "node.shape": "Shape",
    "node.shapeRounded": "Rounded rectangle",
    "node.shapePill": "Pill",
    "node.shapeCircle": "Circle",
    "node.shapeDiamond": "Diamond",
    "node.shapeNote": "Note",
    "node.color": "Color",
    "node.palette": "Quick colors",
    "node.fontSize": "Font size",
    "node.fontFamily": "Font",
    "node.fontSystem": "System",
    "node.fontSerif": "Serif",
    "node.fontMono": "Monospace",
    "node.fontRounded": "Rounded",
    "node.new": "New node",
    "node.child": "Child node",
    "node.branch": "New branch",
    "node.untitledTitle": "Untitled title",
    "node.paragraphFallback": "Paragraph",
    "node.linkFallback": "Link",
    "node.visitLink": "Open link",
    "node.noteTitle": "Note",
    "node.closeNote": "Close note",
    "edge.title": "Link properties",
    "edge.label": "Text note",
    "edge.labelPlaceholder": "Example: depends on, reference, next step",
    "edge.shape": "Line shape",
    "edge.shapeCurved": "Curve",
    "edge.shapeStraight": "Straight",
    "edge.shapeElbow": "Elbow",
    "edge.lineStyle": "Line style",
    "edge.lineSolid": "Solid",
    "edge.lineDashed": "Dashed",
    "edge.arrow": "Arrow direction",
    "edge.arrowForward": "Forward",
    "edge.arrowBackward": "Backward",
    "edge.arrowBoth": "Both",
    "edge.arrowNone": "None",
    "edge.color": "Color",
    "view.title": "View",
    "view.zoom": "Zoom",
    "view.mode": "Mode",
    "mode.select": "Select",
    "mode.connect": "Connect",
    "mode.readonly": "Read only",
    "menu.connectFrom": "Start link here",
    "menu.copyNode": "Duplicate this node",
    "menu.addNote": "Add/edit note",
    "menu.copyChild": "Create child copy",
    "menu.deleteNode": "Delete node",
    "menu.reverseArrow": "Reverse arrow",
    "menu.deleteEdge": "Delete link",
    "menu.createHere": "Create node here",
    "menu.createLinked": "Create and link selected node",
    "menu.clearSelection": "Clear selection",
    "prompt.copyReadonly": "Copy this read-only link",
    "prompt.nodeNote": "Enter this node note. Leave blank to remove it:",
    "note.editorTitle": "Edit note",
    "note.content": "Note content",
    "note.placeholder": "Enter detailed notes. Line breaks are supported.",
    "note.emptyHint": "Saving empty content removes this node note.",
    "note.save": "Save note",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "maps.dataStatusUndone": "Undid the last action.",
  },
};

let appInitialized = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function t(key, replacements = {}) {
  const template = i18n[state.locale]?.[key] || i18n.zh[key] || key;
  return Object.entries(replacements).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, value);
  }, template);
}

function getStoredLocale() {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY) === "en" ? "en" : "zh";
  } catch (error) {
    return "zh";
  }
}

function setDataStatus(key, replacements = {}) {
  if (!dataStatus) {
    return;
  }

  dataStatus.textContent = t(key, replacements);
}

function pushUndo(label, options = {}) {
  if (state.readOnly || state.isRestoringHistory || !state.maps.length) {
    return;
  }

  const now = Date.now();
  const lastEntry = state.undoStack[state.undoStack.length - 1];
  if (
    options.coalesceKey &&
    lastEntry?.coalesceKey === options.coalesceKey &&
    now - lastEntry.timestamp < UNDO_COALESCE_MS
  ) {
    lastEntry.timestamp = now;
    return;
  }

  state.undoStack.push({
    activeMapId: state.activeMapId,
    coalesceKey: options.coalesceKey || null,
    label,
    snapshot: createMapSnapshot(),
    timestamp: now,
  });

  if (state.undoStack.length > UNDO_LIMIT) {
    state.undoStack.splice(0, state.undoStack.length - UNDO_LIMIT);
  }

  syncUndoButton();
}

function clearUndoHistory() {
  state.undoStack = [];
  syncUndoButton();
}

function syncUndoButton() {
  if (!undoBtn) {
    return;
  }

  undoBtn.disabled = state.readOnly || !state.undoStack.length;
}

function undoLastAction() {
  if (state.readOnly || !state.undoStack.length) {
    return;
  }

  const entry = state.undoStack.pop();
  const restoredMap = normalizeMap(entry.snapshot);
  if (!restoredMap) {
    syncUndoButton();
    return;
  }

  state.isRestoringHistory = true;
  const index = state.maps.findIndex((map) => map.id === entry.activeMapId);
  if (index >= 0) {
    state.maps[index] = restoredMap;
  } else {
    state.maps.push(restoredMap);
  }

  applyMap(restoredMap);
  saveMapsToStorage({ silent: true });
  render();
  renderMapList();
  setDataStatus("maps.dataStatusUndone");
  state.isRestoringHistory = false;
  syncUndoButton();
}

function isReadonlyShareUrl() {
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  return (params.get("view") === "readonly" || params.get("readonly") === "1") && hashParams.has("map");
}

function getAuthSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
  } catch (error) {
    return null;
  }
}

function isAuthenticated() {
  const session = getAuthSession();
  return session?.email === AUTH_EMAIL && session?.authenticated === true;
}

function rememberAuthenticatedSession(email = AUTH_EMAIL) {
  try {
    localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({
        authenticated: true,
        email: String(email).toLowerCase(),
        signedInAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.warn("Unable to persist login session.", error);
  }
}

async function hasServerSession() {
  try {
    const response = await fetch("/api/auth", {
      credentials: "include",
      headers: {
        "Cache-Control": "no-store",
      },
    });
    if (!response.ok) {
      return false;
    }
    const result = await response.json();
    return Boolean(result.authenticated);
  } catch (error) {
    return false;
  }
}

function showLoginScreen() {
  authScreen.hidden = false;
  appShell.hidden = true;
  loginEmail.value = "LKF9888@gmail.com";
  loginPassword.value = "";
  loginError.hidden = true;
  window.setTimeout(() => loginPassword.focus(), 0);
}

function unlockApp() {
  authScreen.hidden = true;
  appShell.hidden = false;
  void initializeApp();
}

async function handleLogin(event) {
  event.preventDefault();
  loginError.hidden = true;

  const email = loginEmail.value.trim().toLowerCase();
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: loginPassword.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials.");
    }

    rememberAuthenticatedSession(email);
    unlockApp();
  } catch (error) {
    loginError.hidden = false;
    loginPassword.select();
  }
}

async function logout() {
  try {
    await fetch("/api/auth", {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.warn("Unable to clear cloud login session.", error);
  }

  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch (error) {
    console.warn("Unable to clear login session.", error);
  }
  showLoginScreen();
}

function applyLocale() {
  document.documentElement.lang = state.locale === "en" ? "en" : "zh-CN";
  document.title = t("app.title");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  languageBtn.textContent = state.locale === "zh" ? "EN" : "中文";
  nodesLayer.querySelectorAll(".node-link-button").forEach((button) => {
    button.textContent = t("node.visitLink");
  });
  languageBtn.setAttribute("aria-pressed", String(state.locale === "en"));
  setMode(state.mode === "connect" ? "connect" : "select");
  syncReadOnlyControls();
  renderMapList();
  if (!dataStatus.textContent.trim()) {
    setDataStatus("maps.dataStatusReady");
  }
}

function getNode(id) {
  return state.nodes.find((node) => node.id === id);
}

function getEdge(id) {
  return state.edges.find((edge) => edge.id === id);
}

function setMode(mode) {
  if (state.readOnly) {
    state.mode = "readonly";
    state.connectFromId = null;
    connectBtn.classList.remove("is-active");
    modeLabel.textContent = t("mode.readonly");
    return;
  }

  state.mode = mode;
  connectBtn.classList.toggle("is-active", mode === "connect");
  modeLabel.textContent = mode === "connect" ? t("mode.connect") : t("mode.select");
}

function selectNode(id) {
  state.selectedNodeId = id;
  state.selectedEdgeId = null;
  render();
}

function selectEdge(id) {
  state.selectedEdgeId = id;
  state.selectedNodeId = null;
  render();
}

function clearSelection() {
  state.selectedNodeId = null;
  state.selectedEdgeId = null;
  state.connectFromId = null;
  setMode("select");
  render();
}

function worldPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - state.pan.x) / state.scale,
    y: (event.clientY - rect.top - state.pan.y) / state.scale,
  };
}

function viewportCenterAsWorldPoint() {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (rect.width / 2 - state.pan.x) / state.scale,
    y: (rect.height / 2 - state.pan.y) / state.scale,
  };
}

function applyTransform({ animate = false } = {}) {
  world.classList.toggle("is-zooming", animate);
  world.style.transform = `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.scale})`;
  zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;

  if (animate) {
    window.setTimeout(() => world.classList.remove("is-zooming"), 130);
  }
}

function createNode(point, options = {}) {
  if (state.readOnly) {
    return null;
  }

  if (!options.skipUndo) {
    pushUndo("create-node");
  }

  const newNode = {
    id: `node-${state.nextNodeId++}`,
    x: finiteNumber(point.x, 0) - 92,
    y: finiteNumber(point.y, 0) - 38,
    type: options.type || "title",
    text: options.text || t("node.new"),
    url: "",
    color: options.color || "#e0f2fe",
    shape: options.shape || "rounded",
    width: options.width || 184,
    height: options.height || 76,
    fontSize: options.fontSize || 18,
    fontFamily: options.fontFamily || "system",
  };

  state.nodes.push(newNode);

  if (options.connectFromId) {
    createEdge(options.connectFromId, newNode.id, { skipUndo: true });
  }

  selectNode(newNode.id);
  persistActiveMap();
  return newNode;
}

function createEdge(from, to, options = {}) {
  if (state.readOnly) {
    return null;
  }

  if (!from || !to || from === to) {
    return null;
  }

  const duplicate = state.edges.find((edge) => edge.from === from && edge.to === to);
  if (duplicate) {
    selectEdge(duplicate.id);
    return duplicate;
  }

  if (!options.skipUndo) {
    pushUndo("create-edge");
  }

  const edge = {
    id: `edge-${state.nextEdgeId++}`,
    from,
    to,
    color: "#2563eb",
    shape: "straight",
    lineStyle: "solid",
    arrow: "forward",
    label: "",
  };

  state.edges.push(edge);
  selectEdge(edge.id);
  persistActiveMap();
  return edge;
}

function duplicateNode(id, offset = { x: 42, y: 42 }) {
  if (state.readOnly) {
    return null;
  }

  const source = getNode(id);
  if (!source) {
    return null;
  }

  pushUndo("duplicate-node");

  const duplicate = {
    ...source,
    id: `node-${state.nextNodeId++}`,
    x: finiteNumber(source.x, 0) + offset.x,
    y: finiteNumber(source.y, 0) + offset.y,
  };

  state.nodes.push(duplicate);
  selectNode(duplicate.id);
  persistActiveMap();
  return duplicate;
}

function editNodeNote(id) {
  if (state.readOnly) {
    return;
  }

  const node = getNode(id);
  if (!node) {
    return;
  }

  state.editingNoteId = id;
  noteTextArea.value = node.note || "";
  noteEditor.hidden = false;
  window.setTimeout(() => noteTextArea.focus(), 0);
}

function closeNoteEditor() {
  state.editingNoteId = null;
  noteTextArea.value = "";
  noteEditor.hidden = true;
}

function saveNoteEditor(event) {
  event.preventDefault();

  if (state.readOnly) {
    closeNoteEditor();
    return;
  }

  const node = getNode(state.editingNoteId);
  if (!node) {
    closeNoteEditor();
    return;
  }

  const trimmedNote = noteTextArea.value.trim();
  if (trimmedNote === (node.note || "")) {
    closeNoteEditor();
    return;
  }

  pushUndo("edit-note");
  node.note = trimmedNote;
  node.noteOpen = Boolean(trimmedNote);
  node.noteWidth = finiteNumber(node.noteWidth, 280);
  node.noteHeight = finiteNumber(node.noteHeight, 130);
  render();
  persistActiveMap();
  closeNoteEditor();
}

function setNodeNoteOpen(id, isOpen, options = {}) {
  const node = getNode(id);
  if (!node?.note) {
    return false;
  }

  node.noteOpen = Boolean(isOpen);
  render();
  if (!state.readOnly && options.persist !== false) {
    persistActiveMap();
  }
  return true;
}

function toggleNodeNote(id, options = {}) {
  const node = getNode(id);
  if (!node?.note) {
    return false;
  }

  return setNodeNoteOpen(id, !node.noteOpen, options);
}

function deleteSelected() {
  if (state.readOnly) {
    return;
  }

  if (state.selectedNodeId || state.selectedEdgeId) {
    pushUndo("delete");
  }

  if (state.selectedNodeId) {
    const id = state.selectedNodeId;
    state.nodes = state.nodes.filter((node) => node.id !== id);
    state.edges = state.edges.filter((edge) => edge.from !== id && edge.to !== id);
    state.selectedNodeId = null;
    state.connectFromId = null;
  } else if (state.selectedEdgeId) {
    const id = state.selectedEdgeId;
    state.edges = state.edges.filter((edge) => edge.id !== id);
    state.selectedEdgeId = null;
  }

  setMode("select");
  render();
  persistActiveMap();
}

function render() {
  renderNodes();
  requestAnimationFrame(renderEdges);
  syncInspector();
  applyTransform();
}

function renderNodes() {
  nodesLayer.innerHTML = "";

  state.nodes.forEach((node) => {
    const dimensions = getNodeDimensions(node);
    const element = document.createElement("article");
    element.className = `node node--${node.shape}`;
    element.dataset.id = node.id;
    element.style.left = `${node.x}px`;
    element.style.top = `${node.y}px`;
    element.style.width = `${dimensions.width}px`;
    element.style.height = `${dimensions.height}px`;
    element.style.background = node.color;
    element.classList.toggle("is-selected", node.id === state.selectedNodeId);
    element.classList.toggle("is-readonly", state.readOnly);

    const content = document.createElement("div");
    content.className = "node-content";
    content.style.fontFamily = fontFamilies[node.fontFamily] || fontFamilies.system;

    if (node.type === "title") {
      const title = document.createElement("h3");
      title.style.fontSize = `${getNodeFontSize(node)}px`;
      title.textContent = node.text || t("node.untitledTitle");
      content.append(title);
    } else if (node.type === "link") {
      const link = document.createElement("a");
      link.href = node.url || "#";
      link.target = "_blank";
      link.rel = "noreferrer";
      link.style.fontSize = `${getNodeFontSize(node)}px`;
      link.textContent = node.text || node.url || t("node.linkFallback");
      content.append(link);
    } else {
      const paragraph = document.createElement("p");
      paragraph.style.fontSize = `${getNodeFontSize(node)}px`;
      paragraph.textContent = node.text || t("node.paragraphFallback");
      content.append(paragraph);
    }

    element.append(content);

    if (node.type === "link" && node.url) {
      const visitButton = document.createElement("button");
      visitButton.type = "button";
      visitButton.className = "node-link-button";
      visitButton.textContent = t("node.visitLink");
      visitButton.addEventListener("pointerdown", (event) => event.stopPropagation());
      visitButton.addEventListener("click", (event) => {
        event.stopPropagation();
        window.open(node.url, "_blank", "noopener,noreferrer");
      });
      element.append(visitButton);
    }

    if (node.note) {
      const noteButton = document.createElement("button");
      noteButton.type = "button";
      noteButton.className = "node-note-toggle";
      noteButton.textContent = t("node.noteTitle");
      noteButton.title = t("node.noteTitle");
      noteButton.addEventListener("pointerdown", (event) => event.stopPropagation());
      noteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleNodeNote(node.id);
      });
      element.append(noteButton);

      if (node.noteOpen) {
        const noteBox = document.createElement("section");
        noteBox.className = "node-note";
        noteBox.style.width = `${clamp(finiteNumber(node.noteWidth, 280), 180, 560)}px`;
        noteBox.style.height = `${clamp(finiteNumber(node.noteHeight, 130), 80, 460)}px`;
        noteBox.addEventListener("pointerdown", (event) => {
          if (!event.target.closest(".node-note-resize")) {
            event.stopPropagation();
          }
        });

        const noteHeader = document.createElement("div");
        noteHeader.className = "node-note-header";

        const noteTitle = document.createElement("strong");
        noteTitle.textContent = t("node.noteTitle");
        const closeNoteButton = document.createElement("button");
        closeNoteButton.type = "button";
        closeNoteButton.className = "node-note-close";
        closeNoteButton.textContent = "×";
        closeNoteButton.setAttribute("aria-label", t("node.closeNote"));
        closeNoteButton.title = t("node.closeNote");
        closeNoteButton.addEventListener("pointerdown", (event) => event.stopPropagation());
        closeNoteButton.addEventListener("click", (event) => {
          event.stopPropagation();
          setNodeNoteOpen(node.id, false);
        });
        noteHeader.append(noteTitle, closeNoteButton);

        const noteText = document.createElement("p");
        noteText.textContent = node.note;
        noteBox.append(noteHeader, noteText);

        if (!state.readOnly) {
          const noteResize = document.createElement("span");
          noteResize.className = "node-note-resize";
          noteResize.dataset.id = node.id;
          noteBox.append(noteResize);
        }

        element.append(noteBox);
      }
    }

    if (!state.readOnly) {
      const resizeHandle = document.createElement("span");
      resizeHandle.className = "node-resize-handle";
      resizeHandle.dataset.id = node.id;
      element.append(resizeHandle);
    }

    nodesLayer.append(element);
  });
}

function getNodeDimensions(node) {
  const defaultDimensions = getDefaultNodeDimensions(node.shape);
  return {
    width: clamp(finiteNumber(node.width, defaultDimensions.width), 96, 520),
    height: clamp(finiteNumber(node.height, defaultDimensions.height), 56, 360),
  };
}

function getDefaultNodeDimensions(shape) {
  if (shape === "circle") {
    return { width: 136, height: 136 };
  }

  if (shape === "diamond") {
    return { width: 154, height: 154 };
  }

  if (shape === "pill") {
    return { width: 184, height: 72 };
  }

  return { width: 184, height: 76 };
}

function getNodeFontSize(node) {
  return clamp(finiteNumber(node.fontSize, node.type === "title" ? 18 : 14), 10, 48);
}

function renderEdges() {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  edgesLayer.replaceChildren(defs);

  state.edges.forEach((edge) => {
    const fromBounds = getNodeBounds(edge.from);
    const toBounds = getNodeBounds(edge.to);

    if (!fromBounds || !toBounds) {
      return;
    }

    const pathData = buildEdgePath(edge, fromBounds, toBounds);
    const markerIds = ensureMarkers(defs, edge);

    const visiblePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    visiblePath.setAttribute("d", pathData);
    visiblePath.setAttribute("stroke", edge.color);
    visiblePath.setAttribute("stroke-width", edge.id === state.selectedEdgeId ? "4" : "3");
    visiblePath.setAttribute("class", `edge-path${edge.id === state.selectedEdgeId ? " is-selected" : ""}`);
    visiblePath.dataset.id = edge.id;

    if (edge.lineStyle === "dashed") {
      visiblePath.setAttribute("stroke-dasharray", "12 9");
    }

    if (edge.arrow === "forward" || edge.arrow === "both") {
      visiblePath.setAttribute("marker-end", `url(#${markerIds.end})`);
    }

    if (edge.arrow === "backward" || edge.arrow === "both") {
      visiblePath.setAttribute("marker-start", `url(#${markerIds.start})`);
    }

    const hitPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hitPath.setAttribute("d", pathData);
    hitPath.setAttribute("class", "edge-hitbox");
    hitPath.dataset.id = edge.id;

    edgesLayer.append(hitPath, visiblePath);

    const label = createEdgeLabel(edge, fromBounds, toBounds);
    if (label) {
      edgesLayer.append(label);
    }
  });
}

function createEdgeLabel(edge, from, to) {
  const text = edge.label?.trim();
  if (!text) {
    return null;
  }

  const position = getEdgeLabelPosition(edge, from, to);
  const width = clamp(text.length * 12 + 30, 82, 240);
  const height = text.length > 16 ? 42 : 30;
  const label = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  label.setAttribute("x", `${position.x - width / 2}`);
  label.setAttribute("y", `${position.y - height / 2}`);
  label.setAttribute("width", `${width}`);
  label.setAttribute("height", `${height}`);
  label.setAttribute("class", `edge-label${edge.id === state.selectedEdgeId ? " is-selected" : ""}`);
  label.dataset.id = edge.id;

  const box = document.createElement("div");
  box.className = "edge-label-box";
  box.textContent = text;
  label.append(box);

  return label;
}

function getNodeBounds(id) {
  const node = getNode(id);
  const element = nodesLayer.querySelector(`[data-id="${id}"]`);

  if (!node || !element) {
    return null;
  }

  return {
    x: node.x,
    y: node.y,
    width: element.offsetWidth,
    height: element.offsetHeight,
    centerX: node.x + element.offsetWidth / 2,
    centerY: node.y + element.offsetHeight / 2,
  };
}

function buildEdgePath(edge, from, to) {
  const { start, end } = getEdgeEndpoints(from, to);
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  if (edge.shape === "straight") {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  if (edge.shape === "elbow") {
    const midX = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }

  const distance = Math.max(80, Math.abs(x2 - x1) * 0.45);
  const controlX1 = x1 + (x2 >= x1 ? distance : -distance);
  const controlX2 = x2 - (x2 >= x1 ? distance : -distance);
  return `M ${x1} ${y1} C ${controlX1} ${y1}, ${controlX2} ${y2}, ${x2} ${y2}`;
}

function getEdgeLabelPosition(edge, from, to) {
  const { start, end } = getEdgeEndpoints(from, to);
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  if (edge.shape === "elbow") {
    return {
      x: x1 + (x2 - x1) / 2,
      y: y1 + (y2 - y1) / 2,
    };
  }

  if (edge.shape === "curved") {
    const distance = Math.max(80, Math.abs(x2 - x1) * 0.45);
    const controlX1 = x1 + (x2 >= x1 ? distance : -distance);
    const controlX2 = x2 - (x2 >= x1 ? distance : -distance);
    const t = 0.5;
    const oneMinusT = 1 - t;

    return {
      x:
        oneMinusT ** 3 * x1 +
        3 * oneMinusT ** 2 * t * controlX1 +
        3 * oneMinusT * t ** 2 * controlX2 +
        t ** 3 * x2,
      y:
        oneMinusT ** 3 * y1 +
        3 * oneMinusT ** 2 * t * y1 +
        3 * oneMinusT * t ** 2 * y2 +
        t ** 3 * y2,
    };
  }

  return {
    x: x1 + (x2 - x1) / 2,
    y: y1 + (y2 - y1) / 2,
  };
}

function getEdgeEndpoints(from, to) {
  const sourceCenter = { x: from.centerX, y: from.centerY };
  const targetCenter = { x: to.centerX, y: to.centerY };
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  const length = Math.hypot(dx, dy) || 1;
  const unit = { x: dx / length, y: dy / length };
  const sourceBoundary = projectPointToNodeBoundary(from, unit);
  const targetBoundary = projectPointToNodeBoundary(to, { x: -unit.x, y: -unit.y });

  return {
    start: {
      x: sourceBoundary.x + unit.x * EDGE_NODE_GAP,
      y: sourceBoundary.y + unit.y * EDGE_NODE_GAP,
    },
    end: {
      x: targetBoundary.x - unit.x * EDGE_NODE_GAP,
      y: targetBoundary.y - unit.y * EDGE_NODE_GAP,
    },
  };
}

function projectPointToNodeBoundary(bounds, direction) {
  const halfWidth = Math.max(bounds.width / 2, 1);
  const halfHeight = Math.max(bounds.height / 2, 1);
  const absX = Math.abs(direction.x);
  const absY = Math.abs(direction.y);
  const scale = Math.min(
    absX > 0 ? halfWidth / absX : Number.POSITIVE_INFINITY,
    absY > 0 ? halfHeight / absY : Number.POSITIVE_INFINITY,
  );

  return {
    x: bounds.centerX + direction.x * scale,
    y: bounds.centerY + direction.y * scale,
  };
}

function ensureMarkers(defs, edge) {
  const startId = `${edge.id}-arrow-start`;
  const endId = `${edge.id}-arrow-end`;
  const markerData = [
    { id: startId, orient: "auto-start-reverse" },
    { id: endId, orient: "auto" },
  ];

  markerData.forEach((data) => {
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", data.id);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "7");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("orient", data.orient);

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    arrow.setAttribute("fill", edge.color);
    marker.append(arrow);
    defs.append(marker);
  });

  return { start: startId, end: endId };
}

function syncInspector() {
  const node = state.selectedNodeId ? getNode(state.selectedNodeId) : null;
  const edge = state.selectedEdgeId ? getEdge(state.selectedEdgeId) : null;

  selectionHint.hidden = Boolean(node || edge);
  nodeForm.hidden = !node;
  edgeForm.hidden = !edge;
  readonlyNotice.hidden = !state.readOnly;

  if (node) {
    nodeType.value = node.type;
    nodeText.value = node.text;
    nodeUrl.value = node.url;
    nodeUrlLabel.hidden = node.type !== "link";
    nodeShape.value = node.shape;
    nodeColor.value = node.color;
    syncColorPalette(node.color);
    nodeFontSize.value = getNodeFontSize(node);
    nodeFontFamily.value = allowedFontFamilies.has(node.fontFamily) ? node.fontFamily : "system";
  }

  if (edge) {
    edgeLabel.value = edge.label || "";
    edgeShape.value = edge.shape;
    edgeLineStyle.value = edge.lineStyle || "solid";
    edgeArrow.value = edge.arrow;
    edgeColor.value = edge.color;
  }

  syncReadOnlyControls();
}

function syncReadOnlyControls() {
  const editButtons = [addNodeBtn, connectBtn, deleteBtn, layoutHorizontalBtn, layoutVerticalBtn, newMapBtn, restoreBackupBtn];
  editButtons.forEach((button) => {
    button.disabled = state.readOnly;
  });

  mapTitleInput.disabled = state.readOnly;
  importBackupInput.disabled = state.readOnly;
  document.querySelector(".file-import-button")?.classList.toggle("is-disabled", state.readOnly);
  nodeColorPalette.querySelectorAll("button").forEach((button) => {
    button.disabled = state.readOnly;
  });

  [nodeForm, edgeForm].forEach((form) => {
    form.querySelectorAll("input, select, textarea").forEach((control) => {
      control.disabled = state.readOnly;
    });
  });

  readonlyBadge.hidden = !state.readOnly;
  appShell.classList.toggle("viewer-mode", state.readOnly);
  canvasHelp.textContent = state.readOnly ? t("canvas.helpReadonly") : t("canvas.helpEdit");
  syncUndoButton();
}

function renderColorPalette() {
  nodeColorPalette.replaceChildren();

  nodeColorOptions.forEach((color) => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "color-swatch";
    swatch.dataset.color = color;
    swatch.style.background = color;
    swatch.title = color;
    swatch.setAttribute("aria-label", color);
    swatch.addEventListener("click", () => {
      nodeColor.value = color;
      updateSelectedNode({ color });
      syncColorPalette(color);
    });
    nodeColorPalette.append(swatch);
  });
}

function syncColorPalette(selectedColor) {
  nodeColorPalette.querySelectorAll(".color-swatch").forEach((swatch) => {
    swatch.classList.toggle("is-selected", swatch.dataset.color?.toLowerCase() === selectedColor?.toLowerCase());
  });
}

function openContextMenu(event, items) {
  contextMenu.replaceChildren();

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    button.className = item.danger ? "danger" : "";
    button.addEventListener("click", () => {
      closeContextMenu();
      item.action();
    });
    contextMenu.append(button);
  });

  contextMenu.hidden = false;
  const menuRect = contextMenu.getBoundingClientRect();
  const left = Math.min(event.clientX, window.innerWidth - menuRect.width - 8);
  const top = Math.min(event.clientY, window.innerHeight - menuRect.height - 8);
  contextMenu.style.left = `${left}px`;
  contextMenu.style.top = `${top}px`;
}

function closeContextMenu() {
  contextMenu.hidden = true;
}

function handleNodePointerDown(event) {
  const nodeElement = event.target.closest(".node");
  if (!nodeElement || event.button !== 0) {
    return;
  }

  const node = getNode(nodeElement.dataset.id);
  if (!node) {
    return;
  }

  event.stopPropagation();

  if (state.readOnly) {
    selectNode(node.id);
    toggleNodeNote(node.id, { persist: false });
    return;
  }

  if (event.target.closest(".node-link-button, .node-note-toggle, .node-note-close")) {
    return;
  }

  if (event.target.closest(".node-note-resize")) {
    const point = worldPointFromEvent(event);
    selectNode(node.id);
    state.drag = {
      type: "resize-note",
      id: node.id,
      startX: point.x,
      startY: point.y,
      startWidth: clamp(finiteNumber(node.noteWidth, 280), 180, 560),
      startHeight: clamp(finiteNumber(node.noteHeight, 130), 80, 460),
      historyCaptured: false,
    };
    return;
  }

  if (event.target.closest(".node-resize-handle")) {
    const point = worldPointFromEvent(event);
    const dimensions = getNodeDimensions(node);
    selectNode(node.id);
    state.drag = {
      type: "resize-node",
      id: node.id,
      startX: point.x,
      startY: point.y,
      startWidth: dimensions.width,
      startHeight: dimensions.height,
      historyCaptured: false,
    };
    return;
  }

  if (state.mode === "connect") {
    if (state.connectFromId && state.connectFromId !== node.id) {
      createEdge(state.connectFromId, node.id);
      state.connectFromId = null;
      setMode("select");
      render();
    } else {
      state.connectFromId = node.id;
      selectNode(node.id);
    }
    return;
  }

  selectNode(node.id);

  const startPoint = worldPointFromEvent(event);
  state.drag = {
    type: "node",
    id: node.id,
    offsetX: startPoint.x - node.x,
    offsetY: startPoint.y - node.y,
    historyCaptured: false,
    moved: false,
    toggleNoteOnPointerUp: Boolean(node.note),
  };
}

function handleCanvasPointerDown(event) {
  if (
    event.button !== 0 ||
    event.target.closest(".context-menu") ||
    event.target.closest(".node") ||
    event.target.closest(".edge-path, .edge-hitbox, .edge-label")
  ) {
    return;
  }

  closeContextMenu();
  const rect = canvas.getBoundingClientRect();
  state.drag = {
    type: "canvas",
    startX: event.clientX,
    startY: event.clientY,
    panX: state.pan.x,
    panY: state.pan.y,
    rect,
    moved: false,
  };
  clearSelection();
}

function handlePointerMove(event) {
  if (!state.drag) {
    return;
  }

  if (state.drag.type === "node") {
    const node = getNode(state.drag.id);
    const point = worldPointFromEvent(event);
    if (node) {
      if (!state.drag.historyCaptured) {
        pushUndo("move-node");
        state.drag.historyCaptured = true;
      }
      state.drag.moved = true;
      node.x = point.x - state.drag.offsetX;
      node.y = point.y - state.drag.offsetY;
      renderNodes();
      renderEdges();
      syncInspector();
    }
    return;
  }

  if (state.drag.type === "resize-node") {
    const node = getNode(state.drag.id);
    const point = worldPointFromEvent(event);
    if (node) {
      if (!state.drag.historyCaptured) {
        pushUndo("resize-node");
        state.drag.historyCaptured = true;
      }
      node.width = clamp(state.drag.startWidth + point.x - state.drag.startX, 96, 520);
      node.height = clamp(state.drag.startHeight + point.y - state.drag.startY, 56, 360);
      renderNodes();
      renderEdges();
      syncInspector();
    }
    return;
  }

  if (state.drag.type === "resize-note") {
    const node = getNode(state.drag.id);
    const point = worldPointFromEvent(event);
    if (node) {
      if (!state.drag.historyCaptured) {
        pushUndo("resize-note");
        state.drag.historyCaptured = true;
      }
      node.noteWidth = clamp(state.drag.startWidth + point.x - state.drag.startX, 180, 560);
      node.noteHeight = clamp(state.drag.startHeight + point.y - state.drag.startY, 80, 460);
      renderNodes();
      renderEdges();
      syncInspector();
    }
    return;
  }

  state.pan.x = state.drag.panX + event.clientX - state.drag.startX;
  state.pan.y = state.drag.panY + event.clientY - state.drag.startY;
  state.drag.moved = true;
  applyTransform();
}

function handlePointerUp() {
  if (state.drag) {
    let shouldPersist = true;
    if (state.drag.type === "node" && !state.drag.moved && state.drag.toggleNoteOnPointerUp) {
      toggleNodeNote(state.drag.id, { persist: false });
    } else if (state.drag.type === "node") {
      shouldPersist = state.drag.moved;
    } else if (state.drag.type === "resize-node" || state.drag.type === "resize-note") {
      shouldPersist = state.drag.historyCaptured;
    } else if (state.drag.type === "canvas") {
      shouldPersist = state.drag.moved;
    }

    if (shouldPersist) {
      persistActiveMap();
    }
  }

  state.drag = null;
}

function updateSelectedNode(patch, options = {}) {
  if (state.readOnly) {
    return;
  }

  const node = state.selectedNodeId ? getNode(state.selectedNodeId) : null;
  if (!node) {
    return;
  }

  pushUndo("update-node", { coalesceKey: options.coalesceKey || `node-${node.id}-${Object.keys(patch).join("-")}` });
  Object.assign(node, patch);
  render();
  persistActiveMap();
}

function updateSelectedEdge(patch, options = {}) {
  if (state.readOnly) {
    return;
  }

  const edge = state.selectedEdgeId ? getEdge(state.selectedEdgeId) : null;
  if (!edge) {
    return;
  }

  pushUndo("update-edge", { coalesceKey: options.coalesceKey || `edge-${edge.id}-${Object.keys(patch).join("-")}` });
  Object.assign(edge, patch);
  render();
  persistActiveMap();
}

function zoomAt(factor, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const originX = clientX ?? rect.left + rect.width / 2;
  const originY = clientY ?? rect.top + rect.height / 2;
  const worldX = (originX - rect.left - state.pan.x) / state.scale;
  const worldY = (originY - rect.top - state.pan.y) / state.scale;
  const nextScale = clamp(state.scale * factor, 0.3, 2.4);

  state.pan.x = originX - rect.left - worldX * nextScale;
  state.pan.y = originY - rect.top - worldY * nextScale;
  state.scale = nextScale;
  applyTransform({ animate: true });
}

function arrange(direction) {
  if (state.readOnly) {
    return;
  }

  const root = state.nodes[0];
  if (!root) {
    return;
  }

  const groups = groupNodesByDepth(root.id);
  const columnGap = 300;
  const rowGap = 150;

  pushUndo("arrange");
  groups.forEach((group, depth) => {
    group.forEach((node, index) => {
      if (direction === "vertical") {
        node.x = 240 + index * 230 - (group.length - 1) * 115;
        node.y = 130 + depth * 190;
      } else {
        node.x = 220 + depth * columnGap;
        node.y = 180 + index * rowGap - (group.length - 1) * 75;
      }
    });
  });

  render();
  persistActiveMap();
}

function groupNodesByDepth(rootId) {
  const visited = new Set([rootId]);
  const groups = [[getNode(rootId)]];
  let frontier = [rootId];

  while (frontier.length) {
    const next = [];
    frontier.forEach((id) => {
      state.edges
        .filter((edge) => edge.from === id || edge.to === id)
        .forEach((edge) => {
          const targetId = edge.from === id ? edge.to : edge.from;
          if (!visited.has(targetId)) {
            visited.add(targetId);
            next.push(targetId);
          }
        });
    });

    if (next.length) {
      groups.push(next.map(getNode).filter(Boolean));
    }

    frontier = next;
  }

  const remaining = state.nodes.filter((node) => !visited.has(node.id));
  if (remaining.length) {
    groups.push(remaining);
  }

  return groups;
}

function createMapSnapshot() {
  return {
    version: 1,
    id: state.activeMapId,
    name: state.activeMapTitle,
    nodes: state.nodes.map((node) => ({ ...node })),
    edges: state.edges.map((edge) => ({ ...edge })),
    nextNodeId: state.nextNodeId,
    nextEdgeId: state.nextEdgeId,
    view: {
      pan: { ...state.pan },
      scale: state.scale,
    },
  };
}

function createMapId() {
  return `map-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createStoredMapFromState(name = state.activeMapTitle) {
  const existingMap = state.maps.find((map) => map.id === state.activeMapId);
  return {
    ...existingMap,
    ...createMapSnapshot(),
    id: state.activeMapId || createMapId(),
    name: name || t("maps.untitled"),
  };
}

function createBlankMap(name) {
  const mapName = name || `${t("maps.untitled")} ${state.maps.length + 1}`;
  return {
    version: 1,
    id: createMapId(),
    name: mapName,
    nodes: [
      {
        id: "node-1",
        x: 320,
        y: 240,
        type: "title",
        text: mapName,
        url: "",
        color: "#dbeafe",
        shape: "rounded",
        width: 184,
        height: 76,
        fontSize: 18,
        fontFamily: "system",
      },
    ],
    edges: [],
    nextNodeId: 2,
    nextEdgeId: 1,
    view: {
      pan: { x: 80, y: 60 },
      scale: 1,
    },
  };
}

function createStorageEnvelope(maps = state.maps, activeMapId = state.activeMapId) {
  return {
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    activeMapId,
    maps,
  };
}

function safeReadStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Unable to read ${key}.`, error);
    return null;
  }
}

function parseStorageEnvelope(raw) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const sourceMaps = Array.isArray(parsed) ? parsed : parsed?.maps;
    if (!Array.isArray(sourceMaps)) {
      return null;
    }

    const maps = sourceMaps.map(normalizeMap).filter(Boolean);
    if (!maps.length) {
      return null;
    }

    return {
      ...parsed,
      version: STORAGE_VERSION,
      activeMapId: typeof parsed?.activeMapId === "string" ? parsed.activeMapId : maps[0].id,
      maps,
    };
  } catch (error) {
    console.warn("Unable to parse stored mind map data.", error);
    return null;
  }
}

function getSafetyBackups() {
  try {
    const backups = JSON.parse(localStorage.getItem(MAP_BACKUP_STORAGE_KEY));
    return Array.isArray(backups) ? backups : [];
  } catch (error) {
    return [];
  }
}

function writeSafetyBackup(raw, reason, options = {}) {
  if (!raw) {
    return false;
  }

  const hash = hashString(raw);
  const backups = getSafetyBackups();
  const duplicate = backups.some((backup) => backup.hash === hash);
  if (duplicate && !options.force) {
    return true;
  }

  const parsed = parseStorageEnvelope(raw);
  const entry = {
    id: `backup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    reason,
    hash,
    raw,
    summary: parsed
      ? {
          activeMapId: parsed.activeMapId,
          mapCount: parsed.maps.length,
          nodeCount: parsed.maps.reduce((total, map) => total + map.nodes.length, 0),
          edgeCount: parsed.maps.reduce((total, map) => total + map.edges.length, 0),
        }
      : {
          unreadable: true,
        },
  };

  const nextBackups = [entry, ...backups.filter((backup) => backup.hash !== hash)].slice(0, BACKUP_LIMIT);

  try {
    localStorage.setItem(MAP_BACKUP_STORAGE_KEY, JSON.stringify(nextBackups));
    return true;
  } catch (error) {
    try {
      localStorage.setItem(MAP_BACKUP_STORAGE_KEY, JSON.stringify(nextBackups.slice(0, Math.ceil(BACKUP_LIMIT / 2))));
      return true;
    } catch (secondError) {
      console.warn("Unable to write safety backup.", secondError);
      return false;
    }
  }
}

function findLatestRestorableBackup() {
  for (const backup of getSafetyBackups()) {
    const parsed = parseStorageEnvelope(backup.raw);
    if (parsed?.maps.length) {
      return parsed;
    }
  }

  return null;
}

function hashString(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function loadStoredMaps(options = {}) {
  const fallback = createStoredMapFromState(t("maps.defaultTitle"));
  const rawStorage = safeReadStorage(MAP_STORAGE_KEY);

  if (rawStorage) {
    const stored = parseStorageEnvelope(rawStorage);
    if (stored?.maps.length) {
      state.maps = stored.maps;
      const activeMap = stored.maps.find((map) => map.id === stored.activeMapId) || stored.maps[0];
      applyMap(activeMap);
      clearUndoHistory();
      renderMapList();
      return;
    }

    writeSafetyBackup(rawStorage, "unreadable-primary", { force: true });
    const recovered = findLatestRestorableBackup();
    if (recovered) {
      state.maps = recovered.maps;
      const activeMap = recovered.maps.find((map) => map.id === recovered.activeMapId) || recovered.maps[0];
      applyMap(activeMap);
      clearUndoHistory();
      saveMapsToStorage({ silent: true, skipCloud: Boolean(options.skipCloud) });
      setDataStatus("maps.dataStatusRecovered");
      renderMapList();
      return;
    }

    setDataStatus("maps.dataStatusProtected");
  }

  state.maps = [normalizeMap(fallback)];
  applyMap(state.maps[0]);
  clearUndoHistory();
  saveMapsToStorage({ silent: Boolean(options.silent || rawStorage), skipCloud: Boolean(options.skipCloud) });
  renderMapList();
}

function applyStorageEnvelope(envelope) {
  if (!envelope?.maps.length) {
    return false;
  }

  state.maps = envelope.maps;
  const activeMap = envelope.maps.find((map) => map.id === envelope.activeMapId) || envelope.maps[0];
  applyMap(activeMap);
  clearUndoHistory();
  renderMapList();
  return true;
}

function getEnvelopeTimestamp(envelope) {
  const value = Date.parse(envelope?.savedAt || envelope?.cloudSavedAt || "");
  return Number.isFinite(value) ? value : 0;
}

function isLikelySeedEnvelope(envelope) {
  if (!envelope?.maps || envelope.maps.length !== 1) {
    return false;
  }

  const map = envelope.maps[0];
  const nodeTexts = new Set(map.nodes.map((node) => node.text));
  return (
    map.nodes.length === 4 &&
    map.edges.length === 3 &&
    nodeTexts.has("项目计划") &&
    nodeTexts.has("设计原型") &&
    nodeTexts.has("参考资料")
  );
}

async function fetchCloudStorage() {
  const response = await fetch("/api/maps", {
    credentials: "include",
    headers: {
      "Cache-Control": "no-store",
    },
  });

  if (response.status === 401) {
    throw new Error("cloud_auth_required");
  }

  if (!response.ok) {
    throw new Error("cloud_load_failed");
  }

  const result = await response.json();
  return result.storage ? parseStorageEnvelope(result.storage) : null;
}

async function loadCloudOrStoredMaps() {
  setDataStatus("maps.dataStatusCloudLoading");

  const rawStorage = safeReadStorage(MAP_STORAGE_KEY);
  const localEnvelope = parseStorageEnvelope(rawStorage);

  try {
    const cloudEnvelope = await fetchCloudStorage();
    state.cloudAvailable = true;

    if (cloudEnvelope?.maps.length) {
      const localIsNewer = localEnvelope && getEnvelopeTimestamp(localEnvelope) > getEnvelopeTimestamp(cloudEnvelope);
      const shouldKeepLocal = localIsNewer && !isLikelySeedEnvelope(localEnvelope);
      if (shouldKeepLocal) {
        applyStorageEnvelope(localEnvelope);
        scheduleCloudSave(localEnvelope, { immediate: true, silent: true });
        setDataStatus("maps.dataStatusCloudSaved");
        return;
      }

      applyStorageEnvelope(cloudEnvelope);
      saveMapsToStorage({ silent: true, skipCloud: true });
      setDataStatus("maps.dataStatusCloudLoaded");
      return;
    }

    if (localEnvelope?.maps.length) {
      applyStorageEnvelope(localEnvelope);
      scheduleCloudSave(localEnvelope, { immediate: true, silent: true });
      setDataStatus("maps.dataStatusCloudSaved");
      return;
    }

    loadStoredMaps({ silent: true, skipCloud: true });
    scheduleCloudSave(createStorageEnvelope(), { immediate: true, silent: true });
  } catch (error) {
    if (error.message === "cloud_auth_required") {
      setDataStatus("maps.dataStatusCloudAuthRequired");
    } else {
      setDataStatus("maps.dataStatusCloudUnavailable");
    }
    loadStoredMaps({ silent: true, skipCloud: true });
  }
}

function applyMap(map) {
  state.activeMapId = map.id;
  state.activeMapTitle = map.name;
  state.nodes = map.nodes.map((node, index) => normalizeNode(node, index)).filter(Boolean);
  state.edges = map.edges.map((edge, index) => normalizeEdge(edge, index)).filter(Boolean);
  state.nextNodeId = Number.isFinite(map.nextNodeId) ? map.nextNodeId : getNextNumericId(state.nodes, "node");
  state.nextEdgeId = Number.isFinite(map.nextEdgeId) ? map.nextEdgeId : getNextNumericId(state.edges, "edge");
  state.pan = {
    x: finiteNumber(map.view?.pan?.x, 80),
    y: finiteNumber(map.view?.pan?.y, 60),
  };
  state.scale = clamp(finiteNumber(map.view?.scale, 1), 0.3, 2.4);
  state.selectedNodeId = state.nodes[0]?.id || null;
  state.selectedEdgeId = null;
  state.connectFromId = null;
  mapTitleInput.value = state.activeMapTitle;
}

function persistActiveMap() {
  if (state.readOnly || !state.maps.length) {
    return;
  }

  const index = state.maps.findIndex((map) => map.id === state.activeMapId);
  if (index === -1) {
    return;
  }

  state.maps[index] = createStoredMapFromState(state.activeMapTitle);
  saveMapsToStorage();
  renderMapList();
}

function saveMapsToStorage(options = {}) {
  if (state.readOnly) {
    return true;
  }

  const payload = createStorageEnvelope();
  const nextSerialized = JSON.stringify(payload);
  const previousSerialized = safeReadStorage(MAP_STORAGE_KEY);

  if (previousSerialized && previousSerialized !== nextSerialized) {
    writeSafetyBackup(previousSerialized, "before-overwrite");
  }

  try {
    localStorage.setItem(MAP_STORAGE_KEY, nextSerialized);
    const verification = parseStorageEnvelope(localStorage.getItem(MAP_STORAGE_KEY));
    if (!verification?.maps.length) {
      throw new Error("Saved data failed verification.");
    }
    writeSafetyBackup(nextSerialized, "last-good");
    if (!options.silent) {
      setDataStatus("maps.dataStatusSaved");
    }
    if (!options.skipCloud) {
      scheduleCloudSave(payload, { silent: Boolean(options.silent) });
    }
    return true;
  } catch (error) {
    console.error("Unable to save mind map data.", error);
    setDataStatus("maps.dataStatusSaveFailed");
    return false;
  }
}

function scheduleCloudSave(payload, options = {}) {
  if (state.readOnly || !isAuthenticated()) {
    return;
  }

  state.pendingCloudPayload = payload || createStorageEnvelope();
  state.pendingCloudSilent = Boolean(options.silent);
  window.clearTimeout(state.cloudSaveTimer);

  if (options.immediate) {
    void flushCloudSave();
    return;
  }

  state.cloudSaveTimer = window.setTimeout(() => {
    void flushCloudSave();
  }, CLOUD_SAVE_DEBOUNCE_MS);
}

async function flushCloudSave() {
  if (state.cloudSaveInFlight || !state.pendingCloudPayload) {
    return;
  }

  const payload = state.pendingCloudPayload;
  const silent = state.pendingCloudSilent;
  state.pendingCloudPayload = null;
  state.pendingCloudSilent = false;
  state.cloudSaveInFlight = true;

  try {
    const response = await fetch("/api/maps", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storage: payload }),
    });

    if (response.status === 401) {
      setDataStatus("maps.dataStatusCloudAuthRequired");
      return;
    }

    if (!response.ok) {
      throw new Error("Cloud save failed.");
    }

    state.cloudAvailable = true;
    if (!silent) {
      setDataStatus("maps.dataStatusCloudSaved");
    }
  } catch (error) {
    console.warn("Unable to sync mind map data to cloud.", error);
    setDataStatus("maps.dataStatusCloudSaveFailed");
  } finally {
    state.cloudSaveInFlight = false;
    if (state.pendingCloudPayload) {
      void flushCloudSave();
    }
  }
}

function createNewMap() {
  if (state.readOnly) {
    return;
  }

  persistActiveMap();
  const map = createBlankMap();
  state.maps.push(map);
  applyMap(map);
  clearUndoHistory();
  saveMapsToStorage();
  render();
  renderMapList();
  mapTitleInput.focus();
  mapTitleInput.select();
}

function switchMap(id) {
  if (state.readOnly || id === state.activeMapId) {
    return;
  }

  const map = state.maps.find((item) => item.id === id);
  if (!map) {
    return;
  }

  persistActiveMap();
  applyMap(map);
  clearUndoHistory();
  saveMapsToStorage();
  render();
  renderMapList();
}

function renderMapList() {
  if (!mapList) {
    return;
  }

  const maps = state.readOnly
    ? [createStoredMapFromState(state.activeMapTitle || t("maps.sharedTitle"))]
    : state.maps;
  mapList.replaceChildren();

  maps.forEach((map) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `map-list-item${map.id === state.activeMapId ? " is-active" : ""}`;
    button.disabled = state.readOnly;
    button.dataset.id = map.id;

    const title = document.createElement("strong");
    title.textContent = map.name || t("maps.untitled");

    const summary = document.createElement("span");
    summary.textContent = `${t("maps.nodeCount", { count: map.nodes.length })} · ${t("maps.edgeCount", {
      count: map.edges.length,
    })}`;

    button.append(title, summary);
    button.addEventListener("click", () => switchMap(map.id));
    mapList.append(button);
  });
}

function encodeMapPayload(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeMapPayload(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function buildShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("view", "readonly");
  url.hash = `map=${encodeMapPayload(createMapSnapshot())}`;
  return url.toString();
}

async function copyShareUrl() {
  const link = buildShareUrl();

  try {
    await navigator.clipboard.writeText(link);
    flashShareButton(t("toolbar.shareCopied"));
  } catch (error) {
    window.prompt(t("prompt.copyReadonly"), link);
    flashShareButton(t("toolbar.shareCreated"));
  }
}

function flashShareButton(text) {
  const defaultText = t("toolbar.share");
  shareBtn.textContent = text;
  window.setTimeout(() => {
    shareBtn.textContent = defaultText;
  }, 1400);
}

function exportBackupFile() {
  persistActiveMap();
  const exportPayload = {
    format: "mindmap-template-backup",
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    storage: createStorageEnvelope(),
    safetyBackups: getSafetyBackups(),
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `mindmap-backup-${timestamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setDataStatus("maps.dataStatusExported");
}

async function importBackupFile(event) {
  if (state.readOnly) {
    return;
  }

  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) {
    return;
  }

  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const envelope = parseImportedBackup(parsed);
    if (!envelope?.maps.length) {
      throw new Error("No maps found in backup.");
    }

    persistActiveMap();
    const importedMaps = envelope.maps.map((map, index) => ({
      ...map,
      id: createMapId(),
      name: `${map.name || t("maps.untitled")} (${t("maps.importBackup")} ${index + 1})`,
    }));
    state.maps.push(...importedMaps);
    applyMap(importedMaps[0]);
    clearUndoHistory();
    saveMapsToStorage();
    render();
    renderMapList();
    setDataStatus("maps.dataStatusImported", { count: importedMaps.length });
  } catch (error) {
    console.error("Unable to import backup file.", error);
    setDataStatus("maps.dataStatusImportFailed");
  }
}

function parseImportedBackup(parsed) {
  if (parsed?.format === "mindmap-template-backup") {
    return parseStorageEnvelope(parsed.storage);
  }

  if (parsed?.storage) {
    return parseStorageEnvelope(parsed.storage);
  }

  return parseStorageEnvelope(parsed);
}

function restoreLatestBackup() {
  if (state.readOnly) {
    return;
  }

  const backup = findLatestRestorableBackup();
  if (!backup) {
    setDataStatus("maps.dataStatusNoBackup");
    return;
  }

  const currentSerialized = JSON.stringify(createStorageEnvelope());
  writeSafetyBackup(currentSerialized, "before-restore", { force: true });
  state.maps = backup.maps;
  const activeMap = backup.maps.find((map) => map.id === backup.activeMapId) || backup.maps[0];
  applyMap(activeMap);
  clearUndoHistory();
  saveMapsToStorage({ silent: true });
  render();
  renderMapList();
  setDataStatus("maps.dataStatusRestored");
}

function loadSharedMapFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const payload = hashParams.get("map");
  let sharedLoaded = false;

  if (payload) {
    try {
      hydrateMap(decodeMapPayload(payload));
      sharedLoaded = true;
    } catch (error) {
      console.warn("无法读取分享链接中的脑图数据。", error);
    }
  }

  state.readOnly = params.get("view") === "readonly" || params.get("readonly") === "1";

  if (state.readOnly) {
    state.selectedNodeId = null;
    state.selectedEdgeId = null;
    state.connectFromId = null;
  }

  setMode("select");
  syncReadOnlyControls();
  return sharedLoaded;
}

function hydrateMap(payload) {
  if (!payload || !Array.isArray(payload.nodes) || !Array.isArray(payload.edges)) {
    return;
  }

  const nodes = payload.nodes.map(normalizeNode).filter(Boolean);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = payload.edges.map(normalizeEdge).filter((edge) => {
    return edge && nodeIds.has(edge.from) && nodeIds.has(edge.to);
  });

  state.nodes = nodes;
  state.edges = edges;
  state.activeMapId = typeof payload.id === "string" && payload.id ? payload.id : "shared-map";
  state.activeMapTitle = typeof payload.name === "string" && payload.name ? payload.name : t("maps.sharedTitle");
  state.nextNodeId = Number.isFinite(payload.nextNodeId) ? payload.nextNodeId : getNextNumericId(nodes, "node");
  state.nextEdgeId = Number.isFinite(payload.nextEdgeId) ? payload.nextEdgeId : getNextNumericId(edges, "edge");

  if (payload.view) {
    state.pan = {
      x: finiteNumber(payload.view.pan?.x, state.pan.x),
      y: finiteNumber(payload.view.pan?.y, state.pan.y),
    };
    state.scale = clamp(finiteNumber(payload.view.scale, state.scale), 0.3, 2.4);
  }

  state.maps = [createStoredMapFromState(state.activeMapTitle)];
  mapTitleInput.value = state.activeMapTitle;
  clearUndoHistory();
}

function normalizeMap(map, index = 0) {
  if (!map || typeof map !== "object" || !Array.isArray(map.nodes) || !Array.isArray(map.edges)) {
    return null;
  }

  const nodes = map.nodes.map(normalizeNode).filter(Boolean);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = map.edges.map(normalizeEdge).filter((edge) => edge && nodeIds.has(edge.from) && nodeIds.has(edge.to));

  return {
    ...map,
    version: 1,
    id: typeof map.id === "string" && map.id ? map.id : `map-${index + 1}`,
    name: typeof map.name === "string" && map.name ? map.name : `${t("maps.untitled")} ${index + 1}`,
    nodes,
    edges,
    nextNodeId: Number.isFinite(map.nextNodeId) ? map.nextNodeId : getNextNumericId(nodes, "node"),
    nextEdgeId: Number.isFinite(map.nextEdgeId) ? map.nextEdgeId : getNextNumericId(edges, "edge"),
    view: {
      pan: {
        x: finiteNumber(map.view?.pan?.x, 80),
        y: finiteNumber(map.view?.pan?.y, 60),
      },
      scale: clamp(finiteNumber(map.view?.scale, 1), 0.3, 2.4),
    },
  };
}

function normalizeNode(node, index) {
  if (!node || typeof node !== "object") {
    return null;
  }

  const id = typeof node.id === "string" && node.id ? node.id : `node-${index + 1}`;
  const type = allowedNodeTypes.has(node.type) ? node.type : "title";
  const shape = allowedNodeShapes.has(node.shape) ? node.shape : "rounded";
  const defaultDimensions = getDefaultNodeDimensions(shape);

  return {
    ...node,
    id,
    x: finiteNumber(node.x, 180 + index * 40),
    y: finiteNumber(node.y, 180 + index * 40),
    type,
    text: typeof node.text === "string" ? node.text : t("node.new"),
    url: typeof node.url === "string" ? node.url : "",
    color: isHexColor(node.color) ? node.color : "#dbeafe",
    shape,
    width: clamp(finiteNumber(node.width, defaultDimensions.width), 96, 520),
    height: clamp(finiteNumber(node.height, defaultDimensions.height), 56, 360),
    fontSize: clamp(finiteNumber(node.fontSize, type === "title" ? 18 : 14), 10, 48),
    fontFamily: allowedFontFamilies.has(node.fontFamily) ? node.fontFamily : "system",
    note: typeof node.note === "string" ? node.note : "",
    noteOpen: Boolean(node.noteOpen),
    noteWidth: clamp(finiteNumber(node.noteWidth, 280), 180, 560),
    noteHeight: clamp(finiteNumber(node.noteHeight, 130), 80, 460),
  };
}

function normalizeEdge(edge, index) {
  if (!edge || typeof edge !== "object") {
    return null;
  }

  const shape = allowedEdgeShapes.has(edge.shape) ? edge.shape : "straight";
  const lineStyle = allowedEdgeLineStyles.has(edge.lineStyle) ? edge.lineStyle : "solid";
  const arrow = allowedEdgeArrows.has(edge.arrow) ? edge.arrow : "forward";

  return {
    ...edge,
    id: typeof edge.id === "string" && edge.id ? edge.id : `edge-${index + 1}`,
    from: edge.from,
    to: edge.to,
    color: isHexColor(edge.color) ? edge.color : "#2563eb",
    shape,
    lineStyle,
    arrow,
    label: typeof edge.label === "string" ? edge.label : "",
  };
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function getNextNumericId(items, prefix) {
  const maxId = items.reduce((max, item) => {
    const match = String(item.id).match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return maxId + 1;
}

async function initializeApp() {
  if (appInitialized) {
    return;
  }

  appInitialized = true;
  renderColorPalette();
  applyLocale();
  const sharedLoaded = loadSharedMapFromUrl();
  if (!sharedLoaded && !state.readOnly) {
    await loadCloudOrStoredMaps();
  }
  applyTransform();
  render();
}

nodesLayer.addEventListener("pointerdown", handleNodePointerDown);
canvas.addEventListener("pointerdown", handleCanvasPointerDown);
window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", handlePointerUp);
window.addEventListener("click", closeContextMenu);

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const factor = Math.exp(-event.deltaY * 0.001);
  zoomAt(factor, event.clientX, event.clientY);
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  closeContextMenu();

  if (state.readOnly) {
    return;
  }

  const nodeElement = event.target.closest(".node");
  const edgeElement = event.target.closest(".edge-path, .edge-hitbox, .edge-label");
  const point = worldPointFromEvent(event);

  if (nodeElement) {
    const nodeId = nodeElement.dataset.id;
    selectNode(nodeId);
    openContextMenu(event, [
      {
        label: t("menu.connectFrom"),
        action: () => {
          state.connectFromId = nodeId;
          setMode("connect");
          render();
        },
      },
      {
        label: t("menu.copyNode"),
        action: () => duplicateNode(nodeId),
      },
      {
        label: t("menu.addNote"),
        action: () => editNodeNote(nodeId),
      },
      {
        label: t("menu.copyChild"),
        action: () => {
          createNode({ x: point.x + 260, y: point.y + 20 }, { connectFromId: nodeId, text: t("node.child") });
        },
      },
      {
        label: t("menu.deleteNode"),
        danger: true,
        action: deleteSelected,
      },
    ]);
    return;
  }

  if (edgeElement) {
    const edgeId = edgeElement.dataset.id;
    selectEdge(edgeId);
    openContextMenu(event, [
      {
        label: t("menu.reverseArrow"),
        action: () => {
          const edge = getEdge(edgeId);
          if (edge) {
            pushUndo("reverse-edge");
            [edge.from, edge.to] = [edge.to, edge.from];
            edge.arrow = edge.arrow === "backward" ? "forward" : edge.arrow;
            selectEdge(edge.id);
            persistActiveMap();
          }
        },
      },
      {
        label: t("menu.deleteEdge"),
        danger: true,
        action: deleteSelected,
      },
    ]);
    return;
  }

  openContextMenu(event, [
    {
      label: t("menu.createHere"),
      action: () => createNode(point),
    },
    {
      label: t("menu.createLinked"),
      action: () =>
        createNode(point, {
          connectFromId: state.selectedNodeId,
          text: t("node.branch"),
        }),
    },
    {
      label: t("menu.clearSelection"),
      action: clearSelection,
    },
  ]);
});

edgesLayer.addEventListener("click", (event) => {
  const path = event.target.closest(".edge-path, .edge-hitbox, .edge-label");
  if (!path) {
    return;
  }

  event.stopPropagation();
  selectEdge(path.dataset.id);
});

nodesLayer.addEventListener("dblclick", (event) => {
  if (state.readOnly) {
    return;
  }

  const nodeElement = event.target.closest(".node");
  if (!nodeElement) {
    return;
  }

  selectNode(nodeElement.dataset.id);
  nodeText.focus();
  nodeText.select();
});

addNodeBtn.addEventListener("click", () => {
  const center = viewportCenterAsWorldPoint();
  createNode(center, { connectFromId: state.selectedNodeId });
});

connectBtn.addEventListener("click", () => {
  state.connectFromId = state.selectedNodeId;
  setMode(state.mode === "connect" ? "select" : "connect");
  render();
});

undoBtn.addEventListener("click", undoLastAction);
deleteBtn.addEventListener("click", deleteSelected);
zoomInBtn.addEventListener("click", () => zoomAt(1.15));
zoomOutBtn.addEventListener("click", () => zoomAt(0.85));
resetViewBtn.addEventListener("click", () => {
  state.scale = 1;
  state.pan = { x: 80, y: 60 };
  applyTransform({ animate: true });
});
layoutHorizontalBtn.addEventListener("click", () => arrange("horizontal"));
layoutVerticalBtn.addEventListener("click", () => arrange("vertical"));

nodeType.addEventListener("change", () => updateSelectedNode({ type: nodeType.value }));
nodeText.addEventListener("input", () => updateSelectedNode({ text: nodeText.value }));
nodeUrl.addEventListener("input", () => updateSelectedNode({ url: nodeUrl.value }));
nodeShape.addEventListener("change", () => updateSelectedNode({ shape: nodeShape.value }));
nodeColor.addEventListener("input", () => updateSelectedNode({ color: nodeColor.value }));
nodeColor.addEventListener("change", () => syncColorPalette(nodeColor.value));
nodeFontSize.addEventListener("input", () => updateSelectedNode({ fontSize: finiteNumber(nodeFontSize.value, 18) }));
nodeFontFamily.addEventListener("change", () => updateSelectedNode({ fontFamily: nodeFontFamily.value }));
edgeShape.addEventListener("change", () => updateSelectedEdge({ shape: edgeShape.value }));
edgeLineStyle.addEventListener("change", () => updateSelectedEdge({ lineStyle: edgeLineStyle.value }));
edgeArrow.addEventListener("change", () => updateSelectedEdge({ arrow: edgeArrow.value }));
edgeColor.addEventListener("input", () => updateSelectedEdge({ color: edgeColor.value }));
edgeLabel.addEventListener("input", () => updateSelectedEdge({ label: edgeLabel.value }));
shareBtn.addEventListener("click", copyShareUrl);
exportBackupBtn.addEventListener("click", exportBackupFile);
importBackupInput.addEventListener("change", importBackupFile);
restoreBackupBtn.addEventListener("click", restoreLatestBackup);
noteForm.addEventListener("submit", saveNoteEditor);
noteCloseBtn.addEventListener("click", closeNoteEditor);
noteCancelBtn.addEventListener("click", closeNoteEditor);
loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", logout);
languageBtn.addEventListener("click", () => {
  state.locale = state.locale === "zh" ? "en" : "zh";
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, state.locale);
  } catch (error) {
    console.warn("Unable to save locale.", error);
  }
  applyLocale();
  render();
});
newMapBtn.addEventListener("click", createNewMap);
mapTitleInput.addEventListener("input", () => {
  pushUndo("rename-map", { coalesceKey: `map-name-${state.activeMapId}` });
  state.activeMapTitle = mapTitleInput.value.trim() || t("maps.untitled");
  persistActiveMap();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Delete" || event.key === "Backspace") {
    const editingText = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
    if (!editingText) {
      deleteSelected();
    }
  }

  if (event.key === "Escape") {
    if (!noteEditor.hidden) {
      closeNoteEditor();
      return;
    }
    clearSelection();
    closeContextMenu();
  }
});

applyLocale();
void bootstrapApp();

async function bootstrapApp() {
  if (isReadonlyShareUrl()) {
    unlockApp();
    return;
  }

  if (await hasServerSession()) {
    rememberAuthenticatedSession();
    unlockApp();
    return;
  }

  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch (error) {
    console.warn("Unable to clear stale login session.", error);
  }
  showLoginScreen();
}
