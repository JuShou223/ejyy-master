/* Inline SVG icons. stroke-based, 24x24, currentColor */
const I = (() => {
  const w = (p, opt = {}) =>
    `<svg viewBox="0 0 24 24" fill="${opt.fill || "none"}" stroke="${opt.fill ? "none" : "currentColor"}" stroke-width="${opt.sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" width="${opt.s || 24}" height="${opt.s || 24}">${p}</svg>`;

  const paths = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>',
    car: '<path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13"/><path d="M4 13h16v5h-2v-2H6v2H4z"/><circle cx="7.5" cy="15.5" r="1"/><circle cx="16.5" cy="15.5" r="1"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    wrench: '<path d="M14.5 5.5a3.5 3.5 0 0 0 4.4 4.4l-7.9 7.9a2.1 2.1 0 0 1-3-3l7.9-7.9a3.5 3.5 0 0 0-1.4-1.4z"/>',
    visitor: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M17 9h4M19 7v4"/>',
    box: '<path d="M3.5 7 12 3l8.5 4v9L12 21 3.5 16z"/><path d="M3.5 7 12 11l8.5-4M12 11v10"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    chat: '<path d="M4 5.5h16v11H9l-4 3.5v-3.5H4z"/>',
    vote: '<path d="M5 21h14M7 21V9l5-5 5 5v12M10 13h4M10 17h4"/>',
    party: '<path d="M3 21l5.5-13L16 18z"/><path d="M14 4l1 2 2 .5-1.5 1.5.3 2L14 9l-2 1 .3-2L11 6.5 13 6z"/>',
    chevR: '<path d="M9 5l7 7-7 7"/>',
    chevL: '<path d="M15 5l-7 7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5 10 17l9-10"/>',
    qr: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><path d="M13.5 13.5h3v3M20.5 13.5v7M16.5 16.5v4M20.5 16.5h-1"/>',
    shield: '<path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z"/><path d="M9 12l2 2 4-4"/>',
    receipt: '<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z"/><path d="M9 8h6M9 12h6"/>',
    creditcard: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
    dumbbell: '<path d="M6.5 6.5v11M4 9v6M17.5 6.5v11M20 9v6M6.5 12h11"/>',
    users: '<circle cx="9" cy="9" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 6.5a3 3 0 0 1 0 5.8M21 20c0-2.4-1.3-4-3.5-4.6"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5 5c3 3 3 11 0 14M19 5c-3 3-3 11 0 14"/>',
    wave: '<path d="M3 8c2-2 4 2 6 0s4-2 6 0 4 2 6 0M3 13c2-2 4 2 6 0s4-2 6 0 4 2 6 0M3 18c2-2 4 2 6 0s4-2 6 0 4 2 6 0"/>',
    lotus: '<path d="M12 4c2 2 2.5 4.5 0 8-2.5-3.5-2-6 0-8z"/><path d="M12 12c3.5 0 6-1 8-3-1 4-4 6.5-8 6.5S5 13 4 9c2 2 4.5 3 8 3z"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    door: '<path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M5 21h14M13 12h.01"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    face: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8.5 14c1 1.2 2 1.8 3.5 1.8s2.5-.6 3.5-1.8"/>',
    heart: '<path d="M12 20s-7-4.3-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.7 12 20 12 20z"/>',
    comment: '<path d="M4 5h16v11H9l-4 3.5V16H4z"/>',
    phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l2 5v-3M5 4c-1 8 7 16 15 15"/>',
    star: '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    camera: '<path d="M3 7.5h3l1.5-2h9L18 7.5h3v12H3z"/><circle cx="12" cy="13" r="3.5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    edit: '<path d="M16 4l4 4-11 11H5v-4z"/><path d="M13.5 6.5l4 4"/>',
    map: '<path d="M12 21s-6-5.7-6-10a6 6 0 1 1 12 0c0 4.3-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  };

  const fn = (name, opt = {}) => w(paths[name] || "", opt);
  fn.list = paths;
  return fn;
})();
