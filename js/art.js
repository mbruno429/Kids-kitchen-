/* Kids Kitchen — all the pictures.
   Everything is inline SVG (or an emoji inside an SVG) so it scales with its box. */
(function () {
  'use strict';

  /* ---------- tiny helpers ---------- */
  const S = (inner, vb) => `<svg viewBox="${vb || '0 0 100 100'}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const E = (ch, fs) => S(`<text x="50" y="50" dy=".36em" font-size="${fs || 82}" text-anchor="middle">${ch}</text>`);

  // lighten (f > 0) or darken (f < 0) a hex colour
  function sh(hex, f) {
    if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    const n = parseInt(hex.slice(1), 16), t = f < 0 ? 0 : 255, p = Math.abs(f);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round((t - v) * p + v));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function rng(seed) { let s = seed % 2147483647 || 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  // spread n little shapes evenly (sunflower pattern) inside a circle
  function spread(n, seed, R, fn) {
    const r = rng(seed); let o = '';
    for (let i = 0; i < n; i++) {
      const a = i * 2.39996 + r() * 0.9, d = R * Math.sqrt((i + 0.6) / n);
      o += fn(50 + Math.cos(a) * d, 50 + Math.sin(a) * d, Math.round(r() * 360), i, r);
    }
    return o;
  }
  const at = (x, y, rot) => `transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})"`;
  const coin = (c, c2, rad) => (x, y, rot) =>
    `<g ${at(x, y, rot)}><circle r="${rad}" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="1.5"/><circle r="${rad * 0.55}" fill="${c2}"/></g>`;
  const stick = (c, w, h) => (x, y, rot) =>
    `<rect ${at(x, y, rot)} x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2.6}" fill="${c}" stroke="${sh(c, -0.24)}" stroke-width="1.3"/>`;
  const dice = (cs, s) => (x, y, rot, i) =>
    `<rect ${at(x, y, rot)} x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${s / 4}" fill="${cs[i % cs.length]}" stroke="${sh(cs[i % cs.length], -0.22)}" stroke-width="1.2"/>`;
  const leaf = (cs, k) => (x, y, rot, i) =>
    `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${k || 1})" d="M-12 0 Q-9 -10 0 -8 Q8 -12 12 -2 Q11 8 1 8 Q-8 11 -12 0Z" fill="${cs[i % cs.length]}" stroke="${sh(cs[i % cs.length], -0.22)}" stroke-width="1.3"/>`;
  const elbow = (c) => (x, y, rot) =>
    `<g ${at(x, y, rot)} fill="none" stroke-linecap="round"><path d="M-7 4 A8 8 0 0 1 7 4" stroke="${sh(c, -0.25)}" stroke-width="8"/><path d="M-7 4 A8 8 0 0 1 7 4" stroke="${c}" stroke-width="5.4"/></g>`;
  const wedge = (x, y, rot) =>
    `<g ${at(x, y, rot)}><path d="M-13 5 Q0 -15 13 5 Q0 -1 -13 5Z" fill="#fff1c9" stroke="#e8d59a" stroke-width="1"/><path d="M-13 5 Q0 -15 13 5" fill="none" stroke="#e23d2e" stroke-width="3" stroke-linecap="round"/></g>`;
  const dot = (cs, rad) => (x, y, rot, i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad}" fill="${cs[i % cs.length]}"/>`;

  /* ---------- containers you pour from ---------- */
  const label = (ch, x, y, s) =>
    `<circle cx="${x}" cy="${y}" r="${s * 0.62}" fill="#fff" opacity=".94"/><text x="${x}" y="${y}" dy=".36em" font-size="${s * 0.82}" text-anchor="middle">${ch}</text>`;
  function sack(c, ch) {
    const d = sh(c, -0.22);
    return S(`<path d="M24 32 Q15 62 22 90 Q50 98 78 90 Q85 62 76 32Z" fill="${c}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M26 33 Q20 15 34 20 Q42 7 50 18 Q58 7 66 20 Q80 15 74 33 Q50 41 26 33Z" fill="${sh(c, 0.3)}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M31 32 Q50 38 69 32" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>${label(ch, 50, 64, 30)}`);
  }
  function jar(c, lid, ch) {
    return S(`<rect x="22" y="26" width="56" height="67" rx="13" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>
      <rect x="26" y="9" width="48" height="19" rx="6" fill="${lid}" stroke="${sh(lid, -0.25)}" stroke-width="3"/>
      <rect x="28" y="36" width="7" height="38" rx="3.5" fill="#fff" opacity=".4"/>${label(ch, 53, 61, 27)}`);
  }
  function bottle(c, cap, ch) {
    return S(`<path d="M40 22 L40 33 Q25 42 25 57 L25 84 Q25 93 34 93 L66 93 Q75 93 75 84 L75 57 Q75 42 60 33 L60 22Z" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="37" y="7" width="26" height="17" rx="5" fill="${cap}" stroke="${sh(cap, -0.25)}" stroke-width="3"/>${label(ch, 50, 67, 25)}`);
  }
  function box(c, ch) {
    return S(`<rect x="20" y="14" width="60" height="78" rx="7" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>
      <path d="M21 30 H79" stroke="${sh(c, -0.25)}" stroke-width="3"/><rect x="26" y="19" width="48" height="6" rx="3" fill="#fff" opacity=".45"/>${label(ch, 50, 62, 30)}`);
  }
  function shaker(c, cap, dots) {
    return S(`<rect x="28" y="34" width="44" height="58" rx="11" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>
      <path d="M30 36 Q30 12 50 12 Q70 12 70 36Z" fill="${cap}" stroke="${sh(cap, -0.25)}" stroke-width="3" stroke-linejoin="round"/>
      <g fill="${sh(cap, -0.45)}"><circle cx="42" cy="24" r="2.4"/><circle cx="50" cy="20" r="2.4"/><circle cx="58" cy="24" r="2.4"/><circle cx="50" cy="29" r="2.4"/></g>
      ${spread(9, 5, 15, (x, y, r, i) => `<circle cx="${x}" cy="${y + 14}" r="2.6" fill="${dots[i % dots.length]}"/>`)}`);
  }
  const jug = S(`<path d="M24 20 H70 L66 88 Q65 93 60 93 H34 Q29 93 28 88Z" fill="#eaf7ff" stroke="#8fc5e8" stroke-width="3" stroke-linejoin="round"/>
      <path d="M27.5 40 H68.5 L66 86 Q65 90 61 90 H33 Q29 90 28 86Z" fill="#6cc3f5"/>
      <path d="M28 40 Q38 34 48 40 Q58 46 68 40" fill="none" stroke="#bfe6fb" stroke-width="3"/>
      <path d="M69 34 Q90 34 88 52 Q87 68 67 68" fill="none" stroke="#8fc5e8" stroke-width="6" stroke-linecap="round"/>
      <path d="M24 20 L14 14" stroke="#8fc5e8" stroke-width="4" stroke-linecap="round"/><rect x="33" y="48" width="6" height="30" rx="3" fill="#fff" opacity=".55"/>`);
  function pipingBag(c) {
    const d = sh(c, -0.22);
    return S(`<path d="M24 24 Q50 14 76 24 L59 78 H41Z" fill="${c}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M30 24 Q34 4 50 12 Q66 4 70 24 Q50 32 30 24Z" fill="${sh(c, 0.35)}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 34 L44 70" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45"/>
      <path d="M41 78 H59 L54 95 H46Z" fill="#cfd6de" stroke="#8792a0" stroke-width="3" stroke-linejoin="round"/>`);
  }
  function bowlOf(c) {
    return S(`<ellipse cx="50" cy="44" rx="40" ry="13" fill="${c}" stroke="${sh(c, -0.18)}" stroke-width="2.5"/>
      <path d="M10 44 Q12 90 50 90 Q88 90 90 44 Q50 62 10 44Z" fill="#5cb8ff" stroke="#3a8fd6" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 62 Q28 80 44 84" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/>
      <path d="M70 40 Q84 26 92 16" stroke="#c98a4b" stroke-width="7" stroke-linecap="round"/>`);
  }

  /* ---------- drawn food ---------- */
  function blob(c, extra) {
    return S(`<path d="M50 6 C71 3 93 21 94 46 C97 73 76 95 50 94 C24 96 4 75 6 48 C4 24 27 6 50 6Z" fill="${c}" stroke="${sh(c, -0.16)}" stroke-width="2.5"/>
      <path d="M24 36 Q33 18 54 17" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".45"/>${extra || ''}`);
  }
  const swirl = (c) => `<path d="M50 50 Q62 44 60 56 Q56 70 40 64 Q26 56 36 38 Q50 22 70 36 Q84 52 72 72" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
  function pile(c, speck) {
    return S(`<path d="M50 14 C68 10 88 26 86 48 C90 70 70 88 50 86 C28 90 10 70 14 48 C10 28 30 12 50 14Z" fill="${c}" stroke="${sh(c, -0.14)}" stroke-width="2.5"/>
      <path d="M50 30 C60 28 70 38 68 50 C70 62 60 70 50 68 C38 70 30 62 32 50 C30 38 40 30 50 30Z" fill="${sh(c, 0.5)}" opacity=".8"/>
      ${speck ? spread(8, 3, 28, dot([speck], 2.2)) : ''}`);
  }
  function puddle(c, op) {
    return S(`<path d="M30 20 C48 8 76 14 86 34 C98 52 86 80 62 86 C40 94 14 82 10 58 C6 40 16 28 30 20Z" fill="${c}" opacity="${op}" stroke="${sh(c, -0.15)}" stroke-width="2"/>
      <path d="M28 36 Q38 24 54 24" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".55"/>`);
  }
  const fill = (c, op, extra) => S(`<circle cx="50" cy="50" r="50" fill="${c}" opacity="${op}"/>
      <path d="M22 34 Q32 28 42 34 M56 62 Q66 56 76 62 M30 70 Q38 65 46 70" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>${extra || ''}`);
  const specks = (cs, n) => S(spread(n || 16, 11, 34, dot(cs, 2.2)));

  const eggIn = (white, op) => S(`<path d="M34 16 C54 6 82 18 86 42 C92 64 76 88 52 88 C30 92 10 74 12 50 C10 34 20 22 34 16Z" fill="${white}" opacity="${op}" stroke="#e9e2d2" stroke-width="2"/>
      <circle cx="50" cy="52" r="19" fill="#ffb81f" stroke="#f09a0b" stroke-width="2.5"/><path d="M40 46 Q44 38 54 38" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>`);
  const disc = (c, c2, ring) => S(`<circle cx="50" cy="50" r="46" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="3"/>
      <circle cx="50" cy="50" r="${ring || 34}" fill="${c2}" opacity=".85"/><path d="M26 36 Q34 22 52 22" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".4"/>`);
  function meat(c, big, marks) {
    const d = sh(c, -0.25);
    return S(`<circle cx="50" cy="50" r="${big ? 45 : 40}" fill="${c}" stroke="${d}" stroke-width="3"/>
      ${spread(big ? 12 : 8, 9, big ? 34 : 28, dot([d, sh(c, 0.18)], 2.6))}
      ${marks ? `<g stroke="${sh(c, -0.5)}" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M24 36 L62 18"/><path d="M18 58 L78 28"/><path d="M26 76 L84 46"/><path d="M46 84 L82 66"/></g>` : ''}
      <path d="M26 38 Q32 24 48 20" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".3"/>`);
  }
  const nug = (c, sp) => S(`<path d="M30 22 C46 10 72 14 82 32 C92 48 84 76 64 82 C44 90 18 80 14 58 C10 42 18 30 30 22Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="3"/>
      ${spread(14, 21, 28, dot([sp, sh(c, 0.3)], 2.4))}`);
  const chunk = (c) => S(`<path d="M28 26 C44 12 74 18 82 38 C90 56 78 80 56 82 C36 86 16 74 16 54 C14 42 20 32 28 26Z" fill="${c}" stroke="${sh(c, -0.16)}" stroke-width="3"/>
      <path d="M30 42 Q40 28 58 28" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".5"/>`);
  const sausageArt = (c, marks) => S(`<rect x="6" y="8" width="188" height="36" rx="18" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>
      <path d="M26 18 H150" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/>
      ${marks ? `<g stroke="${sh(c, -0.5)}" stroke-width="4" stroke-linecap="round" opacity=".65"><path d="M50 12 L40 40"/><path d="M84 12 L74 40"/><path d="M118 12 L108 40"/><path d="M152 12 L142 40"/></g>` : ''}`, '0 0 200 52');
  const breadTop = (c, crust, toast) => S(`<path d="M20 34 C8 24 16 8 32 12 C40 4 60 4 68 12 C84 8 92 24 80 34 L80 82 Q80 90 72 90 L28 90 Q20 90 20 82Z" fill="${c}" stroke="${crust}" stroke-width="5" stroke-linejoin="round"/>
      ${toast ? `<g stroke="${sh(c, -0.3)}" stroke-width="4" stroke-linecap="round" opacity=".55"><path d="M32 34 L60 22"/><path d="M30 52 L70 34"/><path d="M32 70 L70 52"/><path d="M48 80 L70 70"/></g>` : `<g fill="${sh(c, -0.08)}"><circle cx="38" cy="36" r="3"/><circle cx="60" cy="48" r="3"/><circle cx="42" cy="66" r="3"/><circle cx="62" cy="72" r="2.5"/></g>`}`);
  const waffleArt = (c, c2) => {
    let g = '';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g += `<rect x="${15 + i * 18.5}" y="${15 + j * 18.5}" width="14" height="14" rx="3" fill="${c2}"/>`;
    return S(`<rect x="7" y="7" width="86" height="86" rx="14" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>${g}`);
  };
  const cookieArt = (c, r) => S(`<circle cx="50" cy="50" r="${r}" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="3"/>
      ${spread(7, 13, r * 0.68, (x, y, rot) => `<rect ${at(x, y, rot)} x="-4.5" y="-4" width="9" height="8" rx="3" fill="#5a341c"/>`)}
      <path d="M${50 - r * 0.5} ${50 - r * 0.3} Q${50 - r * 0.3} ${50 - r * 0.62} ${50 + r * 0.1} ${50 - r * 0.66}" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".35"/>`);
  const friesArt = (c) => S(spread(8, 4, 26, stick(c, 34, 8)));
  const crustArt = (c, edge) => S(`<circle cx="50" cy="50" r="47" fill="${edge}" stroke="${sh(edge, -0.2)}" stroke-width="2.5"/><circle cx="50" cy="50" r="39" fill="${c}"/>
      <path d="M22 36 Q30 20 50 16" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".4"/>`);
  const pieCrustArt = (c) => {
    let sc = '';
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; sc += `<circle cx="${(50 + Math.cos(a) * 43).toFixed(1)}" cy="${(50 + Math.sin(a) * 43).toFixed(1)}" r="8" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2"/>`; }
    return S(`${sc}<circle cx="50" cy="50" r="42" fill="${c}"/><circle cx="50" cy="50" r="36" fill="${sh(c, 0.18)}"/>`);
  };
  const latticeArt = (c) => {
    const d = sh(c, -0.22); let o = '';
    [-27, -9, 9, 27].forEach(k => { const L = Math.sqrt(40 * 40 - k * k); o += `<line x1="${50 + k}" y1="${50 - L}" x2="${50 + k}" y2="${50 + L}"/>`; });
    [-27, -9, 9, 27].forEach(k => { const L = Math.sqrt(40 * 40 - k * k); o += `<line x1="${50 - L}" y1="${50 + k}" x2="${50 + L}" y2="${50 + k}"/>`; });
    return S(`<g transform="rotate(45 50 50)"><g stroke="${d}" stroke-width="11" stroke-linecap="round">${o}</g><g stroke="${c}" stroke-width="7.5" stroke-linecap="round">${o}</g></g>
      <circle cx="50" cy="50" r="43" fill="none" stroke="${d}" stroke-width="9"/><circle cx="50" cy="50" r="43" fill="none" stroke="${c}" stroke-width="6"/>`);
  };
  const nest = (c, n) => {
    const d = sh(c, -0.22); let a = '', b = '';
    for (let i = 0; i < (n || 8); i++) {
      const e = `<ellipse cx="50" cy="50" rx="${40 - (i % 3) * 7}" ry="${22 - (i % 2) * 6}" transform="rotate(${i * 23 + 8} 50 50) translate(${(i % 3) - 1} ${(i % 2) * 2})"/>`;
      a += e; b += e;
    }
    return S(`<circle cx="50" cy="50" r="38" fill="${c}" opacity=".9"/><g fill="none" stroke="${d}" stroke-width="6.5">${a}</g><g fill="none" stroke="${c}" stroke-width="4">${b}</g>`);
  };
  const rawSpaghetti = S(`<g stroke-linecap="round"><g stroke="#d9b655" stroke-width="5.5">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${10 + i * 1.5}" y1="${30 + i * 6}" x2="${90 - i * 1.5}" y2="${26 + i * 6.4}"/>`).join('')}</g>
      <g stroke="#f6dc8a" stroke-width="3.4">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${10 + i * 1.5}" y1="${30 + i * 6}" x2="${90 - i * 1.5}" y2="${26 + i * 6.4}"/>`).join('')}</g></g>`);
  const squiggle = (c) => S(`<path d="M12 26 Q24 4 36 26 T60 26 T84 26 T108 26 T132 26 T156 26 T180 26" fill="none" stroke="${sh(c, -0.2)}" stroke-width="12" stroke-linecap="round"/>
      <path d="M12 26 Q24 4 36 26 T60 26 T84 26 T108 26 T132 26 T156 26 T180 26" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`, '0 0 192 52');
  const drizzle = (c, op) => S(`<path d="M18 30 Q34 8 48 30 T78 34 Q90 46 76 56 T46 62 Q26 66 24 80 Q40 92 62 84 T84 72" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" opacity="${op || 0.9}"/>
      <circle cx="30" cy="46" r="7" fill="${c}" opacity="${op || 0.9}"/><circle cx="66" cy="46" r="6" fill="${c}" opacity="${op || 0.9}"/>`);
  const dollop = (c) => S(`<path d="M50 12 C70 14 88 30 86 52 C86 74 68 88 50 88 C30 88 12 74 14 52 C12 30 30 14 50 12Z" fill="${c}" stroke="${sh(c, -0.12)}" stroke-width="2.5"/>
      <path d="M50 50 Q60 44 58 54 Q54 66 42 60 Q30 52 40 38 Q52 26 66 38" fill="none" stroke="${sh(c, -0.14)}" stroke-width="3.5" stroke-linecap="round"/>`);

  /* side-view layers for stacking (wide and flat) */
  const L = (inner, h) => S(inner, `0 0 200 ${h}`);
  const pancakeSide = L(`<rect x="6" y="5" width="188" height="34" rx="17" fill="#e8b25a" stroke="#b87424" stroke-width="3"/><rect x="12" y="8" width="176" height="13" rx="6.5" fill="#c98432"/>`, 44);
  const bunBottom = L(`<path d="M12 6 H188 Q194 6 194 14 Q194 42 160 42 H40 Q6 42 6 14 Q6 6 12 6Z" fill="#e7a850" stroke="#b97425" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="8" width="176" height="9" rx="4" fill="#f9dfa6"/>`, 46);
  const bunTop = L(`<path d="M8 80 Q8 8 100 8 Q192 8 192 80 Q192 86 186 86 H14 Q8 86 8 80Z" fill="#e7a850" stroke="#b97425" stroke-width="3" stroke-linejoin="round"/>
      <path d="M30 50 Q44 22 80 18" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".35"/>
      <g fill="#fff5d6" stroke="#d9b36a" stroke-width="1">${[[62, 30, 20], [100, 22, -10], [138, 32, 30], [80, 50, -30], [124, 52, 12], [160, 56, -20], [44, 58, 40]].map(p => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="6" ry="3" transform="rotate(${p[2]} ${p[0]} ${p[1]})"/>`).join('')}</g>`, 90);
  const pattySide = L(`<rect x="6" y="4" width="188" height="34" rx="16" fill="#7b4a2d" stroke="#55301a" stroke-width="3"/><g fill="#5c3620">${[24, 52, 78, 110, 138, 166].map((x, i) => `<circle cx="${x}" cy="${16 + (i % 2) * 9}" r="3.4"/>`).join('')}</g><rect x="18" y="8" width="150" height="5" rx="2.5" fill="#fff" opacity=".18"/>`, 42);
  const cheeseSide = L(`<path d="M4 4 H196 V14 L176 14 L160 40 L146 14 L70 14 L52 34 L36 14 L4 14Z" fill="#ffc933" stroke="#e39f12" stroke-width="3" stroke-linejoin="round"/>`, 44);
  const lettuceSide = L(`<path d="M2 12 Q14 0 26 10 Q38 22 52 10 Q64 0 78 10 Q90 22 104 10 Q116 0 130 10 Q142 22 156 10 Q168 0 180 10 Q192 20 198 10 L196 26 Q184 36 170 28 Q158 20 146 28 Q132 36 120 28 Q108 20 94 28 Q82 36 68 28 Q56 20 42 28 Q30 36 16 28 Q6 22 2 26Z" fill="#6ccb4b" stroke="#3f9d2a" stroke-width="3" stroke-linejoin="round"/>`, 38);
  const tomatoSide = L(`${[8, 72, 136].map(x => `<rect x="${x}" y="4" width="58" height="20" rx="10" fill="#f0493a" stroke="#c22e22" stroke-width="3"/><rect x="${x + 9}" y="8" width="40" height="6" rx="3" fill="#ff8b7c"/>`).join('')}`, 28);
  const breadSide = L(`<rect x="6" y="4" width="188" height="32" rx="12" fill="#fff3d6" stroke="#c98a3c" stroke-width="5"/>`, 40);
  const wavy = (c) => L(`<path d="M6 8 Q20 0 34 8 T62 8 T90 8 T118 8 T146 8 T174 8 T194 8 L194 20 Q180 28 166 20 T138 20 T110 20 T82 20 T54 20 T26 20 T6 20Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="3" stroke-linejoin="round"/>`, 28);
  const bananaSide = L(`${[6, 44, 82, 120, 158].map(x => `<rect x="${x}" y="3" width="36" height="16" rx="8" fill="#fff0b0" stroke="#e3c552" stroke-width="2.5"/>`).join('')}`, 22);
  const butterPatSide = L(`<rect x="60" y="4" width="80" height="26" rx="6" fill="#ffe36b" stroke="#e3b81f" stroke-width="3"/><rect x="68" y="8" width="52" height="6" rx="3" fill="#fff6c2"/>`, 34);
  const syrupSide = L(`<path d="M14 10 Q100 -6 186 10 L186 26 Q186 44 174 44 Q164 44 164 30 L164 24 L140 24 L140 56 Q140 70 128 70 Q116 70 116 56 L116 24 L84 24 L84 40 Q84 52 73 52 Q62 52 62 40 L62 24 L36 24 L36 60 Q36 74 25 74 Q14 74 14 60Z" fill="#b5651d" stroke="#8a4510" stroke-width="3" stroke-linejoin="round" opacity=".93"/><path d="M40 12 Q100 2 150 12" stroke="#f0b06a" stroke-width="4" stroke-linecap="round" fill="none"/>`, 78);

  /* taco bits (side view) */
  const tacoShell = L(`<path d="M6 8 Q6 106 100 106 Q194 106 194 8Z" fill="#f6c453" stroke="#d1962a" stroke-width="4" stroke-linejoin="round"/>
      <g fill="#e0a437">${[[40, 30], [70, 62], [104, 36], [132, 74], [158, 34], [92, 88], [56, 84]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.4"/>`).join('')}</g>
      <path d="M22 18 Q24 60 52 84" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".35"/>`, 112);
  const bumps = (c, hi) => L(`<path d="M8 70 Q4 ${40 - hi} 26 ${36 - hi} Q34 ${14 - hi} 54 ${26 - hi} Q68 ${6 - hi} 86 ${22 - hi} Q102 ${4 - hi} 120 ${22 - hi} Q138 ${8 - hi} 150 ${28 - hi} Q172 ${14 - hi} 178 ${38 - hi} Q198 ${40 - hi} 192 70Z" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3.5" stroke-linejoin="round"/>
      <g fill="${sh(c, -0.22)}">${[30, 58, 86, 114, 142, 168].map((x, i) => `<circle cx="${x}" cy="${40 + (i % 2) * 8}" r="3"/>`).join('')}</g>`, 70);
  const frill = L(`<path d="M4 70 Q-2 30 14 22 Q14 4 32 12 Q42 -4 56 10 Q70 -6 84 10 Q98 -6 112 10 Q126 -6 140 10 Q156 -4 166 12 Q186 4 186 22 Q202 30 196 70Z" fill="#6ccb4b" stroke="#3f9d2a" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M30 26 Q34 40 30 56 M70 22 Q74 38 70 56 M112 22 Q116 38 112 56 M154 26 Q158 40 154 56" stroke="#3f9d2a" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`, 70);
  const tacoTomato = L(`${[[30, 16, 12], [66, 6, -14], [102, 14, 20], [136, 4, -8], [168, 16, 16]].map(p => `<rect x="${p[0] - 13}" y="${p[1]}" width="26" height="26" rx="7" fill="#f0493a" stroke="#c22e22" stroke-width="3" transform="rotate(${p[2]} ${p[0]} ${p[1] + 13})"/><rect x="${p[0] - 7}" y="${p[1] + 5}" width="12" height="5" rx="2.5" fill="#ff9a8c" transform="rotate(${p[2]} ${p[0]} ${p[1] + 13})"/>`).join('')}`, 70);
  const tacoCheese = L(`<g stroke-linecap="round">${[[20, 30, 44, 8], [38, 34, 60, 6], [58, 30, 84, 12], [80, 34, 100, 4], [100, 30, 124, 10], [120, 34, 144, 4], [140, 30, 164, 12], [160, 34, 182, 10], [50, 36, 30, 12], [92, 36, 70, 10], [134, 36, 112, 8], [174, 36, 152, 12]].map(p => `<line x1="${p[0]}" y1="${p[1]}" x2="${p[2]}" y2="${p[3]}" stroke="#e39f12" stroke-width="8"/><line x1="${p[0]}" y1="${p[1]}" x2="${p[2]}" y2="${p[3]}" stroke="#ffd24d" stroke-width="5"/>`).join('')}</g>`, 70);

  /* cupcake (side view) */
  const cupcakeBase = S(`<path d="M18 46 Q18 22 50 22 Q82 22 82 46Z" fill="#e2a95a" stroke="#b97a2f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M14 44 H86 L76 94 Q75 98 70 98 H30 Q25 98 24 94Z" fill="#ff8fb3" stroke="#e0527f" stroke-width="3" stroke-linejoin="round"/>
      <g stroke="#e0527f" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M28 50 L34 94"/><path d="M42 50 L44 94"/><path d="M58 50 L56 94"/><path d="M72 50 L66 94"/></g>`);
  const frosting = (c) => S(`<g fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="3" stroke-linejoin="round">
      <path d="M6 62 Q4 44 26 42 H74 Q96 44 94 62 Q94 76 76 76 H24 Q6 76 6 62Z"/>
      <path d="M18 42 Q16 26 36 24 H64 Q84 26 82 42 Q82 52 66 52 H34 Q18 52 18 42Z"/>
      <path d="M32 26 Q32 10 50 4 Q68 10 68 26 Q68 34 56 34 H44 Q32 34 32 26Z"/></g>
      <path d="M18 56 Q24 48 36 48 M30 34 Q36 28 44 28" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".6"/>`, '0 0 100 80');
  const sprinkleBits = S(spread(10, 17, 30, (x, y, rot, i) => `<rect ${at(x, y, rot)} x="-7" y="-2.4" width="14" height="4.8" rx="2.4" fill="${['#ff5a4e', '#ffc93c', '#3dccb0', '#5cb8ff', '#9b6bff', '#fff'][i % 6]}" stroke="#0002" stroke-width=".8"/>`));

  /* misc */
  const hotdogBun = S(`<rect x="6" y="6" width="188" height="78" rx="38" fill="#e7a850" stroke="#b97425" stroke-width="3"/>
      <rect x="20" y="30" width="160" height="30" rx="15" fill="#f9dfa6"/><path d="M30 22 Q90 10 150 18" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".35"/>`, '0 0 200 90');
  const cheeseSq = S(`<rect x="12" y="12" width="76" height="76" rx="9" fill="#ffc933" stroke="#e39f12" stroke-width="3" transform="rotate(8 50 50)"/>
      <g fill="#f2ad18" transform="rotate(8 50 50)"><circle cx="34" cy="36" r="6"/><circle cx="62" cy="58" r="8"/><circle cx="38" cy="68" r="4"/><circle cx="66" cy="30" r="4"/></g>`);
  const grilledCheese = S(`<g stroke-linejoin="round">
      <path d="M12 16 L80 12 L14 84Z" fill="#ffc933" stroke="#e39f12" stroke-width="3" transform="translate(3 4)"/>
      <path d="M10 14 L78 10 L12 82Z" fill="#e2a850" stroke="#a8641f" stroke-width="4"/>
      <path d="M90 22 L88 90 L22 92Z" fill="#ffc933" stroke="#e39f12" stroke-width="3" transform="translate(-3 -3)"/>
      <path d="M92 24 L90 92 L24 94Z" fill="#e2a850" stroke="#a8641f" stroke-width="4"/></g>
      <g stroke="#b5762b" stroke-width="3.5" stroke-linecap="round" opacity=".6"><path d="M22 26 L50 22"/><path d="M22 42 L40 38"/><path d="M78 50 L80 78"/><path d="M62 70 L64 84"/></g>
      <path d="M30 72 Q36 82 32 90" stroke="#ffc933" stroke-width="7" stroke-linecap="round" fill="none"/>`);
  const potatoOpen = S(`<ellipse cx="50" cy="52" rx="46" ry="33" fill="#b9814a" stroke="#8a5a2b" stroke-width="3"/>
      <g fill="#8a5a2b" opacity=".6"><circle cx="18" cy="48" r="2"/><circle cx="84" cy="58" r="2"/><circle cx="26" cy="70" r="2"/><circle cx="76" cy="34" r="2"/></g>
      <path d="M16 52 Q30 30 50 36 Q72 28 86 50 Q72 74 50 68 Q28 76 16 52Z" fill="#fff0c4" stroke="#e6cf8e" stroke-width="2.5"/>
      <path d="M30 50 Q40 42 50 48 Q60 54 72 46" stroke="#f4dc9a" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  const dip = S(`<circle cx="50" cy="50" r="42" fill="#fff" stroke="#d9d2c5" stroke-width="3"/><circle cx="50" cy="50" r="32" fill="#e23d2e" stroke="#b92a1d" stroke-width="2.5"/>
      <path d="M32 44 Q38 32 52 32" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".5"/>`);
  const pepperoni = S(`<circle cx="50" cy="50" r="44" fill="#d1402f" stroke="#a02a1d" stroke-width="5"/><g fill="#a82f22"><circle cx="36" cy="36" r="7"/><circle cx="64" cy="44" r="6"/><circle cx="44" cy="66" r="7"/><circle cx="68" cy="68" r="4.5"/></g>`);
  const pepperRing = S(`<path d="M50 10 C64 8 70 16 78 20 C90 28 92 42 88 52 C92 66 82 80 70 84 C60 92 42 92 32 84 C18 80 8 66 12 52 C8 40 12 26 24 20 C32 14 38 10 50 10Z" fill="none" stroke="#2f9e3f" stroke-width="13"/>
      <path d="M50 10 C64 8 70 16 78 20 C90 28 92 42 88 52 C92 66 82 80 70 84 C60 92 42 92 32 84 C18 80 8 66 12 52 C8 40 12 26 24 20 C32 14 38 10 50 10Z" fill="none" stroke="#58c463" stroke-width="7"/>`);
  const cheeseMelt = S(`<path d="M50 6 C66 2 80 14 88 26 C98 38 96 56 92 66 C88 82 74 92 60 94 C46 98 28 94 18 84 C6 74 2 58 6 44 C8 28 20 14 32 10 C38 6 44 6 50 6Z" fill="#ffd24d" stroke="#f0b21c" stroke-width="2.5" opacity=".96"/>
      <g fill="#f3a922" opacity=".75"><ellipse cx="30" cy="34" rx="7" ry="5"/><ellipse cx="66" cy="28" rx="6" ry="4"/><ellipse cx="72" cy="64" rx="8" ry="5"/><ellipse cx="38" cy="72" rx="6" ry="4"/><ellipse cx="52" cy="50" rx="5" ry="4"/></g>`);
  const cheeseShred = (n, R) => S(spread(n, 23, R, stick('#ffd24d', 20, 4.6)));
  const salad = S(`${spread(12, 31, 36, leaf(['#6ccb4b', '#8ed95f', '#4fb53a', '#a6e07a'], 1.7))}
      ${spread(5, 41, 30, coin('#7fcf6a', '#e9f7cf', 8))}${spread(5, 47, 28, coin('#ff9a3c', '#ffb866', 6.5))}${spread(6, 53, 32, dice(['#f0493a', '#ff6b5b'], 9))}`);
  const spatula = S(`<path d="M52 56 L84 88" stroke="#c98a4b" stroke-width="10" stroke-linecap="round"/><path d="M52 56 L84 88" stroke="#e0a868" stroke-width="5" stroke-linecap="round"/>
      <path d="M12 26 L34 8 Q38 5 42 9 L64 38 Q66 42 62 45 L46 58 Q42 61 38 57 L12 32 Q9 29 12 26Z" fill="#6b7280" stroke="#3f4650" stroke-width="3" stroke-linejoin="round"/>
      <g stroke="#3f4650" stroke-width="3.5" stroke-linecap="round"><path d="M28 24 L44 44"/><path d="M36 18 L52 38"/></g>`);
  const spoon = S(`<path d="M44 52 L86 90" stroke="#b97d3f" stroke-width="11" stroke-linecap="round"/><path d="M44 52 L86 90" stroke="#e0a868" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="30" cy="32" rx="19" ry="25" transform="rotate(-42 30 32)" fill="#e0a868" stroke="#b97d3f" stroke-width="3.5"/>
      <ellipse cx="29" cy="31" rx="10" ry="15" transform="rotate(-42 29 31)" fill="#c98f4f" opacity=".7"/>`);
  const pin = S(`<g transform="rotate(-38 50 50)"><rect x="-2" y="43" width="104" height="14" rx="7" fill="#b97d3f"/><rect x="18" y="33" width="64" height="34" rx="14" fill="#e9bd80" stroke="#b97d3f" stroke-width="3.5"/><rect x="26" y="38" width="42" height="6" rx="3" fill="#fff" opacity=".4"/></g>`);
  const doughBall = S(`<circle cx="50" cy="52" r="40" fill="#f6e6c0" stroke="#dcc48e" stroke-width="3"/><path d="M26 42 Q32 24 52 22" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>
      <path d="M40 60 Q52 68 64 58" stroke="#dcc48e" stroke-width="3" fill="none" stroke-linecap="round"/>`);

  /* ---------- the chef ---------- */
  const chef = S(`<g stroke="#e6ddd0" stroke-width="2" fill="#fff"><circle cx="33" cy="22" r="13"/><circle cx="67" cy="22" r="13"/><circle cx="50" cy="15" r="15"/><rect x="29" y="24" width="42" height="15" rx="4"/></g>
      <rect x="31" y="20" width="38" height="12" fill="#fff"/>
      <circle cx="22" cy="48" r="10" fill="#b9763f"/><circle cx="78" cy="48" r="10" fill="#b9763f"/><circle cx="22" cy="48" r="5" fill="#f0c49a"/><circle cx="78" cy="48" r="5" fill="#f0c49a"/>
      <circle cx="50" cy="64" r="31" fill="#c98749"/>
      <ellipse cx="50" cy="74" rx="15" ry="12" fill="#f6dfc2"/>
      <ellipse cx="50" cy="67" rx="5.5" ry="4" fill="#4a3526"/>
      <path class="chef-mouth" d="M42 75 Q50 84 58 75" stroke="#4a3526" stroke-width="3" fill="#ff8f8f" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="37" cy="58" r="4" fill="#2d1f16"/><circle cx="63" cy="58" r="4" fill="#2d1f16"/><circle cx="38.4" cy="56.6" r="1.4" fill="#fff"/><circle cx="64.4" cy="56.6" r="1.4" fill="#fff"/>
      <circle cx="28" cy="70" r="5.5" fill="#ff8f8f" opacity=".6"/><circle cx="72" cy="70" r="5.5" fill="#ff8f8f" opacity=".6"/>`);

  /* ---------- the visual registry ----------
     n    spoken name          h   picture (cooked / normal look)
     r    raw-look picture     ar  height / width (default 1)
     sink how far a stacked layer sinks into the one below (0..1)
     s    the sound it makes when it lands (pour, poof, shake, crack, squirt, splat, thud)
     d    how it lands when dropped: {as, at, w, raw}               */
  const V = {
    // pantry
    flour: { s: 'poof', n: 'flour', h: sack('#f4ead7', '🌾'), d: { as: 'flourPile' } },
    sugar: { s: 'poof', n: 'sugar', h: sack('#ffd9e6', '🍬'), d: { as: 'sugarPile' } },
    crumbs: { s: 'poof', n: 'bread crumbs', h: box('#f0a04b', '🍞'), d: { as: 'crumbPile' } },
    macBox: { s: 'shake', n: 'macaroni', h: box('#3b82f6', '🧀'), d: { as: 'mac', raw: true } },
    spaghettiBox: { s: 'shake', n: 'spaghetti', h: box('#2f9e6f', '🍝'), d: { as: 'spaghettiRaw' } },
    noodleBox: { s: 'shake', n: 'noodles', h: box('#f6b93b', '🍜'), d: { as: 'noodles', raw: true } },
    water: { s: 'pour', n: 'water', h: jug, d: { as: 'waterFill', at: 'fill' } },
    oil: { s: 'pour', n: 'oil', h: bottle('#e8d44d', '#4c9a2a', '🫒'), d: { as: 'oilPuddle' } },
    ketchup: { s: 'squirt', n: 'ketchup', h: bottle('#e23d2e', '#fff', '🍅'), d: { as: 'squiggleRed' } },
    mustard: { s: 'squirt', n: 'mustard', h: bottle('#ffc93c', '#e39f12', '🌭'), d: { as: 'squiggleYellow' } },
    syrup: { s: 'pour', n: 'syrup', h: bottle('#b5651d', '#e23d2e', '🍁'), d: { as: 'syrupSide' } },
    dressing: { s: 'pour', n: 'dressing', h: bottle('#f5efd6', '#3dccb0', '🥗'), d: { as: 'dressingDrizzle', at: 'center', w: 70 } },
    sauce: { s: 'pour', n: 'tomato sauce', h: jar('#e23d2e', '#ffc93c', '🍅'), d: { as: 'sauceDisc' } },
    pb: { s: 'splat', n: 'peanut butter', h: jar('#c68a4a', '#e23d2e', '🥜'), d: { as: 'pbSide' } },
    jelly: { s: 'splat', n: 'jelly', h: jar('#8e44ad', '#ffffff', '🍇'), d: { as: 'jellySide' } },
    sourCream: { s: 'splat', n: 'sour cream', h: jar('#f7f7f2', '#5cb8ff', '🥛'), d: { as: 'dollop' } },
    cinnamon: { s: 'shake', n: 'cinnamon', h: shaker('#f3e1c7', '#b5651d', ['#8a4510', '#b5651d']), d: { as: 'specksBrown', at: 'center', w: 80 } },
    spice: { s: 'shake', n: 'taco spice', h: shaker('#ffe1c2', '#e2572e', ['#e2572e', '#c2410c', '#f59e0b']), d: { as: 'specksRed', at: 'center', w: 80 } },
    sprinkles: { s: 'shake', n: 'sprinkles', h: shaker('#fff', '#ff7eb6', ['#ff5a4e', '#ffc93c', '#3dccb0', '#5cb8ff', '#9b6bff']), d: { as: 'sprinkleBits' } },
    frostPink: { s: 'squirt', n: 'pink frosting', h: pipingBag('#ff8fb3'), d: { as: 'frostingPink' } },
    frostBlue: { s: 'squirt', n: 'blue frosting', h: pipingBag('#7cc7ff'), d: { as: 'frostingBlue' } },
    batterBowl: { s: 'pour', n: 'batter', h: bowlOf('#f6dc9a') },

    // fresh things (emoji)
    egg: { s: 'crack', n: 'egg', h: E('🥚'), d: { as: 'eggIn', raw: true } },
    milk: { s: 'pour', n: 'milk', h: E('🥛'), d: { as: 'milkPuddle' } },
    butter: { s: 'splat', n: 'butter', h: E('🧈') },
    cheese: { s: 'splat', n: 'cheese', h: E('🧀') },
    salt: { s: 'shake', n: 'salt', h: E('🧂'), d: { as: 'specksWhite', at: 'center', w: 80 } },
    bacon: { n: 'bacon', h: E('🥓') },
    toast: { s: 'thud', n: 'toast', h: E('🍞') },
    lettuce: { n: 'lettuce', h: E('🥬') },
    tomato: { n: 'tomato', h: E('🍅') },
    potato: { s: 'thud', n: 'potato', h: E('🥔') },
    carrot: { n: 'carrot', h: E('🥕') },
    onion: { n: 'onion', h: E('🧅') },
    cucumber: { n: 'cucumber', h: E('🥒') },
    corn: { s: 'thud', n: 'corn', h: E('🌽') },
    apple: { s: 'thud', n: 'apple', h: E('🍎') },
    banana: { n: 'banana', h: E('🍌') },
    strawberry: { n: 'strawberry', h: E('🍓') },
    blueberry: { n: 'blueberries', h: E('🫐') },
    cherry: { n: 'cherry', h: E('🍒') },
    chocolate: { s: 'shake', n: 'chocolate chips', h: E('🍫'), d: { as: 'chips' } },
    beef: { s: 'thud', n: 'beef', h: E('🥩'), d: { as: 'groundBeef', raw: true } },
    pepper: { n: 'green pepper', h: E('🫑'), d: { as: 'pepperRing' } },

    // tools
    spoon: { n: 'spoon', h: spoon },
    knife: { n: 'knife', h: E('🔪') },
    pin: { n: 'rolling pin', h: pin },
    spatula: { n: 'spatula', h: spatula },
    fire: { n: 'heat', h: E('🔥') },

    // what things look like in the bowl, pot or pan
    flourPile: { h: pile('#fbf6ea') },
    sugarPile: { h: pile('#ffffff', '#cfe9ff') },
    crumbPile: { h: pile('#e8b770', '#b97d3f') },
    milkPuddle: { h: puddle('#ffffff', 0.95) },
    oilPuddle: { h: puddle('#f2e15a', 0.6) },
    butterMelt: { h: puddle('#ffe36b', 0.9) },
    chips: { h: S(spread(9, 19, 28, (x, y, rot) => `<rect ${at(x, y, rot)} x="-6" y="-5.5" width="12" height="11" rx="4" fill="#5a341c" stroke="#3b2010" stroke-width="1.2"/>`)) },
    waterFill: { h: fill('#8fd0f7', 0.8) },
    broth: { h: fill('#f4c95a', 0.88) },
    sauceFill: { h: fill('#dd4a30', 0.96, spread(6, 5, 34, dot(['#c2371f', '#f06a4f'], 4))) },
    specksWhite: { h: specks(['#ffffff', '#f1f5f9']) },
    specksBrown: { h: specks(['#8a4510', '#b5651d'], 22) },
    specksRed: { h: specks(['#e2572e', '#c2410c', '#f59e0b'], 22) },
    eggIn: { h: eggIn('#ffffff', 1), r: eggIn('#fffbe8', 0.62) },
    batter: { n: 'batter', h: blob('#f6dc9a', swirl('#e0bf6e')) },
    cookieDough: { h: blob('#dcb37a', swirl('#c2955a') + spread(9, 29, 30, dot(['#5a341c'], 4))) },
    macCheese: { h: blob('#f9b02e', spread(14, 37, 34, elbow('#ffd76a'))) },
    mac: { h: S(spread(10, 43, 30, elbow('#f9c645'))), r: S(spread(10, 43, 30, elbow('#f5e6b5'))) },
    spaghettiRaw: { h: rawSpaghetti },
    noodleNest: { n: 'spaghetti', h: nest('#f6dc8a') },
    noodles: { h: nest('#f6dc8a', 5) },
    dressingDrizzle: { h: drizzle('#fbf6dd') },
    salad: { h: salad },

    // chopped things
    carrotCoins: { n: 'carrots', h: S(spread(7, 3, 28, coin('#ff9a3c', '#ffb866', 10))) },
    cucumberSlices: { n: 'cucumber', h: S(spread(6, 5, 27, coin('#58b84a', '#dff5c2', 11))) },
    tomatoBits: { n: 'tomato', h: S(spread(8, 7, 28, dice(['#f0493a', '#ff6b5b'], 13))) },
    lettuceBits: { n: 'lettuce', h: S(spread(8, 9, 28, leaf(['#6ccb4b', '#8ed95f', '#4fb53a'], 1.25))) },
    onionBits: { n: 'onion', h: S(spread(8, 13, 28, (x, y, rot) => `<path ${at(x, y, rot)} d="M-9 4 A10 10 0 0 1 9 4" fill="none" stroke="#b983c9" stroke-width="6" stroke-linecap="round"/><path ${at(x, y, rot)} d="M-9 4 A10 10 0 0 1 9 4" fill="none" stroke="#f6eafa" stroke-width="3.2" stroke-linecap="round"/>`)) },
    appleSlices: { n: 'apple slices', h: S(spread(6, 15, 27, wedge)) },
    bananaCoins: { n: 'banana', h: S(spread(6, 17, 27, coin('#fff0b0', '#f7e08a', 11))), d: { as: 'bananaSide' } },
    baconBits: { h: S(spread(9, 25, 28, dice(['#b5472f', '#d9694a', '#8f2f1c'], 9))) },
    cheeseShreds: { h: cheeseShred(12, 28) },
    parm: { h: S(spread(18, 27, 32, stick('#fffbe6', 9, 3.4))) },

    // things that cook (raw look -> cooked look)
    pancake: { s: 'thud', n: 'pancake', h: disc('#dd9a44', '#e9b464'), r: disc('#f8e7b6', '#fbf0cf'), d: { as: 'pancakeSide' } },
    waffle: { s: 'thud', n: 'waffle', h: waffleArt('#e5a544', '#c98328'), r: waffleArt('#f8e7b6', '#eed9a0') },
    patty: { s: 'thud', n: 'burger', h: meat('#7b4a2d', true, true), r: meat('#e2857c', true), d: { as: 'pattySide' } },
    meatball: { s: 'thud', n: 'meatball', h: meat('#80492a', false), r: meat('#e2857c', false) },
    groundBeef: { n: 'beef', h: S(spread(11, 33, 30, (x, y, rot, i) => `<circle cx="${x}" cy="${y}" r="${8 + (i % 3)}" fill="#7b4a2d" stroke="#55301a" stroke-width="2"/>`)), r: S(spread(11, 33, 30, (x, y, rot, i) => `<circle cx="${x}" cy="${y}" r="${8 + (i % 3)}" fill="#e2857c" stroke="#c9645b" stroke-width="2"/>`)), d: { as: 'tacoBeef' } },
    sausage: { s: 'thud', n: 'hot dog', h: sausageArt('#b5482f', true), r: sausageArt('#f29a8e'), ar: 0.26 },
    chickenRaw: { s: 'thud', n: 'chicken', h: chunk('#f3dcae'), r: chunk('#f7b9b0') },
    nugget: { n: 'nugget', h: nug('#dc9a3c', '#b87424'), r: nug('#f3e2ba', '#e3c88f') },
    fries: { n: 'fries', h: friesArt('#f5b82e'), r: friesArt('#f8ecb4') },
    cookie: { n: 'cookie', h: cookieArt('#cf8f4e', 45), r: cookieArt('#e3c08c', 30) },
    cupcakeTop: { n: 'cupcake', h: disc('#e2a95a', '#eebf78', 30), r: disc('#f8e7b6', '#fbf0cf', 30) },
    slice: { s: 'thud', n: 'bread', h: breadTop('#e2a850', '#a8641f', true), r: breadTop('#fff6e0', '#d9a45b'), d: { as: 'breadSide' } },
    crust: { n: 'pizza dough', h: crustArt('#f0cf8c', '#dc9f4c'), r: crustArt('#f8ecd0', '#f1dfb6') },
    pizzaCheese: { h: cheeseMelt, r: cheeseShred(26, 38) },
    pieCrust: { h: pieCrustArt('#e3ae5e'), r: pieCrustArt('#f6e6c0') },
    lattice: { n: 'pie top', h: latticeArt('#e0a44e'), r: latticeArt('#f6e6c0') },
    doughBall: { s: 'thud', n: 'dough', h: doughBall },
    potatoOpen: { s: 'thud', n: 'baked potato', h: potatoOpen },
    grilledCheese: { n: 'grilled cheese', h: grilledCheese },

    // toppings and layers
    sauceDisc: { h: S(`<path d="M50 5 C72 3 95 22 94 48 C96 74 74 96 50 95 C26 96 4 76 6 50 C4 24 28 5 50 5Z" fill="#dd4a30" stroke="#b9341f" stroke-width="2"/><path d="M26 38 Q34 22 52 20" stroke="#ff9a85" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>`) },
    cheeseSq: { h: cheeseSq },
    pepperoni: { n: 'pepperoni', h: pepperoni },
    pepperRing: { h: pepperRing },
    hotdogBun: { s: 'thud', n: 'bun', h: hotdogBun, ar: 0.45 },
    squiggleRed: { h: squiggle('#e23d2e'), ar: 0.27 },
    squiggleYellow: { h: squiggle('#ffc93c'), ar: 0.27 },
    syrupPool: { h: drizzle('#b5651d', 0.9) },
    dollop: { h: dollop('#fbfbf6') },
    dip: { n: 'ketchup', h: dip },
    butterPat: { s: 'splat', n: 'butter', h: E('🧈'), d: { as: 'butterPatSide' } },

    // side-view stack layers
    pancakeSide: { h: pancakeSide, ar: 0.22, sink: 0.22 },
    butterPatSide: { h: butterPatSide, ar: 0.17, sink: 0.1 },
    syrupSide: { h: syrupSide, ar: 0.39, sink: 0.82 },
    bunBottom: { s: 'thud', n: 'bun', h: bunBottom, ar: 0.23, sink: 0.06 },
    bunTop: { s: 'thud', n: 'bun', h: bunTop, ar: 0.45, sink: 0.08 },
    pattySide: { h: pattySide, ar: 0.21, sink: 0.12 },
    cheeseSide: { h: cheeseSide, ar: 0.22, sink: 0.66 },
    lettuceSide: { h: lettuceSide, ar: 0.19, sink: 0.4 },
    tomatoSide: { h: tomatoSide, ar: 0.14, sink: 0.14 },
    breadSide: { h: breadSide, ar: 0.2, sink: 0.08 },
    pbSide: { h: wavy('#c68a4a'), ar: 0.14, sink: 0.3 },
    jellySide: { h: wavy('#8e44ad'), ar: 0.14, sink: 0.3 },
    bananaSide: { h: bananaSide, ar: 0.11, sink: 0.2 },

    // taco + cupcake parts
    tacoShell: { s: 'thud', n: 'taco shell', h: tacoShell, ar: 0.56 },
    tacoBeef: { h: bumps('#7b4a2d', 0), ar: 0.35 },
    tacoLettuce: { h: frill, ar: 0.35 },
    tacoTomato: { h: tacoTomato, ar: 0.35 },
    tacoCheese: { h: tacoCheese, ar: 0.35 },
    cupcake: { s: 'thud', n: 'cupcake', h: cupcakeBase },
    frostingPink: { h: frosting('#ff8fb3'), ar: 0.8 },
    frostingBlue: { h: frosting('#7cc7ff'), ar: 0.8 },
    sprinkleBits: { h: sprinkleBits },
  };

  /* ---------- more food: Tex-Mex, Cajun & Creole, Filipino ---------- */
  const inner = (svg) => svg.replace(/<\/?svg[^>]*>/g, '');
  const put = (svg, x, y, k, rot) => `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${k})">${inner(svg)}</g>`;
  const dipArt = (c) => S(`<circle cx="50" cy="50" r="42" fill="#fff" stroke="#d9d2c5" stroke-width="3"/><circle cx="50" cy="50" r="32" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/>
      <path d="M32 44 Q38 32 52 32" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".5"/>`);
  const tri = (c) => (x, y, rot) => `<path ${at(x, y, rot)} d="M0 -14 L13 9 L-13 9Z" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const sticks = (cs, w, h) => (x, y, rot, i) => stick(cs[i % cs.length], w, h)(x, y, rot);
  const arcs = (c, c2) => (x, y, rot) => `<path ${at(x, y, rot)} d="M-9 4 A10 10 0 0 1 9 4" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><path ${at(x, y, rot)} d="M-9 4 A10 10 0 0 1 9 4" fill="none" stroke="${c2}" stroke-width="3.2" stroke-linecap="round"/>`;
  const bean = (c) => (x, y, rot) => `<ellipse ${at(x, y, rot)} rx="9" ry="6" fill="${c}" stroke="${sh(c, -0.3)}" stroke-width="1.5"/>`;
  const grain = (c) => (x, y, rot) => `<ellipse ${at(x, y, rot)} rx="4.4" ry="2" fill="${c}" stroke="${sh(c, -0.1)}" stroke-width=".8"/>`;
  const tortillaArt = (c, spot) => S(`<circle cx="50" cy="50" r="46" fill="${c}" stroke="${sh(c, -0.18)}" stroke-width="2.5"/>
      ${spread(9, 61, 34, (x, y, r, i) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${4 + i % 3}" ry="${3 + i % 2}" fill="${spot}" opacity=".7"/>`)}`);
  const rollArt = (c, spot) => S(`<rect x="5" y="7" width="190" height="40" rx="20" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>
      <ellipse cx="183" cy="27" rx="7" ry="14" fill="${sh(c, -0.14)}"/><path d="M24 17 H140" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/>
      <g fill="${spot}" opacity=".75">${[[40, 32], [72, 26], [104, 36], [136, 28], [160, 36]].map(p => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="6" ry="3.5"/>`).join('')}</g>`, '0 0 200 54');
  const sauceDiscArt = (c) => S(`<path d="M50 5 C72 3 95 22 94 48 C96 74 74 96 50 95 C26 96 4 76 6 50 C4 24 28 5 50 5Z" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2"/>
      <path d="M26 38 Q34 22 52 20" stroke="${sh(c, 0.45)}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>`);
  const puff = (c) => S(`<rect x="13" y="13" width="74" height="74" rx="22" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="3" transform="rotate(7 50 50)"/>
      <path d="M30 40 Q36 26 54 24" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".45"/>`);
  const celeryArt = S(`<g fill="none" stroke-linecap="round"><path d="M34 92 Q28 54 38 22" stroke="#5fae4d" stroke-width="18"/><path d="M34 92 Q28 54 38 22" stroke="#a9dd8f" stroke-width="11"/>
      <path d="M60 92 Q62 56 68 26" stroke="#5fae4d" stroke-width="18"/><path d="M60 92 Q62 56 68 26" stroke="#a9dd8f" stroke-width="11"/></g>
      <g fill="#3f9d2a" stroke="#2c7a1d" stroke-width="2"><circle cx="34" cy="16" r="10"/><circle cx="46" cy="12" r="8"/><circle cx="66" cy="18" r="10"/><circle cx="78" cy="14" r="8"/></g>`);
  const radishArt = S(`<g fill="#58b84a" stroke="#3f9d2a" stroke-width="2" stroke-linejoin="round"><path d="M50 30 Q36 20 34 4 Q48 10 50 30Z"/><path d="M50 30 Q64 20 68 4 Q52 10 50 30Z"/><path d="M50 30 Q46 12 50 2 Q56 12 50 30Z"/></g>
      <path d="M50 26 C68 26 72 48 64 70 Q58 92 50 97 Q42 92 36 70 C28 48 32 26 50 26Z" fill="#fdfdf8" stroke="#d6d2c2" stroke-width="3"/>
      <path d="M40 42 Q38 56 42 68" stroke="#e9e6d8" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  const tamarindArt = S(`<g stroke="#5c3a18" stroke-width="3" stroke-linejoin="round" fill="#9a6532"><path d="M12 62 Q22 18 74 14 Q86 14 84 24 Q46 30 30 70 Q22 82 12 62Z"/><path d="M34 86 Q52 50 88 48 Q96 50 92 58 Q64 62 50 88 Q42 96 34 86Z"/></g>
      <g stroke="#5c3a18" stroke-width="2.5" stroke-linecap="round" opacity=".6"><path d="M32 34 L40 44"/><path d="M50 22 L56 32"/><path d="M62 62 L68 70"/></g>`);
  const wrapperArt = S(`<rect x="16" y="16" width="68" height="68" rx="5" fill="#fbf3dc" stroke="#e3d2a4" stroke-width="2.5" transform="rotate(45 50 50)"/><path d="M34 44 L50 28" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`);
  const fillStrip = S(`<rect x="8" y="10" width="184" height="40" rx="20" fill="#e8a596" stroke="#c9796b" stroke-width="3"/>
      <g>${[[30, 28, '#ff9a3c'], [58, 22, '#6ccb4b'], [86, 34, '#fff'], [112, 24, '#ff9a3c'], [140, 34, '#6ccb4b'], [166, 26, '#fff']].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${p[2]}"/>`).join('')}</g>`, '0 0 200 60');
  const scoopArt = (c) => S(`<path d="M10 60 Q6 8 50 6 Q94 8 90 60 Q82 70 68 62 Q58 72 46 62 Q34 72 24 62 Q14 68 10 60Z" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M26 34 Q32 18 50 16" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".45"/>`, '0 0 100 74');
  const cubes = (cs) => L(`${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${6 + i * 32}" y="4" width="28" height="28" rx="6" fill="${cs[i % cs.length]}" stroke="${sh(cs[i % cs.length], -0.22)}" stroke-width="2.5"/><rect x="${11 + i * 32}" y="8" width="12" height="5" rx="2.5" fill="#fff" opacity=".5"/>`).join('')}`, 36);
  const milkDrip = L(`<path d="M14 10 Q100 -6 186 10 L186 26 Q186 44 174 44 Q164 44 164 30 L164 24 L140 24 L140 56 Q140 70 128 70 Q116 70 116 56 L116 24 L84 24 L84 40 Q84 52 73 52 Q62 52 62 40 L62 24 L36 24 L36 60 Q36 74 25 74 Q14 74 14 60Z" fill="#fffdf2" stroke="#e6dfc4" stroke-width="3" stroke-linejoin="round"/>`, 78);
  const quesadillaArt = S(`${inner(tortillaArt('#e9b55c', '#b97a2a'))}
      <g stroke="#a8641f" stroke-width="3" stroke-linecap="round"><path d="M50 5 V95"/><path d="M5 50 H95"/><path d="M18 18 L82 82"/><path d="M82 18 L18 82"/></g>
      <g fill="#ffc933" stroke="#e39f12" stroke-width="1.5">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<circle cx="${(50 + Math.cos(a * Math.PI / 180) * 45).toFixed(1)}" cy="${(50 + Math.sin(a * Math.PI / 180) * 45).toFixed(1)}" r="4.5"/>`).join('')}</g>`);
  const riceMound = S(`<path d="M50 12 C74 10 92 30 90 52 C92 74 72 90 50 88 C28 90 8 74 10 52 C8 30 26 10 50 12Z" fill="#fffdf6" stroke="#e3dccb" stroke-width="2.5"/>${spread(26, 87, 32, grain('#f1ebdb'))}`);
  const gumboFill = fill('#6e4322', 0.96, spread(6, 95, 30, dot(['#8a5a2b', '#55331a'], 4)));

  Object.assign(V, {
    // Tex-Mex
    tortilla: { s: 'thud', n: 'tortilla', h: tortillaArt('#f3dfae', '#c9953f'), r: tortillaArt('#fbf1d6', '#ecd9a8') },
    enchilada: { h: rollArt('#f1d9a0', '#d9a85a'), ar: 0.27 },
    chipBag: { s: 'shake', n: 'chips', h: box('#e8590c', '🌽'), d: { as: 'tortillaChips' } },
    tortillaChips: { n: 'chips', h: S(spread(7, 79, 27, tri('#f2c14e'))) },
    beans: { s: 'splat', n: 'beans', h: E('🫘'), d: { as: 'beanPile' } },
    beanPile: { h: S(spread(10, 77, 28, bean('#8a4b2d'))) },
    jalapeno: { n: 'jalapeño', h: E('🌶️'), d: { as: 'jalapenoSlices' } },
    jalapenoSlices: { h: S(spread(4, 67, 20, coin('#3f9d2a', '#c5ebaa', 11))) },
    chiliSauce: { s: 'pour', n: 'chili sauce', h: jar('#9c2f1b', '#ffc93c', '🌶️'), d: { as: 'chiliSauceDisc' } },
    chiliSauceDisc: { h: sauceDiscArt('#a8331c') },
    chiliSpice: { s: 'shake', n: 'chili spice', h: shaker('#ffe1c2', '#b9341f', ['#b9341f', '#e2572e', '#f59e0b']), d: { as: 'specksRed', at: 'center', w: 80 } },
    salsa: { s: 'splat', n: 'salsa', h: dipArt('#d93a2b'), d: { as: 'salsaDollop' } },
    salsaDollop: { h: dollop('#e0452f') },
    guac: { s: 'splat', n: 'guacamole', h: dipArt('#7cc04a'), d: { as: 'guacDollop' } },
    guacDollop: { h: dollop('#8fcf58') },
    steak: { s: 'thud', n: 'steak', h: E('🥩'), d: { as: 'steakStrips', raw: true } },
    steakStrips: { n: 'steak', h: S(spread(7, 71, 27, stick('#7b4a2d', 32, 10))), r: S(spread(7, 71, 27, stick('#e2857c', 32, 10))) },
    pepperStrips: { n: 'peppers', h: S(spread(8, 73, 28, sticks(['#58c463', '#f0493a', '#ffc93c'], 30, 7))) },
    pepperBits: { n: 'peppers', h: S(spread(9, 75, 28, dice(['#58c463', '#2f9e3f', '#7fd487'], 11))) },
    fajitaMix: { n: 'steak and peppers', h: S(spread(6, 81, 26, stick('#7b4a2d', 30, 10)) + spread(7, 83, 30, sticks(['#58c463', '#f0493a', '#ffc93c'], 28, 7)) + spread(4, 84, 26, arcs('#b983c9', '#f6eafa'))) },
    quesadilla: { s: 'thud', n: 'quesadilla', h: quesadillaArt },
    nachos: { h: S(spread(8, 79, 30, tri('#f2c14e')) + inner(drizzle('#ffc933', 0.95)) + spread(4, 67, 28, coin('#3f9d2a', '#c5ebaa', 6)) + spread(4, 69, 26, bean('#8a4b2d'))) },
    enchiladas: { h: S(`<rect x="6" y="14" width="88" height="72" rx="12" fill="#fff" stroke="#d9d2c5" stroke-width="3"/>${[24, 43, 62].map(y => put(rollArt('#f1d9a0', '#d9a85a'), 13, y, 0.37)).join('')}
      <path d="M12 40 Q30 30 50 40 T88 40 L88 66 Q70 76 50 66 T12 66Z" fill="#a8331c" opacity=".92"/><path d="M20 50 Q36 44 50 52 T80 50" stroke="#ffc933" stroke-width="7" stroke-linecap="round" fill="none"/>`) },
    chili: { h: blob('#a23b1e', spread(8, 85, 30, bean('#6e2a16')) + spread(8, 86, 32, dot(['#c9532c', '#7a2a12'], 3.6))) },

    // Cajun & Creole
    rice: { s: 'poof', n: 'rice', h: E('🍚'), d: { as: 'riceMound', at: 'center', w: 70 } },
    riceMound: { n: 'rice', h: riceMound },
    riceGrains: { h: S(spread(30, 89, 34, grain('#fffdf6'))) },
    crawfish: { s: 'thud', n: 'crawfish', h: E('🦞') },
    celery: { n: 'celery', h: celeryArt },
    celeryBits: { n: 'celery', h: S(spread(8, 101, 28, arcs('#5fae4d', '#c9eeb5'))) },
    cajun: { s: 'shake', n: 'Cajun spice', h: shaker('#ffe1c2', '#7a2e12', ['#c2410c', '#e2572e', '#7a2e12']), d: { as: 'specksRed', at: 'center', w: 80 } },
    andouille: { s: 'thud', n: 'sausage', h: sausageArt('#9c3b25', true), d: { as: 'sausageCoins' } },
    sausageCoins: { n: 'sausage', h: S(spread(6, 93, 27, coin('#9c3b25', '#c4573a', 10))) },
    roux: { n: 'roux', h: blob('#8a5a2b', swirl('#6e4322')), r: blob('#f1dfae', swirl('#dcc48e')) },
    trinity: { n: 'veggies', h: S(spread(5, 97, 26, dice(['#58c463', '#2f9e3f'], 11)) + spread(5, 99, 28, arcs('#b983c9', '#f6eafa')) + spread(5, 102, 27, arcs('#5fae4d', '#c9eeb5'))) },
    lemon: { n: 'lemon', h: E('🍋') },
    etouffee: { n: 'étouffée', h: blob('#e08a2e', spread(7, 91, 28, (x, y, rot) => `<path ${at(x, y, rot)} d="M-8 4 A8 8 0 1 1 8 4" stroke="#b9341f" stroke-width="8" fill="none" stroke-linecap="round"/><path ${at(x, y, rot)} d="M-8 4 A8 8 0 1 1 8 4" stroke="#f0604a" stroke-width="5" fill="none" stroke-linecap="round"/>`) + spread(8, 92, 32, dot(['#58c463'], 2.6))) },
    gumboFill: { h: gumboFill },
    gumbo: { h: S(inner(gumboFill) + put(riceMound, 28, 26, 0.44) + spread(4, 93, 30, coin('#9c3b25', '#c4573a', 7)) + spread(5, 97, 34, dot(['#58c463'], 3))) },
    jambalaya: { h: blob('#e58a3a', spread(22, 89, 34, grain('#fff3d6')) + spread(5, 93, 28, coin('#9c3b25', '#c4573a', 7)) + spread(6, 97, 30, dice(['#58c463'], 6))) },
    dough: { h: blob('#f3e3bd', swirl('#dcc48e')) },
    beignet: { s: 'thud', n: 'beignet', h: puff('#dfa040'), r: puff('#f6e8c4') },
    powderSugar: { s: 'shake', n: 'powdered sugar', h: shaker('#f3f6f9', '#aab4c0', ['#ffffff', '#dfe6ee']), d: { as: 'sugarDust', at: 'center', w: 92 } },
    sugarDust: { h: S(spread(46, 103, 42, (x, y, rot, i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${2.6 + (i % 4)}" fill="#fff" opacity="${i % 3 ? 0.95 : 0.8}"/>`)) },
    beignetPlate: { h: S(put(puff('#dfa040'), 4, 30, 0.52) + put(puff('#dfa040'), 44, 34, 0.52) + put(puff('#dfa040'), 24, 2, 0.52) + spread(30, 103, 38, (x, y, rot, i) => `<circle cx="${x.toFixed(1)}" cy="${(y * 0.8).toFixed(1)}" r="${2 + (i % 3)}" fill="#fff" opacity=".95"/>`)) },
    oilFill: { h: fill('#f2d64b', 0.78) },

    // Filipino
    pork: { s: 'thud', n: 'pork', h: chunk('#d9b58c'), r: chunk('#f2a5a0') },
    wrapper: { n: 'wrapper', h: wrapperArt },
    porkMix: { s: 'splat', n: 'filling', h: blob('#e8a596', spread(9, 105, 28, dot(['#ff9a3c', '#6ccb4b', '#ffffff'], 3.6))), d: { as: 'fillStrip' } },
    fillStrip: { h: fillStrip, ar: 0.3 },
    lumpia: { s: 'thud', n: 'lumpia', h: rollArt('#dc9a34', '#b87424'), r: rollArt('#f6ebcf', '#e9d9ad'), ar: 0.27 },
    lumpiaPlate: { h: S(put(rollArt('#dc9a34', '#b87424'), 8, 16, 0.42, 6) + put(rollArt('#dc9a34', '#b87424'), 6, 40, 0.42, -4) + put(rollArt('#dc9a34', '#b87424'), 10, 62, 0.42, 4) + put(dipArt('#f0622d'), 62, 58, 0.36)) },
    hands: { n: 'hands', h: E('🙌') },
    sweetChili: { s: 'splat', n: 'dipping sauce', h: dipArt('#f0622d') },
    cabbage: { n: 'cabbage', h: E('🥬') },
    greens: { n: 'greens', h: E('🥬'), d: { as: 'cabbageBits' } },
    cabbageBits: { n: 'cabbage', h: S(spread(8, 107, 28, leaf(['#b7e59a', '#9bd97c', '#d3f0bd'], 1.25))) },
    radish: { s: 'thud', n: 'radish', h: radishArt },
    radishCoins: { n: 'radish', h: S(spread(6, 109, 27, coin('#fdfdf8', '#efecdf', 11))) },
    tamarind: { s: 'thud', n: 'tamarind', h: tamarindArt },
    soy: { s: 'pour', n: 'soy sauce', h: bottle('#3b2416', '#e23d2e', '🥢'), d: { as: 'soyPuddle' } },
    soyPuddle: { h: puddle('#5a3418', 0.85) },
    soyFill: { h: fill('#5a3418', 0.92) },
    vinegar: { s: 'pour', n: 'vinegar', h: bottle('#f3f0df', '#3dccb0', '🍶'), d: { as: 'vinegarPuddle' } },
    vinegarPuddle: { h: puddle('#fbf8e6', 0.7) },
    garlic: { n: 'garlic', h: E('🧄') },
    bayLeaf: { n: 'bay leaf', h: E('🌿') },
    shrimp: { n: 'shrimp', h: E('🦐') },
    adoboChicken: { s: 'thud', n: 'chicken', h: chunk('#8a4b22'), r: chunk('#f7b9b0') },
    adoboPlate: { h: S(put(riceMound, 2, 24, 0.58) + put(chunk('#8a4b22'), 50, 10, 0.42) + put(chunk('#8a4b22'), 56, 46, 0.42) + put(E('🌿'), 36, 2, 0.26)) },
    sinigangBroth: { h: fill('#e9d98f', 0.9) },
    sinigang: { h: S(inner(fill('#e9d98f', 1)) + put(chunk('#d9b58c'), 20, 22, 0.3) + put(chunk('#d9b58c'), 52, 50, 0.28) + spread(4, 109, 30, coin('#fdfdf8', '#efecdf', 8)) + spread(5, 107, 32, leaf(['#58b84a', '#7fcf6a'], 1)) + spread(4, 7, 30, dice(['#f0493a'], 9))) },
    sopas: { h: fill('#fbf0cf', 0.98, spread(11, 111, 34, elbow('#f6d46a')) + spread(5, 113, 30, coin('#ff9a3c', '#ffb866', 6)) + spread(5, 115, 32, leaf(['#9bd97c', '#b7e59a'], 0.8))) },
    pancit: { n: 'pancit', h: S(inner(nest('#f0d58a')) + spread(5, 117, 28, coin('#ff9a3c', '#ffb866', 6)) + spread(6, 119, 30, leaf(['#58b84a', '#9bd97c'], 0.8)) + spread(3, 121, 24, (x, y, rot) => `<path ${at(x, y, rot)} d="M-7 4 A8 8 0 1 1 7 4" stroke="#f0806a" stroke-width="6" fill="none" stroke-linecap="round"/>`)) },
    sweetBeans: { s: 'splat', n: 'sweet beans', h: jar('#7a2f3a', '#ffd24d', '🫘'), d: { as: 'hhBeans' } },
    hhBeans: { h: L(`<rect x="4" y="3" width="192" height="50" rx="12" fill="#7a2f3a" stroke="#541c26" stroke-width="3"/><g fill="#a8485a">${[22, 52, 84, 114, 146, 176].map((x, i) => `<ellipse cx="${x}" cy="${20 + (i % 2) * 14}" rx="11" ry="7"/>`).join('')}</g>`, 56), ar: 0.28, sink: 0.04 },
    gulaman: { s: 'splat', n: 'jelly', h: S(spread(5, 113, 22, dice(['#3dccb0', '#ff5a7a', '#ffd24d'], 24))), d: { as: 'hhJelly' } },
    hhJelly: { h: cubes(['#3dccb0', '#ff5a7a', '#ffd24d']), ar: 0.18, sink: 0.06 },
    ice: { s: 'shake', n: 'ice', h: E('🧊'), d: { as: 'hhIce' } },
    hhIce: { h: L(`<path d="M4 78 Q-2 34 40 28 Q58 2 100 10 Q142 2 160 28 Q202 34 196 78Z" fill="#f4fbff" stroke="#c4e0f2" stroke-width="3" stroke-linejoin="round"/><g fill="#d6ecf9">${[[40, 50], [76, 34], [112, 52], [146, 38], [166, 60], [92, 64]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5"/>`).join('')}</g>`, 80), ar: 0.4, sink: 0.08 },
    hhMilk: { h: milkDrip, ar: 0.39, sink: 0.84 },
    ube: { s: 'splat', n: 'ube ice cream', h: scoopArt('#9b6bd6'), d: { as: 'ubeScoop' } },
    ubeScoop: { h: scoopArt('#9b6bd6'), ar: 0.74, sink: 0.3 },
    flan: { s: 'thud', n: 'flan', h: E('🍮'), sink: 0.3 },
    haloMixed: { h: S(`<rect x="4" y="4" width="92" height="118" rx="10" fill="#cfa9ec" stroke="#a77bd0" stroke-width="3"/>
      <path d="M16 34 Q40 16 60 38 T84 50 M14 84 Q36 66 56 88 T86 98" stroke="#f4e9ff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
      <g>${[[24, 58, '#3dccb0'], [66, 70, '#ff5a7a'], [38, 106, '#ffd24d'], [74, 108, '#7a2f3a'], [22, 102, '#7a2f3a'], [62, 22, '#ffd24d']].map(p => `<rect x="${p[0] - 7}" y="${p[1] - 7}" width="14" height="14" rx="4" fill="${p[2]}"/>`).join('')}</g>`, '0 0 100 126'), ar: 1.26 },
  });

  /* ---------- pots, pans, plates ----------
     box = [left%, top%, size%] of the square where food goes */
  const A = (inner) => `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" overflow="visible">${inner}</svg>`;
  function flames(cx, cy, r) {
    let o = '';
    for (let i = 0; i < 12; i++) {
      o += `<g transform="rotate(${i * 30 + 8} ${cx} ${cy})"><g class="fl" style="animation-delay:${-(i % 5) * 0.13}s;transform-origin:${cx}px ${cy - r + 4}px">
        <path d="M${cx - 20} ${cy - r + 8} Q${cx} ${cy - r - 62} ${cx + 20} ${cy - r + 8}Z" fill="#ff8a1f"/><path d="M${cx - 11} ${cy - r + 8} Q${cx} ${cy - r - 34} ${cx + 11} ${cy - r + 8}Z" fill="#ffd84a"/></g></g>`;
    }
    return `<g class="flames">${o}</g>`;
  }
  const burner = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="#2a2e36"/><circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="none" stroke="#565d6b" stroke-width="5"/>${flames(cx, cy, r)}`;
  function bowlArt(c) {
    return A(`<circle cx="150" cy="158" r="140" fill="#000" opacity=".12"/><circle cx="150" cy="148" r="140" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="4"/>
      <circle cx="150" cy="148" r="114" fill="${sh(c, 0.72)}" stroke="${sh(c, -0.12)}" stroke-width="3"/>
      <path d="M40 96 Q70 36 138 20" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none" opacity=".45"/>`);
  }
  const VESSEL = {
    bowl: { art: bowlArt('#5cb8ff'), box: [14, 13.3, 72], round: true },
    bowl2: { art: bowlArt('#ff7a59'), box: [14, 13.3, 72], round: true },
    pot: {
      art: A(`${burner(150, 148, 128)}<rect x="-6" y="128" width="50" height="40" rx="14" fill="#4b5563"/><rect x="256" y="128" width="50" height="40" rx="14" fill="#4b5563"/>
        <circle cx="150" cy="148" r="128" fill="#c3ccd6" stroke="#8792a0" stroke-width="4"/><circle cx="150" cy="148" r="108" fill="#e9eef3" stroke="#aab4c0" stroke-width="3"/>
        <path d="M50 96 Q76 44 134 30" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".6"/>`),
      box: [15.4, 14.7, 69.2], round: true, stove: true,
    },
    pan: {
      art: A(`${burner(140, 140, 122)}<path d="M226 226 L288 288" stroke="#23262d" stroke-width="34" stroke-linecap="round"/><path d="M240 240 L284 284" stroke="#3b404a" stroke-width="14" stroke-linecap="round"/>
        <circle cx="140" cy="140" r="124" fill="#343944" stroke="#1f2228" stroke-width="4"/><circle cx="140" cy="140" r="106" fill="#59606e" stroke="#444a56" stroke-width="3"/>
        <path d="M44 100 Q66 48 122 32" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".25"/>`),
      box: [12.4, 12.4, 68.6], round: true, stove: true,
    },
    board: {
      art: A(`<rect x="18" y="34" width="264" height="252" rx="34" fill="#000" opacity=".12"/><rect x="18" y="24" width="264" height="252" rx="34" fill="#e3ac6c" stroke="#b97d3f" stroke-width="4"/>
        <g stroke="#cf9450" stroke-width="4" stroke-linecap="round" fill="none" opacity=".8"><path d="M40 90 Q150 76 260 92"/><path d="M40 150 Q150 164 260 148"/><path d="M40 212 Q150 198 260 214"/></g>
        <circle cx="150" cy="46" r="9" fill="#b97d3f"/>`),
      box: [12, 12, 76], round: false,
    },
    sheet: {
      art: A(`<rect x="12" y="32" width="276" height="256" rx="30" fill="#000" opacity=".12"/><rect x="12" y="22" width="276" height="256" rx="30" fill="#aab3bd" stroke="#7d8793" stroke-width="4"/>
        <rect x="30" y="40" width="240" height="220" rx="18" fill="#f3ecdf" stroke="#d6ccb9" stroke-width="3"/>
        <path d="M30 70 Q60 50 100 44" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`),
      box: [12, 12, 76], round: false,
    },
    plate: {
      art: A(`<circle cx="150" cy="158" r="142" fill="#000" opacity=".12"/><circle cx="150" cy="150" r="142" fill="#fff" stroke="#d9d2c5" stroke-width="4"/>
        <circle cx="150" cy="150" r="127" fill="none" stroke="#5cb8ff" stroke-width="7"/><circle cx="150" cy="150" r="104" fill="#fbf8f2" stroke="#ebe4d8" stroke-width="3"/>`),
      box: [13, 13, 74], round: true,
    },
    side: {
      art: A(`<ellipse cx="150" cy="282" rx="140" ry="12" fill="#000" opacity=".12"/><path d="M6 262 H294 Q286 286 240 286 H60 Q14 286 6 262Z" fill="#fff" stroke="#d9d2c5" stroke-width="4" stroke-linejoin="round"/>
        <path d="M20 270 H280" stroke="#5cb8ff" stroke-width="6" stroke-linecap="round"/>`),
      box: [10, 7, 80], round: false, side: true,
    },
    tin: {
      art: A(`<rect x="8" y="52" width="284" height="214" rx="26" fill="#000" opacity=".12"/><rect x="8" y="42" width="284" height="214" rx="26" fill="#aab3bd" stroke="#7d8793" stroke-width="4"/>
        ${[102, 196].map(y => [62, 150, 238].map(x => `<circle cx="${x}" cy="${y}" r="40" fill="#8792a0"/><circle cx="${x}" cy="${y}" r="35" fill="#ff8fb3" stroke="#e0527f" stroke-width="3" stroke-dasharray="6 5"/><circle cx="${x}" cy="${y}" r="27" fill="#ffc2d6"/>`).join('')).join('')}`),
      box: [0, 0, 100], round: false,
      slots: [[20.7, 34], [50, 34], [79.3, 34], [20.7, 65.3], [50, 65.3], [79.3, 65.3]],
    },
    pie: {
      art: A(`<circle cx="150" cy="158" r="142" fill="#000" opacity=".12"/><circle cx="150" cy="150" r="142" fill="#ef6f5e" stroke="#c44b3c" stroke-width="4"/>
        <circle cx="150" cy="150" r="122" fill="#f9f1e4" stroke="#e3d7c2" stroke-width="3"/><path d="M40 98 Q68 40 134 22" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".45"/>`),
      box: [10.5, 10.5, 79], round: true,
    },
    iron: {
      art: A(`<rect x="126" y="250" width="48" height="50" rx="14" fill="#23262d"/><rect x="24" y="34" width="252" height="252" rx="46" fill="#000" opacity=".12"/>
        <rect x="24" y="24" width="252" height="252" rx="46" fill="#3f4551" stroke="#23262d" stroke-width="4"/><rect x="48" y="48" width="204" height="204" rx="26" fill="#6b7280" stroke="#565d6b" stroke-width="3"/>
        <g stroke="#565d6b" stroke-width="5">${[1, 2, 3].map(i => `<path d="M${48 + i * 51} 52 V248"/><path d="M52 ${48 + i * 51} H248"/>`).join('')}</g>
        <rect class="glow" x="48" y="48" width="204" height="204" rx="26" fill="#ff7a1f"/>
        <circle class="lamp" cx="252" cy="36" r="9" fill="#7a2a2a" stroke="#23262d" stroke-width="3"/>`),
      box: [17.5, 17.5, 65], round: false, heat: 'iron',
    },
  };

  // a tall glass seen from the side (halo-halo); `front` is drawn over the food
  VESSEL.glass = {
    art: A(`<ellipse cx="150" cy="270" rx="78" ry="9" fill="#000" opacity=".12"/>
      <path d="M82 112 H218 L210 252 Q209 264 198 264 H102 Q91 264 90 252Z" fill="#e6f5ff" stroke="#9fd0ee" stroke-width="4" stroke-linejoin="round" opacity=".92"/>`),
    front: A(`<path d="M82 112 H218 L210 252 Q209 264 198 264 H102 Q91 264 90 252Z" fill="none" stroke="#9fd0ee" stroke-width="4" stroke-linejoin="round"/>
      <path d="M98 128 L102 240" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>`),
    box: [10, 7, 80], round: false, side: true,
  };

  const OVEN = `<svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <rect x="22" y="196" width="26" height="16" rx="5" fill="#2d8f7b"/><rect x="252" y="196" width="26" height="16" rx="5" fill="#2d8f7b"/>
    <rect x="8" y="6" width="284" height="198" rx="22" fill="#3dccb0" stroke="#2d9f89" stroke-width="4"/>
    <rect x="22" y="16" width="256" height="30" rx="12" fill="#2aa890"/>
    <g fill="#fff" stroke="#d9d2c5" stroke-width="2"><circle cx="48" cy="31" r="9"/><circle cx="78" cy="31" r="9"/><circle cx="252" cy="31" r="9"/></g>
    <g stroke="#ff5a4e" stroke-width="3" stroke-linecap="round"><path d="M48 31 V24"/><path d="M78 31 L83 26"/><path d="M252 31 V24"/></g>
    <rect x="118" y="22" width="64" height="18" rx="6" fill="#1d3d36"/><circle class="lamp" cx="204" cy="31" r="5" fill="#7a2a2a"/>
    <rect x="30" y="56" width="240" height="140" rx="14" fill="#3a2a22"/>
    <rect class="glow" x="30" y="56" width="240" height="140" rx="14" fill="#ff8a1f"/>
    <g stroke="#7a675c" stroke-width="3" stroke-linecap="round"><path d="M40 128 H260"/><path d="M40 164 H260"/></g>
    <g class="door">
      <rect x="24" y="52" width="252" height="146" rx="16" fill="#35b89e" stroke="#2d9f89" stroke-width="4"/>
      <rect x="52" y="82" width="196" height="92" rx="12" fill="#2b1d18" opacity=".86"/><rect class="glow win" x="52" y="82" width="196" height="92" rx="12" fill="#ffb347"/>
      <path d="M66 98 L96 92" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/>
      <rect x="64" y="60" width="172" height="12" rx="6" fill="#fff" stroke="#d9d2c5" stroke-width="2"/>
    </g></svg>`;

  const ICON = S(`<rect width="100" height="100" rx="22" fill="#ffc93c"/><circle cx="50" cy="52" r="42" fill="#fff6e4"/><g transform="translate(9 10) scale(.82)">${chef.replace(/<\/?svg[^>]*>/g, '')}</g>`);

  window.ART = { V, VESSEL, OVEN, chef, E, S, ICON };
})();
