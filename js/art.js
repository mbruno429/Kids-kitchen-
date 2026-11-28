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

  /* ---------- things to choose from, washing hands, the "heat off" button ---------- */
  Object.assign(V, {
    mushroom: { n: 'mushrooms', h: E('🍄'), d: { as: 'mushroomSlice' } },
    mushroomSlice: { h: S(`<path d="M8 50 Q8 12 50 12 Q92 12 92 50 Q74 60 62 54 L65 84 Q50 92 35 84 L38 54 Q26 60 8 50Z" fill="#eadbc3" stroke="#b39676" stroke-width="5" stroke-linejoin="round"/>
      <path d="M24 40 Q30 24 50 22" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".6"/>`) },
    pineapple: { n: 'pineapple', h: E('🍍'), d: { as: 'pineappleBit' } },
    pineappleBit: { h: S(`<path d="M14 78 Q8 30 50 12 Q92 30 86 78 Q50 92 14 78Z" fill="#ffd94d" stroke="#e0a520" stroke-width="5" stroke-linejoin="round"/>
      <g stroke="#f0b930" stroke-width="4" stroke-linecap="round"><path d="M50 26 V70"/><path d="M32 40 L40 72"/><path d="M68 40 L60 72"/></g>`) },
    bananaCoin: { h: S(coin('#fff0b0', '#f7e08a', 42)(50, 50, 0)) },
    frostChoc: { s: 'squirt', n: 'chocolate frosting', h: pipingBag('#8a5a3c'), d: { as: 'frostingChoc' } },
    frostingChoc: { h: frosting('#8a5a3c'), ar: 0.8 },
    soap: { s: 'squirt', n: 'soap', h: E('🧼') },
    drop: { s: 'pour', n: 'water', h: E('💧') },
    wetHands: { h: E('👐', 78) },
    heatOff: { h: S(`<text x="50" y="50" dy=".36em" font-size="62" text-anchor="middle" opacity=".85">🔥</text>
      <circle cx="50" cy="50" r="41" fill="none" stroke="#e5352b" stroke-width="9"/><path d="M21 21 L79 79" stroke="#e5352b" stroke-width="9" stroke-linecap="round"/>`) },
  });

  /* ---------- Japanese, Thai and Chinese food, and frozen treats ---------- */
  const NORI = '#23402b';
  const scallionArt = S(`<g fill="none" stroke-linecap="round"><path d="M40 70 Q36 44 26 10" stroke="#3f9d2a" stroke-width="10"/><path d="M52 70 Q54 40 60 6" stroke="#58b84a" stroke-width="10"/><path d="M62 70 Q68 46 82 18" stroke="#3f9d2a" stroke-width="9"/></g>
      <path d="M33 96 Q28 70 38 62 H64 Q74 70 69 96 Q51 100 33 96Z" fill="#fdfdf3" stroke="#d6d2c2" stroke-width="3" stroke-linejoin="round"/>`);
  const ringlet = (c, c2, rad) => (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad}" fill="${c2}" stroke="${c}" stroke-width="${(rad * 0.7).toFixed(1)}"/>`;
  const shrimpArc = (x, y, rot) => `<path ${at(x, y, rot)} d="M-7 4 A8 8 0 1 1 7 4" stroke="#d9563f" stroke-width="8" fill="none" stroke-linecap="round"/><path ${at(x, y, rot)} d="M-7 4 A8 8 0 1 1 7 4" stroke="#ff9a85" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const noriArt = S(`<rect x="8" y="8" width="84" height="84" rx="7" fill="${NORI}" stroke="#16291b" stroke-width="3"/>${spread(14, 123, 34, dot(['#2f5a3b', '#1b3322'], 2.4))}
      <path d="M18 22 Q30 16 44 18" stroke="#4f7d5c" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>`);
  const riceLayer = S(`<rect x="8" y="12" width="84" height="76" rx="14" fill="#fffdf6" stroke="#e3dccb" stroke-width="2.5"/>${spread(30, 125, 36, grain('#efe8d6'))}`);
  const salmonArt = S(`<path d="M10 40 Q30 14 62 20 Q90 26 92 52 Q88 78 56 82 Q24 84 10 60Z" fill="#ff8a5c" stroke="#e0603a" stroke-width="3" stroke-linejoin="round"/>
      <g stroke="#ffd2bd" stroke-width="4" stroke-linecap="round" fill="none"><path d="M30 32 Q40 50 32 72"/><path d="M48 24 Q60 50 50 78"/><path d="M68 26 Q80 50 70 74"/></g>`);
  const makiArt = S(`<circle cx="50" cy="50" r="45" fill="${NORI}" stroke="#16291b" stroke-width="3"/><circle cx="50" cy="50" r="36" fill="#fffdf6"/>${spread(14, 127, 26, grain('#e9e2cf'))}
      <rect x="36" y="36" width="15" height="15" rx="4" fill="#ff8a5c"/><rect x="50" y="42" width="14" height="14" rx="4" fill="#58b84a"/><rect x="39" y="51" width="13" height="13" rx="4" fill="#cfe58a"/>`);
  const onigiriArt = S(`<path d="M50 9 Q59 9 65 20 L91 64 Q99 84 80 89 H20 Q1 84 9 64 L35 20 Q41 9 50 9Z" fill="#fffdf6" stroke="#bfb393" stroke-width="4" stroke-linejoin="round"/>
      <path d="M20 84 H80 Q92 80 88 66" fill="none" stroke="#e6dcc0" stroke-width="6" stroke-linecap="round"/>
      ${[[50, 28], [40, 44], [60, 46], [30, 62], [50, 60], [70, 64], [22, 78], [78, 78]].map((p, i) => grain('#ebe4d2')(p[0], p[1], i * 47)).join('')}`);
  const eggHalf = S(`<ellipse cx="50" cy="50" rx="33" ry="42" fill="#fffdf6" stroke="#e3dccb" stroke-width="3"/><circle cx="50" cy="54" r="18" fill="#ffb81f" stroke="#f09a0b" stroke-width="2.5"/>
      <path d="M40 48 Q44 40 54 40" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>`);
  const tempuraArt = (c) => S(`<path d="M150 26 L194 6 L184 36 L196 62 L150 50Z" fill="#f0604a" stroke="#b9341f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M14 40 Q10 14 34 16 Q44 4 60 14 Q74 4 90 14 Q106 4 120 16 Q140 8 156 24 Q168 40 154 54 Q140 68 120 60 Q106 72 90 62 Q74 74 58 62 Q42 72 30 62 Q12 64 14 40Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M30 32 Q60 20 110 28" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".4"/>`, '0 0 200 78');
  const tamagoArt = S(`<rect x="10" y="22" width="80" height="56" rx="14" fill="#ffd84a" stroke="#e0a520" stroke-width="3"/>
      <path d="M26 50 Q26 36 44 36 H62 Q74 38 74 50 Q74 62 62 62 H50 Q42 60 42 52" fill="none" stroke="#f0b930" stroke-width="4" stroke-linecap="round"/>`);
  const limeArt = S(`<circle cx="50" cy="52" r="40" fill="#6cc04a" stroke="#3f9d2a" stroke-width="3"/><path d="M28 40 Q34 24 52 22" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".45"/><circle cx="50" cy="12" r="4" fill="#3f9d2a"/>`);
  const limeWedge = S(`<path d="M8 30 Q50 6 92 30 Q86 82 50 86 Q14 82 8 30Z" fill="#d9f2a6" stroke="#4fae34" stroke-width="6" stroke-linejoin="round"/>
      <g stroke="#a9d86a" stroke-width="4" stroke-linecap="round"><path d="M50 26 V76"/><path d="M30 30 L42 72"/><path d="M70 30 L58 72"/></g>`);
  const lemongrassArt = S(`<g fill="none" stroke-linecap="round"><path d="M22 90 Q30 50 26 10" stroke="#9fbf5a" stroke-width="12"/><path d="M22 90 Q30 50 26 10" stroke="#e3efb4" stroke-width="6"/>
      <path d="M50 92 Q52 50 54 8" stroke="#9fbf5a" stroke-width="12"/><path d="M50 92 Q52 50 54 8" stroke="#e3efb4" stroke-width="6"/>
      <path d="M78 90 Q72 50 82 12" stroke="#9fbf5a" stroke-width="12"/><path d="M78 90 Q72 50 82 12" stroke="#e3efb4" stroke-width="6"/></g>`);
  const mushBit = (x, y, rot) => `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(.26)" d="M-42 0 Q-42 -38 0 -38 Q42 -38 42 0 Q24 10 12 4 L15 34 Q0 42 -15 34 L-12 4 Q-24 10 -42 0Z" fill="#eadbc3" stroke="#b39676" stroke-width="7" stroke-linejoin="round"/>`;
  const stickOnly = `<path d="M4 23 H196" stroke="#b9925a" stroke-width="7" stroke-linecap="round"/><path d="M4 22 H196" stroke="#e9c88f" stroke-width="4" stroke-linecap="round"/>`;
  const satayArt = (c, marks) => S(`${stickOnly}${[30, 72, 114].map((x, i) => `<rect x="${x}" y="${5 + (i % 2) * 2}" width="38" height="${34 - (i % 2) * 3}" rx="12" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>
      ${marks ? `<g stroke="${sh(c, -0.5)}" stroke-width="3.5" stroke-linecap="round" opacity=".7"><path d="M${x + 9} 12 L${x + 15} 32"/><path d="M${x + 21} 12 L${x + 27} 32"/></g>` : ''}`).join('')}`, '0 0 200 46');
  const mangoSlices = S(`${[[18, 0], [44, 6], [70, 0]].map(p => `<path transform="translate(${p[0]} ${p[1]})" d="M4 14 Q16 -2 22 16 L22 74 Q14 92 4 76Z" fill="#ffb829" stroke="#e58a0b" stroke-width="3" stroke-linejoin="round"/><path transform="translate(${p[0]} ${p[1]})" d="M10 22 V70" stroke="#ffe08a" stroke-width="4" stroke-linecap="round"/>`).join('')}`);
  const dumplingArt = (c) => S(`<path d="M6 58 Q8 16 50 14 Q92 16 94 58 Q94 70 78 70 H22 Q6 70 6 58Z" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="3" stroke-linejoin="round"/>
      <g fill="none" stroke="${sh(c, -0.24)}" stroke-width="3" stroke-linecap="round"><path d="M22 34 Q26 22 34 22"/><path d="M36 26 Q42 16 50 18"/><path d="M52 18 Q60 16 66 26"/><path d="M68 22 Q76 22 80 34"/></g>
      <path d="M20 52 Q30 44 44 44" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".6"/>`, '0 0 100 76');
  const coneArt = S(`<path d="M16 16 H84 L55 124 Q50 132 45 124Z" fill="#e9b45c" stroke="#b97a2f" stroke-width="3" stroke-linejoin="round"/>
      <g stroke="#c98a3c" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M28 22 L62 96"/><path d="M46 20 L70 70"/><path d="M64 20 L78 44"/><path d="M72 22 L38 96"/><path d="M54 20 L30 70"/><path d="M36 20 L22 44"/></g>
      <rect x="10" y="6" width="80" height="16" rx="8" fill="#f0c273" stroke="#b97a2f" stroke-width="3"/>`, '0 0 100 132');
  const berryLayer = L(`${[8, 46, 84, 122, 160].map(x => `<path d="M${x} 6 H${x + 32} Q${x + 34} 30 ${x + 16} 40 Q${x - 2} 30 ${x} 6Z" fill="#f0493a" stroke="#c22e22" stroke-width="3" stroke-linejoin="round"/><circle cx="${x + 10}" cy="16" r="2" fill="#ffe08a"/><circle cx="${x + 22}" cy="18" r="2" fill="#ffe08a"/><circle cx="${x + 16}" cy="28" r="2" fill="#ffe08a"/>`).join('')}`, 46);
  const shakeMixed = S(`<rect x="4" y="4" width="92" height="118" rx="10" fill="#ffb3cf" stroke="#f07fa8" stroke-width="3"/>
      <path d="M16 34 Q40 16 60 38 T84 50 M14 84 Q36 66 56 88 T86 98" stroke="#ffe3ee" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
      <g fill="#f0493a">${[[26, 60], [68, 72], [40, 104], [72, 26]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5"/>`).join('')}</g>`, '0 0 100 126');
  const whipArt = S(`<path d="M8 50 Q2 34 20 32 Q18 16 38 20 Q46 4 58 18 Q78 12 78 30 Q98 32 92 50 Q92 60 80 60 H20 Q8 60 8 50Z" fill="#fffdf6" stroke="#e3dccb" stroke-width="3" stroke-linejoin="round"/>
      <path d="M26 42 Q34 32 46 34 M54 30 Q62 24 70 30" stroke="#ebe4d2" stroke-width="4" stroke-linecap="round" fill="none"/>`, '0 0 100 64');
  const donutArt = (c) => S(`<circle cx="50" cy="50" r="29" fill="none" stroke="${sh(c, -0.24)}" stroke-width="34"/><circle cx="50" cy="50" r="29" fill="none" stroke="${c}" stroke-width="28"/>
      <path d="M24 38 Q32 22 50 20" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".45"/>`);
  const DONUT_AT = [[32, 34], [68, 36], [50, 70]];
  const glazeAll = (c) => S(DONUT_AT.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="10.4" fill="none" stroke="${sh(c, -0.18)}" stroke-width="9.4"/><circle cx="${p[0]}" cy="${p[1]}" r="10.4" fill="none" stroke="${c}" stroke-width="7.6"/>
      <path d="M${p[0] - 9} ${p[1] - 5} Q${p[0] - 5} ${p[1] - 11} ${p[0] + 2} ${p[1] - 11}" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/>`).join(''));
  const slabArt = (c, crack) => S(`<rect x="6" y="10" width="88" height="80" rx="10" fill="${c}" stroke="${sh(c, -0.3)}" stroke-width="3"/>
      ${crack ? `<g stroke="${sh(c, -0.35)}" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M18 30 L34 36 L44 28"/><path d="M58 24 L66 38 L82 34"/><path d="M22 66 L38 60 L48 72"/><path d="M60 62 L72 72 L84 64"/><path d="M40 46 L54 50 L62 44"/></g>` : `<path d="M18 28 Q40 16 70 22" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".35"/>`}`);
  const brownieSq = S(`<rect x="8" y="8" width="84" height="84" rx="12" fill="#5a341c" stroke="#3b2010" stroke-width="3"/><rect x="8" y="8" width="84" height="20" rx="10" fill="#6e4426" opacity=".9"/>
      <g stroke="#3b2010" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M24 44 L40 50 L50 42"/><path d="M56 62 L68 72 L80 64"/><path d="M26 74 L38 68"/></g>
      <g fill="#2e180c"><circle cx="66" cy="42" r="4"/><circle cx="34" cy="60" r="4"/><circle cx="52" cy="78" r="3.5"/></g>`);
  const popFill = (c, frozen) => S(`<rect x="8" y="6" width="84" height="328" rx="30" fill="${c}" opacity="${frozen ? 1 : 0.72}" stroke="${sh(c, -0.2)}" stroke-width="5"/>
      ${frozen ? `<g fill="#fff" opacity=".8">${[[30, 50], [64, 96], [36, 150], [66, 210], [34, 270], [60, 300]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="6"/>`).join('')}</g>` : '<path d="M26 40 V200" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".5"/>'}`, '0 0 100 340');
  const popStick = S(`<rect x="14" y="6" width="72" height="388" rx="34" fill="#e9c88f" stroke="#b9925a" stroke-width="9"/>`, '0 0 100 400');
  const icePop = (c) => S(`<rect x="38" y="118" width="24" height="78" rx="11" fill="#e9c88f" stroke="#b9925a" stroke-width="3"/>
      <path d="M14 46 Q14 6 50 6 Q86 6 86 46 V124 Q86 138 72 138 H28 Q14 138 14 124Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M30 30 V104" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".5"/><path d="M56 22 H86 V46 Q72 40 56 22Z" fill="#fff" opacity=".25"/>`, '0 0 100 200');
  const leafArt = S(`<path d="M6 54 Q20 12 60 10 Q92 12 95 44 Q92 84 50 92 Q14 92 6 54Z" fill="#4fae4a" stroke="#2f8a35" stroke-width="3" stroke-linejoin="round"/>
      <g fill="none" stroke="#7fd07a" stroke-width="3" stroke-linecap="round"><path d="M12 56 Q50 44 92 40"/><path d="M34 50 L30 26"/><path d="M52 46 L52 18"/><path d="M70 43 L76 22"/><path d="M36 51 L38 80"/><path d="M56 47 L62 82"/><path d="M74 43 L84 66"/></g>`);
  const POP = '#ff6f9f';
  const fillPic = (c, extra) => S(`${inner(fill(c, 1))}${extra}`);

  Object.assign(V, {
    // shared
    scallion: { n: 'green onion', h: scallionArt },
    scallionBits: { n: 'green onion', h: S(spread(11, 131, 28, ringlet('#58b84a', '#d9f2c2', 5))) },
    broccoli: { n: 'broccoli', h: E('🥦') },
    peanuts: { s: 'shake', n: 'peanuts', h: E('🥜'), d: { as: 'peanutBits', at: 'center', w: 66 } },
    peanutBits: { h: S(spread(14, 143, 32, dot(['#d9a85a', '#b98238', '#e8c382'], 3.6))) },
    saucePuddle: { h: puddle('#a3541a', 0.85) },
    soyDip: { h: dipArt('#3b2416') },

    // Japanese
    nori: { n: 'seaweed', h: noriArt },
    noriStrip: { h: S(`<rect x="6" y="14" width="88" height="72" rx="8" fill="${NORI}" stroke="#16291b" stroke-width="4"/>`) },
    riceLayer: { h: riceLayer },
    salmon: { s: 'thud', n: 'salmon', h: salmonArt, d: { as: 'salmonStrips' } },
    salmonStrips: { h: S([32, 50, 68].map(y => `<rect x="14" y="${y - 6}" width="72" height="12" rx="6" fill="#ff8a5c" stroke="#e0603a" stroke-width="2"/>`).join('')) },
    cucumberSticks: { n: 'cucumber', h: S(spread(7, 133, 26, stick('#6cc04a', 34, 8))) },
    avocado: { n: 'avocado', h: E('🥑') },
    avocadoSlices: { n: 'avocado', h: S(spread(6, 135, 26, (x, y, rot) => `<path ${at(x, y, rot)} d="M-13 5 Q0 -14 13 5 Q0 0 -13 5Z" fill="#cfe58a" stroke="#6f9a3a" stroke-width="2.5" stroke-linejoin="round"/>`)) },
    maki: { s: 'thud', n: 'sushi', h: makiArt },
    onigiri: { s: 'thud', n: 'rice ball', h: onigiriArt },
    eggHalf: { h: eggHalf },
    fishCake: { n: 'fish cake', h: E('🍥') },
    ramenBroth: { h: fill('#c98a3c', 0.95, spread(6, 137, 32, dot(['#e0aa5a', '#b0752c'], 4))) },
    ramenNoodles: { h: nest('#f6dc8a') },
    tempuraShrimp: { s: 'thud', n: 'shrimp', h: tempuraArt('#e2a53e'), r: tempuraArt('#f5ead0'), ar: 0.39 },
    tempuraVeg: { s: 'thud', n: 'broccoli', h: nug('#e2a53e', '#58b84a'), r: nug('#f3ead0', '#58b84a') },
    tempuraDip: { h: dipArt('#8a5a2b') },
    teriyaki: { s: 'pour', n: 'teriyaki sauce', h: bottle('#5a3418', '#ffc93c', '🍗'), d: { as: 'saucePuddle' } },
    teriyakiChicken: { s: 'thud', n: 'chicken', h: chunk('#a35a1e'), r: chunk('#f7b9b0') },
    tamago: { s: 'thud', n: 'egg', h: tamagoArt },

    // Thai
    padThaiSauce: { s: 'pour', n: 'pad thai sauce', h: jar('#b5651d', '#e23d2e', '🍜'), d: { as: 'saucePuddle' } },
    lime: { n: 'lime', h: limeArt, d: { as: 'limeWedge' } },
    limeWedge: { h: limeWedge },
    padThai: { n: 'pad thai', h: S(inner(nest('#e9b46a')) + spread(4, 145, 26, shrimpArc) + spread(7, 147, 32, ringlet('#58b84a', '#d9f2c2', 3)) + spread(5, 149, 28, dot(['#ffd24d'], 4.5))) },
    coconut: { s: 'pour', n: 'coconut milk', h: E('🥥'), d: { as: 'coconutFill', at: 'fill' } },
    coconutFill: { h: fill('#fbf6e6', 0.96) },
    coconutDrizzle: { h: drizzle('#fff8e0', 0.98) },
    curryPaste: { s: 'splat', n: 'curry paste', h: jar('#5fae4d', '#ffc93c', '🌶️'), d: { as: 'curryDollop' } },
    curryDollop: { h: dollop('#6fae3d') },
    eggplant: { n: 'eggplant', h: E('🍆') },
    eggplantCoins: { n: 'eggplant', h: S(spread(7, 151, 27, coin('#7b4aa8', '#f1ead0', 10))) },
    basil: { n: 'basil', h: E('🌿') },
    greenCurryFill: { h: fill('#b9cf7a', 0.97, spread(6, 153, 32, dot(['#d6e6a4', '#93ad52'], 4))) },
    greenCurry: { h: fillPic('#b9cf7a', put(chunk('#f3dcae'), 18, 20, 0.3) + put(chunk('#f3dcae'), 52, 48, 0.28) + spread(4, 151, 30, coin('#7b4aa8', '#f1ead0', 8)) + spread(5, 155, 32, sticks(['#f0493a', '#58c463'], 22, 6)) + spread(3, 157, 26, leaf(['#3f9d2a'], 0.8))) },
    mushroomSlices: { n: 'mushrooms', h: S(spread(6, 159, 27, mushBit)) },
    lemongrass: { n: 'lemongrass', h: lemongrassArt },
    tomYumBroth: { h: fill('#e8703a', 0.93, spread(7, 161, 32, dot(['#f59a5e', '#c9481c'], 4))) },
    tomYum: { h: fillPic('#e8703a', spread(4, 163, 28, shrimpArc) + spread(4, 159, 30, mushBit) + spread(4, 7, 30, dice(['#f0493a'], 9)) + spread(3, 165, 24, leaf(['#58b84a'], 0.8))) },
    skewer: { n: 'sticks', h: S(stickOnly, '0 0 200 46'), ar: 0.23 },
    satay: { s: 'thud', n: 'chicken', h: satayArt('#c98a2e', true), r: satayArt('#f7b9b0'), ar: 0.23 },
    peanutSauce: { s: 'splat', n: 'peanut sauce', h: dipArt('#c68a4a') },
    satayPlate: { h: S(put(satayArt('#c98a2e', true), 4, 18, 0.46, 6) + put(satayArt('#c98a2e', true), 2, 42, 0.46, -4) + put(satayArt('#c98a2e', true), 6, 64, 0.46, 4) + put(dipArt('#c68a4a'), 64, 60, 0.34)) },
    mango: { s: 'thud', n: 'mango', h: E('🥭') },
    bananaLeaf: { n: 'leaf', h: leafArt },
    mangoSlices: { n: 'mango', h: mangoSlices },
    stickyRice: { s: 'thud', n: 'sticky rice', h: riceMound },
    mangoRice: { h: S(put(leafArt, 0, 2, 0.98) + put(riceMound, 6, 24, 0.5) + put(mangoSlices, 48, 24, 0.46) + put(drizzle('#fff8e0', 0.98), 13, 31, 0.36)) },

    // Chinese
    roundWrapper: { n: 'wrapper', h: S(`<circle cx="50" cy="50" r="45" fill="#fbf3dc" stroke="#e3d2a4" stroke-width="2.5"/><path d="M26 36 Q34 22 52 22" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>`) },
    dumpling: { s: 'thud', n: 'dumpling', h: dumplingArt('#f3dba8'), r: dumplingArt('#fbf6e6'), ar: 0.76 },
    peas: { n: 'peas', h: S(spread(7, 167, 22, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#6ccb4b" stroke="#3f9d2a" stroke-width="2"/><circle cx="${(x - 3).toFixed(1)}" cy="${(y - 3).toFixed(1)}" r="2.5" fill="#fff" opacity=".6"/>`)) },
    friedRice: { n: 'fried rice', h: blob('#f0d089', spread(26, 169, 34, grain('#fff6da')) + spread(6, 171, 30, dice(['#ff9a3c'], 7)) + spread(7, 173, 32, dot(['#58b84a'], 3.6)) + spread(5, 175, 28, dice(['#ffd84a'], 9))) },
    chowNoodles: { n: 'noodles', h: nest('#e9c877') },
    chowMein: { n: 'chow mein', h: S(inner(nest('#d9a850')) + spread(7, 177, 30, sticks(['#58c463', '#f0493a', '#ffc93c'], 24, 6)) + spread(5, 179, 28, leaf(['#9bd97c', '#b7e59a'], 0.8)) + put(chunk('#f3dcae'), 24, 18, 0.24) + put(chunk('#f3dcae'), 52, 52, 0.24)) },
    crispyChicken: { s: 'thud', n: 'chicken', h: nug('#dc9a3c', '#b87424'), r: nug('#f7c9c0', '#e9a79c') },
    pineappleChunks: { n: 'pineapple', h: S(spread(7, 181, 27, dice(['#ffd94d', '#ffe680'], 14))) },
    ssSauce: { s: 'pour', n: 'sweet and sour sauce', h: jar('#f0622d', '#ffc93c', '🍍'), d: { as: 'ssFill', at: 'fill' } },
    ssFill: { h: fill('#ef6a2e', 0.95) },
    sweetSour: { h: blob('#ef6a2e', spread(5, 183, 26, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#e0a040" stroke="#b87424" stroke-width="2"/>`) + spread(5, 185, 32, dice(['#58c463'], 9)) + spread(4, 187, 30, dice(['#ffd94d'], 10))) },
    chickenBroth: { s: 'pour', n: 'chicken broth', h: box('#f6b93b', '🍗'), d: { as: 'broth', at: 'fill' } },
    cornBits: { n: 'corn', h: S(spread(13, 189, 28, dot(['#ffd24d', '#f5b82e'], 4.4))) },
    eggDrop: { h: fill('#f4c95a', 0.97, `<g fill="none" stroke="#fff3b8" stroke-width="5" stroke-linecap="round"><path d="M22 34 Q34 22 46 34 T70 34"/><path d="M30 58 Q42 46 54 58 T78 58"/><path d="M24 76 Q36 66 48 76"/><path d="M58 22 Q68 16 78 24"/></g>` + spread(8, 189, 34, dot(['#ffd24d'], 3.4)) + spread(8, 131, 34, ringlet('#58b84a', '#d9f2c2', 2.6))) },

    // frozen and sweet treats
    cone: { s: 'thud', n: 'cone', h: coneArt, ar: 1.32 },
    scoopVanilla: { s: 'splat', n: 'vanilla ice cream', h: scoopArt('#fff1cf'), ar: 0.74, sink: 0.3 },
    scoopChoc: { s: 'splat', n: 'chocolate ice cream', h: scoopArt('#8a5a3c'), ar: 0.74, sink: 0.3 },
    scoopBerry: { s: 'splat', n: 'strawberry ice cream', h: scoopArt('#ff9ec0'), ar: 0.74, sink: 0.3 },
    berryLayer: { h: berryLayer, ar: 0.23, sink: 0.06 },
    shakeMixed: { h: shakeMixed, ar: 1.26 },
    milkshake: { h: S(`<path d="M58 6 L48 40" stroke="#e23d2e" stroke-width="6" stroke-linecap="round"/><path d="M28 34 H72 L66 90 Q65 96 59 96 H41 Q35 96 34 90Z" fill="#ffb3cf" stroke="#f07fa8" stroke-width="3" stroke-linejoin="round"/>
      <path d="M36 48 L39 84" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>${put(whipArt, 26, 12, 0.48)}<circle cx="42" cy="12" r="7" fill="#e5352b" stroke="#b3221a" stroke-width="2"/>`) },
    whip: { s: 'squirt', n: 'whipped cream', h: whipArt, ar: 0.64 },
    juice: { s: 'pour', n: 'juice', h: E('🧃') },
    juiceMix: { h: blob(POP, swirl('#ffc2d8')) },
    juiceBowl: { s: 'pour', n: 'juice', h: bowlOf(POP) },
    popFill: { h: popFill(POP, true), r: popFill('#ff9ec0', false), ar: 3.4 },
    popStick: { n: 'sticks', h: popStick, ar: 4 },
    icePop: { s: 'thud', n: 'ice pop', h: icePop(POP), ar: 2 },
    icePops: { h: S(put(icePop(POP), 4, 14, 0.4, -10) + put(icePop('#ffb829'), 32, 8, 0.4) + put(icePop('#7cc7ff'), 60, 14, 0.4, 10)) },
    donut: { s: 'thud', n: 'donut', h: donutArt('#d99a45'), r: donutArt('#f6e6c0') },
    glazePink: { h: glazeAll('#ff8fb3') },
    glazeBlue: { h: glazeAll('#7cc7ff') },
    glazeChoc: { h: glazeAll('#8a5a3c') },
    brownieBatter: { h: blob('#5a341c', swirl('#3b2010')) },
    chocBowl: { s: 'pour', n: 'batter', h: bowlOf('#6b3f22') },
    brownieSlab: { h: slabArt('#4f2d17', true), r: slabArt('#7a4a2a') },
    brownie: { s: 'thud', n: 'brownie', h: brownieSq },
    brownies: { h: S(put(brownieSq, 6, 30, 0.46, -6) + put(brownieSq, 46, 34, 0.46, 8) + put(brownieSq, 26, 4, 0.46, 3)) },
  });

  /* ---------- shared by several of the world kitchens (French, Italian, Indian ...) ---------- */
  {
    const carton = (c, top, ch) => S(`<rect x="26" y="36" width="48" height="58" rx="4" fill="${c}" stroke="${sh(top, -0.3)}" stroke-width="3"/>
      <path d="M24 38 L50 14 L76 38Z" fill="${top}" stroke="${sh(top, -0.3)}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="40" y="6" width="20" height="10" rx="2" fill="${top}" stroke="${sh(top, -0.3)}" stroke-width="2.5"/>${label(ch, 50, 66, 26)}`);
    const tub = (c, lid, ch) => S(`<path d="M22 32 H78 L72 88 Q71 94 65 94 H35 Q29 94 28 88Z" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="16" y="20" width="68" height="15" rx="7" fill="${lid}" stroke="${sh(lid, -0.25)}" stroke-width="3"/>${label(ch, 50, 63, 26)}`);
    const spinachArt = S(`<g fill="none" stroke="#7fb86a" stroke-width="4" stroke-linecap="round"><path d="M50 94 L36 56"/><path d="M50 94 L50 50"/><path d="M50 94 L64 56"/></g>
      <g stroke="#2c6e2a" stroke-width="3" stroke-linejoin="round"><path d="M36 58 Q8 52 12 26 Q22 6 40 16 Q50 30 36 58Z" fill="#3c9a3a"/>
      <path d="M64 58 Q92 52 88 26 Q78 6 60 16 Q50 30 64 58Z" fill="#3c9a3a"/><path d="M50 54 Q30 40 38 16 Q50 2 62 16 Q70 40 50 54Z" fill="#4fae44"/></g>
      <g fill="none" stroke="#7fcf6a" stroke-width="2.5" stroke-linecap="round" opacity=".8"><path d="M36 56 Q24 38 28 22"/><path d="M64 56 Q76 38 72 22"/><path d="M50 52 V18"/></g>`);
    const zucchiniArt = S(`<g transform="rotate(-35 50 50)"><rect x="8" y="36" width="82" height="28" rx="14" fill="#3f8a2e" stroke="#2a5f1e" stroke-width="3"/>
      <path d="M20 44 H74" stroke="#8cc56a" stroke-width="4" stroke-linecap="round" opacity=".7"/><rect x="86" y="44" width="10" height="12" rx="3" fill="#6b8f3a" stroke="#4a6a24" stroke-width="2"/>
      <circle cx="13" cy="50" r="5" fill="#cfe58a" stroke="#6f9a3a" stroke-width="2"/></g>`);
    const hamArt = S(`<path d="M50 8 C76 6 94 26 92 50 C94 76 74 94 50 92 C24 94 6 74 8 50 C6 24 26 8 50 8Z" fill="#fbd3cf" stroke="#d9827d" stroke-width="3"/>
      <path d="M50 18 C70 16 84 32 82 50 C84 70 68 84 50 82 C30 84 16 70 18 50 C16 30 32 18 50 18Z" fill="#f48c8c"/>
      <g fill="#f9c4c0" opacity=".9"><ellipse cx="38" cy="40" rx="9" ry="4" transform="rotate(-20 38 40)"/><ellipse cx="62" cy="60" rx="9" ry="4" transform="rotate(15 62 60)"/></g>`);
    const cilantroArt = S(`<g fill="none" stroke="#5a9e3a" stroke-width="4" stroke-linecap="round"><path d="M50 96 Q48 70 34 40"/><path d="M50 96 Q52 66 66 36"/><path d="M50 96 V30"/></g>
      ${[[30, 36, -30], [38, 22, -60], [22, 50, -10], [50, 22, -90], [58, 10, -80], [42, 10, -110], [70, 32, -150], [64, 46, 170], [78, 20, -130]].map((p, i) => leaf(['#3f9d3a', '#58b84a'], 0.75)(p[0], p[1], p[2], i)).join('')}`);
    const gingerArt = S(`<path d="M14 62 Q10 46 24 44 Q26 30 40 34 Q44 20 58 26 Q70 18 76 32 Q90 34 88 50 Q94 64 80 68 Q70 82 56 74 Q44 84 34 74 Q18 78 14 62Z" fill="#e8c98a" stroke="#b48a4a" stroke-width="3" stroke-linejoin="round"/>
      <g stroke="#c9a362" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M30 56 Q36 52 42 56"/><path d="M54 48 Q60 44 66 48"/><path d="M48 64 Q54 60 60 64"/></g>`);
    Object.assign(V, {
      cream: { s: 'pour', n: 'cream', h: carton('#fdfbf3', '#7cc7ff', '🐄'), d: { as: 'creamPuddle' } },
      creamPuddle: { h: puddle('#fffaf0', 0.97) },
      yogurt: { s: 'splat', n: 'yogurt', h: tub('#f2f7ff', '#5cb8ff', '🥄'), d: { as: 'yogurtDollop' } },
      yogurtDollop: { h: dollop('#fffdf8') },
      spinach: { n: 'spinach', h: spinachArt, d: { as: 'spinachLeaves' } },
      spinachLeaves: { n: 'spinach', h: S(spread(9, 191, 30, leaf(['#3c9a3a', '#4fae44', '#2f8a35'], 1.3))) },
      zucchini: { n: 'zucchini', h: zucchiniArt, d: { as: 'zucchiniCoins' } },
      zucchiniCoins: { n: 'zucchini', h: S(spread(7, 193, 28, coin('#3f8a2e', '#eef5cf', 10))) },
      ham: { s: 'thud', n: 'ham', h: hamArt, d: { as: 'hamBits' } },
      hamBits: { n: 'ham', h: S(spread(9, 195, 28, dice(['#f48c8c', '#f7a5a1'], 11))) },
      hamSide: { h: L(`<path d="M6 10 Q30 2 60 8 T120 8 T194 10 L194 22 Q170 30 140 24 T80 24 T6 22Z" fill="#f48c8c" stroke="#d9727a" stroke-width="3" stroke-linejoin="round"/>`, 30), ar: 0.15, sink: 0.3 },
      cilantro: { n: 'cilantro', h: cilantroArt, d: { as: 'cilantroBits' } },
      cilantroBits: { n: 'cilantro', h: S(spread(12, 197, 30, leaf(['#4fae44', '#3f9d3a'], 0.6))) },
      ginger: { n: 'ginger', h: gingerArt, d: { as: 'gingerBits' } },
      gingerBits: { n: 'ginger', h: S(spread(9, 199, 26, dice(['#f3dba6', '#e8c98a'], 8))) },
    });
  }

  /* ---------- more Japanese, Thai and Chinese: miso soup, omurice, mochi, pineapple fried rice, banana roti,
     coconut ice cream, bao buns, egg tarts, fortune cookies ---------- */
  {
    // Japanese
    const tofuArt = S(`<path d="M16 38 L50 24 L86 36 L52 52Z" fill="#fffef8" stroke="#cfc6b0" stroke-width="3" stroke-linejoin="round"/>
      <path d="M16 38 L52 52 L52 88 L16 72Z" fill="#f3ede0" stroke="#cfc6b0" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 52 L86 36 L86 70 L52 88Z" fill="#e8e0cc" stroke="#cfc6b0" stroke-width="3" stroke-linejoin="round"/>
      <path d="M30 39 L50 31" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`);
    const tofuDice = dice(['#fffdf4', '#f6f0df'], 14);
    const misoTop = spread(8, 215, 34, dot(['#efd3a0', '#c99a54'], 3.4));
    const misoSoup = fillPic('#e2bd7c', misoTop + spread(5, 219, 33, leaf(['#2f5a3b', '#3d6e47'], 0.85)) + spread(6, 261, 24, dice(['#fffdf4', '#f6f0df'], 16)) + spread(7, 131, 35, ringlet('#58b84a', '#d9f2c2', 3)));
    const omuRice = S(`<path d="M5 52 Q7 22 50 16 Q93 22 95 52 Q93 82 50 88 Q7 82 5 52Z" fill="#e4573b" stroke="#b9381f" stroke-width="3"/>${spread(22, 227, 32, grain('#f7a58b'))}`);
    const omuBlanket = S(`<path d="M8 52 Q12 24 50 18 Q88 24 92 52 Q88 80 50 86 Q12 80 8 52Z" fill="#ffd23f" stroke="#e3a20f" stroke-width="3"/>
      <path d="M22 44 Q34 28 58 27" stroke="#fff3b0" stroke-width="6" stroke-linecap="round" fill="none" opacity=".85"/>
      <path d="M24 66 Q50 78 76 66" stroke="#f0b21c" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>`);
    const ketchupHeart = S(`<path d="M50 88 C30 72 8 58 10 35 C12 18 31 12 42 22 Q48 27 50 33 Q52 27 58 22 C69 12 88 18 90 35 C92 58 70 72 50 88Z" fill="#e23d2e" stroke="#b92a1d" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 36 Q26 25 37 26" stroke="#ff9a8c" stroke-width="5" stroke-linecap="round" fill="none"/>`);
    const eggPool = S(`<path d="M50 6 C74 4 96 24 94 50 C96 76 74 96 50 94 C26 96 4 76 6 50 C4 24 26 4 50 6Z" fill="#ffd84a" opacity=".72" stroke="#f0b21c" stroke-width="2"/>
      <path d="M26 38 Q34 22 52 20" stroke="#fff6c2" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>`);
    const mochiBall = (c) => S(`<ellipse cx="50" cy="56" rx="43" ry="38" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="3"/>
      <ellipse cx="50" cy="51" rx="35" ry="28" fill="${sh(c, 0.3)}" opacity=".65"/>
      <path d="M27 42 Q35 29 53 29" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".8"/>${spread(7, 231, 25, dot(['#ffffff'], 2))}`);
    const mochiW = mochiBall('#fbf7ef'), mochiP = mochiBall('#ffb0c8'), mochiG = mochiBall('#9fd468'), mochiY = mochiBall('#ffe07a');

    // Thai
    const cashewAt = (x, y, rot, k) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${k})"><path d="M-11 1 C-12 -8 -4 -12 4 -10 C11 -8 13 0 10 6 C8 10 3 11 1 7 C0 4 -2 3 -5 5 C-8 7 -10 5 -11 1Z" fill="#f3dba8" stroke="#c99a52" stroke-width="2.2" stroke-linejoin="round"/><path d="M-7 -3 Q-4 -8 3 -8" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".7"/></g>`;
    const pineRice = blob('#f2c14e', spread(26, 237, 34, grain('#fff3c4')) + spread(5, 239, 28, dice(['#ffe680'], 11)) + spread(5, 241, 30, dot(['#5cbf45'], 3.8))
      + spread(3, 243, 24, shrimpArc) + spread(4, 245, 30, (x, y, rot) => cashewAt(x, y, rot, 0.62)));
    const canArt = (c, ch) => S(`<rect x="22" y="18" width="56" height="74" rx="8" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="3"/>
      <ellipse cx="50" cy="19" rx="28" ry="7" fill="#d5dbe2" stroke="#8792a0" stroke-width="3"/>
      <path d="M23 32 H77 M23 80 H77" stroke="${sh(c, -0.18)}" stroke-width="3"/>${label(ch, 50, 56, 28)}`);
    // thin drizzled lines going back and forth across the roti
    const zig = (c, w, deg) => S(`<g transform="rotate(${deg} 50 50)" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round">${[0, 1, 2, 3, 4].map(i => `<path d="M${18 + (i % 2) * 4} ${22 + i * 14} Q34 ${16 + i * 14} 50 ${22 + i * 14} T${82 - (i % 2) * 4} ${22 + i * 14}"/>`).join('')}</g>`);
    const milkDrizzle = zig('#fffaf0', 4.4, -30), chocDrizzle = zig('#5a341c', 3.8, 30);
    const rotiDisc = (c, line) => S(`<circle cx="50" cy="50" r="46" fill="${c}" stroke="${sh(c, -0.16)}" stroke-width="2.5"/>
      <g fill="none" stroke="${line}" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M24 34 Q40 26 58 30"/><path d="M22 58 Q44 50 76 56"/><path d="M36 76 Q52 70 70 74"/></g>`);
    const rotiFold = S(`<rect x="12" y="12" width="76" height="76" rx="10" fill="#f6ead0" stroke="#d9c59a" stroke-width="3" transform="rotate(4 50 50)"/>
      <g fill="none" stroke="#dcc79a" stroke-width="3" stroke-linecap="round" transform="rotate(4 50 50)"><path d="M14 50 Q32 45 50 50 Q68 55 86 50"/><path d="M50 14 Q45 32 50 50 Q55 68 50 86"/></g>
      ${spread(6, 247, 28, (x, y, r, i) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${4 + i % 3}" ry="3" fill="#fff8e6" opacity=".8"/>`)}`);
    const rotiCut = S(`<g transform="rotate(4 50 50)">${[0, 1, 2].map(i => [0, 1, 2].map(j => `<rect x="${12 + i * 26}" y="${12 + j * 26}" width="24" height="24" rx="4" fill="#e9b25a" stroke="#b97a2a" stroke-width="2.5"/>
      <ellipse cx="${20 + i * 26 + (j % 2) * 6}" cy="${21 + j * 26}" rx="4" ry="2.6" fill="#c98a3a" opacity=".55"/>`).join('')).join('')}</g>`);
    const shellCut = '#e9dabb';
    const coconutTop = S(`<circle cx="50" cy="50" r="44" fill="#fffbf2" stroke="#c9bd9c" stroke-width="3"/>
      <path d="M18 56 Q28 66 42 61 Q55 73 69 63 Q79 61 84 50" fill="none" stroke="#e6dcc2" stroke-width="4" stroke-linecap="round"/>
      <path d="M27 37 Q35 22 54 20" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/>`);
    const fibers = (cx, cy, r1, r2, n) => Array.from({ length: n }, (_, i) => { const a = i * 6.2832 / n + 0.1; return `<path d="M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)} L${(cx + Math.cos(a + 0.08) * r2).toFixed(1)} ${(cy + Math.sin(a + 0.08) * r2).toFixed(1)}"/>`; }).join('');
    const ringDots = (cx, cy, rx, ry, n, rad) => Array.from({ length: n }, (_, i) => { const a = i * 6.2832 / n; return `<circle cx="${(cx + Math.cos(a) * rx).toFixed(1)}" cy="${(cy + Math.sin(a) * ry).toFixed(1)}" r="${rad}"/>`; }).join('');
    const coconutHalf = (inside) => S(`<circle cx="50" cy="52" r="47" fill="#7a4a28" stroke="#4f2e17" stroke-width="2.5"/><g stroke="#a06a3c" stroke-width="1.6" stroke-linecap="round">${fibers(50, 52, 42, 46, 26)}</g>
      <circle cx="50" cy="52" r="39" fill="#fffaf0" stroke="#e0d2b0" stroke-width="1.5"/><circle cx="50" cy="52" r="34" fill="${shellCut}"/>${inside}`);
    const mangoCubes = S(spread(7, 253, 26, dice(['#ffb829', '#ffc94d'], 13)));

    // Chinese
    const baoArt = (c, r, line) => S(`<ellipse cx="52" cy="58" rx="${r}" ry="${r * 0.92}" fill="#000" opacity=".1"/><circle cx="50" cy="52" r="${r}" fill="${c}" stroke="${line}" stroke-width="3"/>
      <g fill="none" stroke="${line}" stroke-width="2.6" stroke-linecap="round" opacity=".75">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * 0.785; return `<path d="M50 50 Q${(50 + Math.cos(a + 0.45) * r * 0.42).toFixed(1)} ${(50 + Math.sin(a + 0.45) * r * 0.42).toFixed(1)} ${(50 + Math.cos(a) * r * 0.7).toFixed(1)} ${(50 + Math.sin(a) * r * 0.7).toFixed(1)}"/>`; }).join('')}</g>
      <circle cx="50" cy="50" r="4.5" fill="${line}" opacity=".7"/><path d="M${50 - r * 0.56} ${50 - r * 0.16} Q${50 - r * 0.42} ${50 - r * 0.56} ${50 - r * 0.06} ${50 - r * 0.66}" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".9"/>`);
    const bao = baoArt('#fffdf7', 45, '#d3c7a8');
    const tartShell = (c) => {
      let sc = '';
      for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7; sc += `<circle cx="${(50 + Math.cos(a) * 40).toFixed(1)}" cy="${(50 + Math.sin(a) * 40).toFixed(1)}" r="8" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2"/>`; }
      return S(`${sc}<circle cx="50" cy="50" r="40" fill="${c}"/><circle cx="50" cy="50" r="32" fill="${sh(c, -0.12)}"/>`);
    };
    const custardTop = S(`<circle cx="50" cy="50" r="46" fill="#ffd23f" stroke="#e3a20f" stroke-width="2.5"/>
      ${spread(6, 255, 28, (x, y, r, i) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${7 + i % 3}" ry="${5 + i % 2}" fill="#c9741c" opacity=".5"/>`)}
      <path d="M24 38 Q32 22 52 20" stroke="#fff6c2" stroke-width="6" stroke-linecap="round" fill="none" opacity=".9"/>`);
    const eggTart = S(inner(tartShell('#e6a94f')) + put(custardTop, 18, 18, 0.64));
    const fortuneFold = S(`<path d="M6 64 Q8 20 50 16 Q92 20 94 64 Q86 74 74 68 Q62 56 50 56 Q38 56 26 68 Q14 74 6 64Z" fill="#e6a94f" stroke="#b5772a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M26 68 Q38 56 50 56 Q62 56 74 68 Q64 82 50 84 Q36 82 26 68Z" fill="#c9852f" stroke="#b5772a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M50 20 Q45 38 50 56" stroke="#b5772a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g transform="rotate(16 64 74)"><rect x="54" y="68" width="34" height="11" rx="1.5" fill="#fff" stroke="#cfc8b8" stroke-width="1.5"/><path d="M59 73.5 H82" stroke="#e23d2e" stroke-width="2.2" stroke-linecap="round"/></g>
      <path d="M18 46 Q24 32 40 28 M60 28 Q76 32 82 44" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".45"/>`);

    Object.assign(V, {
      // Japanese
      tofu: { s: 'thud', n: 'tofu', h: tofuArt },
      tofuCubes: { n: 'tofu', h: S(spread(8, 211, 28, tofuDice)) },
      miso: { s: 'splat', n: 'miso', h: jar('#d9a052', '#8a5a2b', '🫘'), d: { as: 'misoDollop' } },
      misoDollop: { h: dollop('#c98a3c') },
      wakame: { n: 'seaweed', h: S(spread(7, 213, 28, leaf(['#2f5a3b', '#3d6e47', '#24472e'], 1.1))) },
      misoSoup: { h: misoSoup },
      ketchupRice: { n: 'rice', h: blob('#e4573b', spread(26, 221, 34, grain('#f7a58b')) + spread(6, 223, 30, dot(['#6ccb4b'], 4)) + spread(5, 225, 28, dice(['#f3dcae'], 9))) },
      omuEgg: { s: 'thud', n: 'egg', h: disc('#ffd23f', '#ffe486', 34), r: eggPool },
      omuRice: { h: omuRice },
      omuBlanket: { h: omuBlanket },
      ketchupHeart: { h: ketchupHeart },
      omurice: { h: S(inner(omuRice) + put(omuBlanket, 6, 7, 0.88) + put(ketchupHeart, 29, 28, 0.42)) },
      riceFlour: { s: 'poof', n: 'rice flour', h: sack('#f7f3ea', '🍙'), d: { as: 'flourPile' } },
      mochiDough: { h: blob('#fffefa', swirl('#ece4d3') + '<path d="M60 24 Q74 28 80 42" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>'), r: blob('#eee7d8', swirl('#d9cfba') + spread(8, 229, 28, dot(['#fbf8f1'], 2.6))) },
      mochiWhite: { s: 'thud', h: mochiW },
      mochiPink: { s: 'thud', n: 'pink', h: mochiP },
      mochiGreen: { s: 'thud', n: 'green', h: mochiG },
      mochiYellow: { s: 'thud', n: 'yellow', h: mochiY },
      mochiPlate: { h: S(put(mochiG, 25, 2, 0.52) + put(mochiP, 2, 40, 0.52) + put(mochiW, 46, 42, 0.52)) },

      // Thai
      cashews: { s: 'shake', n: 'cashews', h: S(spread(5, 233, 22, (x, y, rot) => cashewAt(x, y, rot, 1.9))), d: { as: 'cashewBits' } },
      cashewBits: { n: 'cashews', h: S(spread(8, 235, 28, (x, y, rot) => cashewAt(x, y, rot, 1))) },
      pineappleRice: { s: 'thud', n: 'fried rice', h: pineRice },
      pineappleBoatDish: { h: S(`<g fill="#3f9d3a" stroke="#2c7a28" stroke-width="2" stroke-linejoin="round"><path d="M50 30 L36 2 L46 26Z"/><path d="M50 30 L64 2 L54 26Z"/><path d="M50 30 L50 0 L56 24 L44 24Z"/><path d="M48 32 L24 10 L42 32Z"/><path d="M52 32 L76 10 L58 32Z"/></g>
        <ellipse cx="50" cy="62" rx="42" ry="36" fill="#c98a2e" stroke="#8f5a16" stroke-width="2.5"/><g fill="#a26a1c">${ringDots(50, 62, 38.5, 32.5, 22, 1.8)}</g>
        <ellipse cx="50" cy="62" rx="35" ry="29" fill="#ffe066" stroke="#e6b422" stroke-width="2"/>${put(pineRice, 19, 36, 0.62)}`) },
      sweetMilk: { s: 'squirt', n: 'sweet milk', h: canArt('#5cb8ff', '🥛'), d: { as: 'sweetMilkDrizzle' } },
      sweetMilkDrizzle: { h: milkDrizzle },
      chocSauce: { s: 'squirt', n: 'chocolate sauce', h: bottle('#5a341c', '#e23d2e', '🍫'), d: { as: 'chocDrizzle' } },
      chocDrizzle: { h: chocDrizzle },
      rotiDisc: { n: 'dough', h: rotiDisc('#e9b25a', '#c98a3a'), r: rotiDisc('#f6ead0', '#e6d4ac') },
      rotiSquare: { s: 'thud', h: rotiCut, r: rotiFold },
      rotiPlate: { h: S(inner(rotiCut) + inner(milkDrizzle) + inner(chocDrizzle)) },
      coconutMix: { h: blob('#fbf6e6', swirl('#e6dcc2')) },
      coconutFrozen: { h: blob('#fffdf6', `<g fill="none" stroke="#e3dac4" stroke-width="4" stroke-linecap="round"><path d="M24 40 Q40 30 56 40"/><path d="M40 62 Q56 52 72 62"/><path d="M24 66 Q32 60 40 66"/></g>` + spread(9, 251, 30, dot(['#bfe3ff', '#ffffff'], 2.6))) },
      coconutScoop: { s: 'splat', n: 'coconut ice cream', h: scoopArt('#fffaf0'), d: { as: 'coconutScoopTop' } },
      coconutScoopTop: { h: coconutTop },
      mangoCubes: { n: 'mango', h: mangoCubes },
      coconutIceCream: { h: coconutHalf(put(coconutTop, 22, 22, 0.36) + put(coconutTop, 44, 26, 0.36) + put(coconutTop, 32, 44, 0.36) + put(S(spread(8, 143, 30, dot(['#d9a85a', '#b98238'], 3.6))), 22, 24, 0.56) + put(mangoCubes, 26, 30, 0.5)) },

      // Chinese
      baoBun: { s: 'thud', n: 'bun', h: bao, r: baoArt('#f2ecdd', 40, '#d6cbb0'), ar: 1 },
      baoPlate: { h: S(put(bao, 25, 2, 0.52) + put(bao, 2, 42, 0.52) + put(bao, 46, 44, 0.52)) },
      custardMix: { h: blob('#ffe08a', swirl('#f2c94c')) },
      custardBowl: { s: 'pour', n: 'custard', h: bowlOf('#ffe08a') },
      tartShell: { s: 'thud', h: tartShell('#e6a94f'), r: tartShell('#f6e6c0') },
      tartCustard: { h: custardTop, r: S(`<circle cx="50" cy="50" r="46" fill="#ffe9a0" stroke="#f3cf68" stroke-width="2.5"/><path d="M24 38 Q32 22 52 20" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".8"/>`) },
      eggTarts: { h: S(put(eggTart, 25, 2, 0.52) + put(eggTart, 2, 42, 0.52) + put(eggTart, 46, 44, 0.52)) },
      fortuneDisc: { s: 'splat', n: 'cookie', h: disc('#e3a94e', '#ecbd6c', 36), r: disc('#f6e7c4', '#fbf0d8', 36) },
      fortunePaper: { s: 'pop', n: 'fortune', h: S(`<g transform="rotate(-14 50 50)"><rect x="6" y="36" width="88" height="28" rx="3" fill="#fff" stroke="#cfc8b8" stroke-width="2.5"/><g stroke="#e23d2e" stroke-width="3.4" stroke-linecap="round"><path d="M16 46 H72"/><path d="M16 55 H56"/></g></g>`) },
      fortuneCookie: { s: 'thud', h: fortuneFold },
    });
  }

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

  // the kitchen sink, seen from above (washing hands before cooking)
  VESSEL.sink = {
    art: A(`<rect x="14" y="74" width="272" height="214" rx="40" fill="#000" opacity=".12"/>
      <rect x="14" y="64" width="272" height="214" rx="40" fill="#dfe7ee" stroke="#a9b6c3" stroke-width="4"/>
      <rect x="38" y="90" width="224" height="166" rx="30" fill="#f6fbfe" stroke="#c3ced9" stroke-width="3"/>
      <circle cx="150" cy="232" r="10" fill="#9aa7b5"/>
      <circle cx="92" cy="50" r="17" fill="#5cb8ff" stroke="#3b8fd0" stroke-width="4"/><circle cx="208" cy="50" r="17" fill="#ff7a6e" stroke="#d6483d" stroke-width="4"/>
      <rect x="136" y="20" width="28" height="92" rx="14" fill="#c3ccd6" stroke="#8792a0" stroke-width="4"/>
      <path d="M144 32 V96" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`),
    box: [21, 36, 58], round: false,
  };

  // a bamboo steamer on the stove, seen from above (dumplings)
  VESSEL.steamer = {
    art: A(`${burner(150, 148, 128)}<circle cx="150" cy="148" r="130" fill="#c98f47" stroke="#8f6126" stroke-width="4"/><circle cx="150" cy="148" r="112" fill="#f3dfae" stroke="#b9853a" stroke-width="3"/>
      <g stroke="#dcc083" stroke-width="5" stroke-linecap="round">${[-80, -48, -16, 16, 48, 80].map(d => { const h = Math.sqrt(112 * 112 - d * d) - 6; return `<path d="M${(150 - h).toFixed(0)} ${148 + d} H${(150 + h).toFixed(0)}"/>`; }).join('')}</g>
      <path d="M46 96 Q72 42 132 26" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".4"/>`),
    box: [15.4, 14.7, 69.2], round: true, stove: true,
  };
  // a lunch box with three parts, seen from above (bento)
  VESSEL.bento = {
    art: A(`<rect x="10" y="34" width="280" height="250" rx="30" fill="#000" opacity=".12"/><rect x="10" y="24" width="280" height="250" rx="30" fill="#c0392b" stroke="#8f2318" stroke-width="4"/>
      <g fill="#2b2320" stroke="#8f2318" stroke-width="3"><rect x="26" y="40" width="130" height="218" rx="18"/><rect x="166" y="40" width="108" height="104" rx="18"/><rect x="166" y="154" width="108" height="104" rx="18"/></g>
      <path d="M30 60 Q52 40 90 34" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".25"/>`),
    box: [0, 0, 100], round: false,
  };
  // a little stand that holds an ice cream cone, seen from the side; `front` is drawn over the cone
  VESSEL.stand = {
    art: A(`<ellipse cx="150" cy="284" rx="92" ry="10" fill="#000" opacity=".12"/><path d="M92 276 H208 Q214 276 214 270 Q214 262 204 262 H96 Q86 262 86 270 Q86 276 92 276Z" fill="#7cc7ff" stroke="#3b8fd0" stroke-width="4"/>
      <rect x="120" y="222" width="60" height="44" rx="8" fill="#5cb8ff" stroke="#3b8fd0" stroke-width="4"/>`),
    front: A(`<path d="M112 214 H188 L180 246 Q179 252 172 252 H128 Q121 252 120 246Z" fill="#7cc7ff" stroke="#3b8fd0" stroke-width="4" stroke-linejoin="round"/>
      <path d="M124 224 L128 242" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`),
    box: [10, 7, 80], round: false, side: true,
  };
  // a tray of four ice pop moulds, seen from above
  VESSEL.molds = {
    art: A(`<rect x="14" y="48" width="272" height="226" rx="28" fill="#000" opacity=".12"/><rect x="14" y="38" width="272" height="226" rx="28" fill="#8fd0f7" stroke="#3b8fd0" stroke-width="4"/>
      ${[60, 120, 180, 240].map(x => `<rect x="${x - 25}" y="70" width="50" height="160" rx="20" fill="#3b8fd0"/><rect x="${x - 21}" y="74" width="42" height="152" rx="17" fill="#e6f5ff" stroke="#bfe1fb" stroke-width="2"/>`).join('')}
      <path d="M30 62 Q60 46 110 44" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".6"/>`),
    box: [0, 0, 100], round: false,
    slots: [[20, 50], [40, 50], [60, 50], [80, 50]],
  };
  // a deep baking dish with handles, seen from above (lasagna)
  VESSEL.dish = {
    art: A(`<rect x="18" y="34" width="264" height="252" rx="36" fill="#000" opacity=".12"/>
      <rect x="0" y="112" width="40" height="76" rx="16" fill="#e8743f" stroke="#b4532a" stroke-width="4"/><rect x="260" y="112" width="40" height="76" rx="16" fill="#e8743f" stroke="#b4532a" stroke-width="4"/>
      <rect x="18" y="24" width="264" height="252" rx="36" fill="#e8743f" stroke="#b4532a" stroke-width="4"/>
      <rect x="36" y="42" width="228" height="216" rx="22" fill="#fdf1e2" stroke="#e7cdb0" stroke-width="3"/>
      <path d="M40 76 Q62 52 108 46" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`),
    box: [13, 14, 74], round: false,
  };
  {
    // a pineapple cut in half and hollowed out, seen from above (pineapple fried rice)
    const leafy = (d) => `<path d="${d}" fill="#3f9d3a" stroke="#2c7a28" stroke-width="4" stroke-linejoin="round"/>`;
    const dia = [];
    for (let i = 0; i < 30; i++) { const a = i * 6.2832 / 30; dia.push(`<path transform="translate(${(150 + Math.cos(a) * 118).toFixed(1)} ${(186 + Math.sin(a) * 104).toFixed(1)}) rotate(${(a * 57.3 + 90).toFixed(0)})" d="M0 -7 L6 0 L0 7 L-6 0Z"/>`); }
    VESSEL.pineappleBoat = {
      art: A(`<ellipse cx="150" cy="196" rx="134" ry="112" fill="#000" opacity=".12"/>
        ${leafy('M150 80 L112 4 L138 72Z')}${leafy('M150 80 L188 4 L162 72Z')}${leafy('M150 82 L150 -6 L166 66 L134 66Z')}${leafy('M146 86 L72 30 L126 86Z')}${leafy('M154 86 L228 30 L174 86Z')}
        <ellipse cx="150" cy="186" rx="134" ry="118" fill="#c98a2e" stroke="#8f5a16" stroke-width="4"/>
        <g fill="#a26a1c" stroke="#8f5a16" stroke-width="1.5">${dia.join('')}</g>
        <ellipse cx="150" cy="186" rx="106" ry="92" fill="#ffe066" stroke="#e6b422" stroke-width="4"/>
        <ellipse cx="150" cy="190" rx="92" ry="78" fill="#fff1a8"/>
        <path d="M70 160 Q88 118 136 106" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`),
      box: [23, 36, 54], round: true,
    };
    // half a coconut shell used as a bowl (coconut ice cream)
    const fib = [];
    for (let i = 0; i < 40; i++) { const a = i * 6.2832 / 40 + 0.05; fib.push(`<path d="M${(150 + Math.cos(a) * 124).toFixed(1)} ${(150 + Math.sin(a) * 124).toFixed(1)} L${(150 + Math.cos(a + 0.06) * 138).toFixed(1)} ${(150 + Math.sin(a + 0.06) * 138).toFixed(1)}"/>`); }
    VESSEL.coconutShell = {
      art: A(`<circle cx="150" cy="158" r="142" fill="#000" opacity=".12"/><circle cx="150" cy="150" r="142" fill="#7a4a28" stroke="#4f2e17" stroke-width="4"/>
        <g stroke="#a06a3c" stroke-width="3.5" stroke-linecap="round">${fib.join('')}</g>
        <circle cx="150" cy="150" r="118" fill="#fffaf0" stroke="#e0d2b0" stroke-width="3"/><circle cx="150" cy="150" r="104" fill="#e9dabb"/>
        <path d="M58 104 Q82 58 134 44" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`),
      box: [15, 15, 70], round: true,
    };
    // a tin of six fluted tart cups (egg tarts)
    const flute = (x, y) => Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return `<circle cx="${(x + Math.cos(a) * 34).toFixed(1)}" cy="${(y + Math.sin(a) * 34).toFixed(1)}" r="6.5"/>`; }).join('');
    VESSEL.tartTin = {
      art: A(`<rect x="8" y="52" width="284" height="214" rx="26" fill="#000" opacity=".12"/><rect x="8" y="42" width="284" height="214" rx="26" fill="#aab3bd" stroke="#7d8793" stroke-width="4"/>
        ${[102, 196].map(y => [62, 150, 238].map(x => `<circle cx="${x}" cy="${y}" r="41" fill="#7d8793"/><g fill="#c3ccd6" stroke="#8792a0" stroke-width="2">${flute(x, y)}</g><circle cx="${x}" cy="${y}" r="33" fill="#c3ccd6"/><circle cx="${x}" cy="${y}" r="26" fill="#dfe5ec"/>`).join('')).join('')}
        <path d="M28 66 Q58 50 104 48" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".45"/>`),
      box: [0, 0, 100], round: false,
      slots: [[20.7, 34], [50, 34], [79.3, 34], [20.7, 65.3], [50, 65.3], [79.3, 65.3]],
    };
  }

  // the freezer: built like the oven (same door, glow and lamp) so the bake step can use either
  const FREEZER = `<svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <rect x="22" y="196" width="26" height="16" rx="5" fill="#8fb4cc"/><rect x="252" y="196" width="26" height="16" rx="5" fill="#8fb4cc"/>
    <rect x="8" y="6" width="284" height="198" rx="22" fill="#e6f5ff" stroke="#9fd0ee" stroke-width="4"/>
    <rect x="22" y="16" width="256" height="30" rx="12" fill="#bfe1fb"/>
    <text x="50" y="32" dy=".36em" font-size="20" text-anchor="middle">❄️</text><rect x="118" y="22" width="64" height="18" rx="6" fill="#3b6f96"/><circle class="lamp" cx="204" cy="31" r="5" fill="#5b6b7a"/>
    <rect x="30" y="56" width="240" height="140" rx="14" fill="#1d3b5c"/>
    <rect class="glow" x="30" y="56" width="240" height="140" rx="14" fill="#9fdcff"/>
    <g stroke="#6c8fb0" stroke-width="3" stroke-linecap="round"><path d="M40 128 H260"/><path d="M40 164 H260"/></g>
    <g class="door">
      <rect x="24" y="52" width="252" height="146" rx="16" fill="#f4fbff" stroke="#9fd0ee" stroke-width="4"/>
      <rect x="110" y="96" width="80" height="64" rx="12" fill="#1d3b5c" opacity=".8"/><rect class="glow win" x="110" y="96" width="80" height="64" rx="12" fill="#bfe9ff"/>
      <text x="150" y="128" dy=".36em" font-size="40" text-anchor="middle">❄️</text>
      <rect x="64" y="60" width="172" height="12" rx="6" fill="#fff" stroke="#bfd6e6" stroke-width="2"/>
    </g></svg>`;

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

  window.ART = { V, VESSEL, OVEN, FREEZER, chef, E, S, ICON };
})();
