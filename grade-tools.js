(() => {
  const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const rgb2hsl = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s * 100, l * 100]; };
  const hsl2hex = (h, s, l) => { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))); return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join(''); };
  const theme = hex => { const [h, s] = rgb2hsl(hex2rgb(hex)), sat = s < 12 ? s : Math.max(55, s); return { a: hsl2hex(h, sat, 62), b: hsl2hex(h + 48, sat, 62) }; };
  const glow = hex => { const [r, g, b] = hex2rgb(hex); return `rgba(${r},${g},${b},.35)`; };
  const hist = (data, bins = 64) => { const R = new Array(bins).fill(0), G = R.slice(), B = R.slice(); for (let i = 0; i < data.length; i += 4) { R[data[i] * bins >> 8]++; G[data[i + 1] * bins >> 8]++; B[data[i + 2] * bins >> 8]++; } const mx = Math.max(1, ...R, ...G, ...B); return [R, G, B].map(a => a.map(v => v / mx)); };
  const PAL = ['#5b8def', '#14b8a6', '#cbd5e1', '#60a5fa', '#d6a35c', '#fbbf24', '#4ade80', '#818cf8'];
  window.MVT = { hex2rgb, rgb2hsl, hsl2hex, theme, glow, hist, PAL };
})();
