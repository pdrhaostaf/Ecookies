// Desenho do mini cookie: muda conforme a massa e o recheio escolhidos.
const COOKIE_ART = {
  doughs: {
    classica: { base:"#c99a62", edge:"#8f6a3e", hi:"#f0d3a2", spr:"#fffaf0", seed:false, label:"Flor de sal" },
    cacau:    { base:"#6e4330", edge:"#3f2318", hi:"#a06d52", spr:"#e9d2b0", seed:false, label:"Raspas de cacau" },
    maracuja: { base:"#e7b64a", edge:"#a77a1e", hi:"#fbe29a", spr:"#3b2a14", seed:true,  label:"Sementes de maracujá" }
  },
  fillings: {
    brigadeiro:   { fill:"#5a3220", top:"#4b2a1c", bits:null,      label:"Riscas de chocolate" },
    ninho:        { fill:"#f6ead2", top:"#fff6e6", bits:null,      label:"Riscas de leite Ninho" },
    "doce-leite": { fill:"#b9732f", top:"#a8631f", bits:null,      label:"Riscas de doce de leite" },
    nutella:      { fill:"#6b3a22", top:"#3a1f14", bits:"#d9b27c", label:"Riscas de Nutella" },
    kinder:       { fill:"#ead7b5", top:"#fff6e6", bits:"#5a3220", label:"Riscas de Kinder Bueno" }
  }
};
function cookieArt(dough, filling) {
  const D = COOKIE_ART.doughs[dough] || COOKIE_ART.doughs.classica;
  const F = COOKIE_ART.fillings[filling] || COOKIE_ART.fillings.brigadeiro;
  const spr = [[130,170,20],[175,128,-25],[222,118,15],[262,140,40],[300,120,-10],[340,148,25],[360,182,10],[200,160,-35]]
    .map(([x,y,r]) => D.seed
      ? `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="5" fill="${D.spr}" transform="rotate(${r} ${x} ${y})"/>`
      : `<rect x="${x}" y="${y}" width="7" height="7" rx="1.2" fill="${D.spr}" transform="rotate(${r} ${x} ${y})"/>`).join("");
  const drizzle = [0,26,52].map(o => `<path d="M60 ${128+o} C130 ${100+o} 180 ${150+o} 250 ${120+o} S370 ${112+o} 420 ${140+o}" fill="none" stroke="${F.top}" stroke-width="8" stroke-linecap="round"/>`).join("");
  const bits = F.bits ? [[190,188],[225,172],[262,192],[205,208],[285,206],[240,200]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${F.bits}"/>`).join("") : "";
  return `<svg class="cookie-art" viewBox="0 0 480 270" role="img" aria-label="Desenho do mini cookie com a combinação escolhida">
    <defs><clipPath id="cd"><path d="M70 215 C70 130 150 90 240 90 C330 90 410 130 410 215 Q240 232 70 215Z"/></clipPath>
    <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8b5b43"/></marker></defs>
    <ellipse cx="240" cy="244" rx="200" ry="14" fill="rgba(75,41,28,.12)"/>
    <ellipse cx="240" cy="232" rx="195" ry="17" fill="#fffdf9" stroke="#ead9c4"/>
    <path d="M70 215 C70 130 150 90 240 90 C330 90 410 130 410 215 Q240 232 70 215Z" fill="${D.base}" stroke="${D.edge}" stroke-width="2"/>
    <g clip-path="url(#cd)"><path d="M92 165 C100 125 150 102 190 98" fill="none" stroke="${D.hi}" stroke-width="9" stroke-linecap="round" opacity=".45"/>${drizzle}${spr}</g>
    <path d="M150 220 C150 172 190 150 230 150 C272 150 310 172 310 222 Q230 232 150 220Z" fill="${F.fill}" stroke="${D.edge}" stroke-width="2"/>${bits}
    <path d="M168 206 C168 182 190 167 215 164" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>
    <text x="8" y="94">${D.label}</text><path d="M40 102 L122 138" stroke="#8b5b43" stroke-width="1.5" fill="none" marker-end="url(#ah)"/>
    <text x="472" y="58" text-anchor="end">${F.label}</text><path d="M400 66 L340 112" stroke="#8b5b43" stroke-width="1.5" fill="none" marker-end="url(#ah)"/>
  </svg>`;
}
