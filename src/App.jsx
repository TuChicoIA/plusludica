import { useEffect, useState } from 'react'
import Grainient from './components/Grainient'
import {
  NAV, HERO, DOLOR_PHRASES, DOLORES, PASOS, MONTAMOS, CASOS, DEMO, FAQS, CTA, FOOTER, whatsappUrl,
} from './content'

/* ---------- utilidades ---------- */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

const ICONS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  repeat: <><path d="M20 12a8 8 0 01-14 5.3" /><path d="M4 12a8 8 0 0114-5.3" /><path d="M18 3v4h-4M6 21v-4h4" /></>,
  browser: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></>,
  pin: <><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  chat: <path d="M4 5h16v11H10l-6 4z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0" /><path d="M16 11a3 3 0 100-6M21 20a6 6 0 00-4-5.6" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  bell: <><path d="M6 17V11a6 6 0 0112 0v6l2 2H4z" /><path d="M10 21h4" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
}

function Icon({ name, size = 20, color = 'currentColor', stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

function GrainOverlay({ id }) {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  )
}

/* ---------- fondo continuo ---------- */
function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <Grainient
        colors={['#fcfbf8', '#ffe2d3', '#ffc9dd', '#d9cff8', '#ffb89a']}
        angle={55}
        flow={0.9}
        silk={0.25}
        speed={0.6}
        grainAmount={0.06}
        clickSwirl={false}
        dpr={1.5}
      />
    </div>
  )
}

/* ---------- cabecera ---------- */
function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Lúdica Plus, inicio">
      <span className="dot" />
      <span className="name">Lúdica <em>Plus</em></span>
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <div className="header-in">
        <Logo />
        <nav className="nav" aria-label="Principal">
          {NAV.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="btn btn-green" href={whatsappUrl}>Demo gratuita</a>
          <button className="burger" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name={open ? 'close' : 'menu'} stroke={2.2} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Principal">
          {NAV.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
        </nav>
      )}
    </header>
  )
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <div className="pill"><span className="dot" />{HERO.pill}</div>
          <h1>{HERO.title[0]}<em>{HERO.title[1]}</em></h1>
          <p className="sub">{HERO.sub[0]} <br />{HERO.sub[1]}</p>
          <a className="btn btn-green btn-lg" href={whatsappUrl}>
            <Icon name="chat" />{HERO.cta}
          </a>
          <div className="checks">
            {HERO.checks.map((c) => <span key={c}><Icon name="check" size={14} color="#01624e" stroke={3} />{c}</span>)}
          </div>
        </div>
        <div className="hero-art">
          <div className="phone">
            <div className="phone-screen">
              <div className="chat-head">
                <span className="avatar">TC</span>
                <div className="t"><b>[Tu centro]</b><span>Asistente · en línea</span></div>
              </div>
              <div className="chat-body">
                <div className="msg in">Hola, ¿tenéis plaza el jueves por la tarde?</div>
                <div className="msg out">¡Hola! Sí. Tengo hueco a las 17:00 y a las 18:30. ¿Cuál te va mejor?</div>
                <div className="msg in" style={{ maxWidth: '60%' }}>A las 17:00</div>
                <div className="msg out">Reservado. Te enviaremos un recordatorio antes de la cita.</div>
              </div>
              <div className="chat-input"><div className="f">Escribe un mensaje</div><span className="b" /></div>
            </div>
          </div>
          <div className="chip a">
            <span className="ic" style={{ background: '#d6efe3' }}><Icon name="check" size={15} color="#01624e" stroke={3} /></span>
            <span>Cita confirmada<small>Jueves · 17:00</small></span>
          </div>
          <div className="chip b">
            <span className="ic" style={{ background: '#e4ddfb' }}><Icon name="bell" size={15} /></span>
            <span>Recordatorio enviado<small>Automático</small></span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- dolor ---------- */
function Vignette({ kind }) {
  if (kind === 'search') {
    return (
      <div className="vig">
        <div className="searchbox"><Icon name="search" size={14} color="#5f5868" stroke={2.4} />centro cerca de mí</div>
        <div className="bar" style={{ width: '72%', marginTop: 12 }} />
        <div className="bar" style={{ width: '54%' }} />
        <div className="missing">Tu centro: no aparece</div>
      </div>
    )
  }
  if (kind === 'chat') {
    return (
      <div className="vig">
        <div className="bubble">¿Tenéis plaza esta tarde?</div>
        <div className="sent"><Icon name="clock" size={14} color="#5f5868" stroke={2.4} />Enviado · sin respuesta</div>
      </div>
    )
  }
  return (
    <div className="vig" style={{ paddingTop: 6, paddingBottom: 6 }}>
      {['Confirmar citas', 'Enviar recordatorios', 'Hacer seguimiento'].map((t) => (
        <div className="task" key={t}><i />{t}</div>
      ))}
    </div>
  )
}

function Dolor() {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return undefined
    const id = setInterval(() => setI((v) => (v + 1) % DOLOR_PHRASES.length), 3200)
    return () => clearInterval(id)
  }, [reduce])
  const current = reduce ? 0 : i
  return (
    <section id="dolor" className="solid">
      <div className="wrap row-pad">
        <div className="dolor-head">
          <div>
            <div className="eyebrow">El problema</div>
            <h2 className="dolor-title" aria-label={DOLOR_PHRASES.map((p) => `Nadie ${p}`).join(' ')}>
              <span aria-hidden="true">Nadie{' '}
                <em key={current} className="rot swap">{DOLOR_PHRASES[current]}</em>
              </span>
            </h2>
          </div>
        </div>
        <div className="dots" aria-hidden="true">
          {DOLOR_PHRASES.map((_, k) => <i key={k} className={k === current ? 'on' : ''} />)}
        </div>
        <div className="cards3" style={{ marginTop: 28 }}>
          {DOLORES.map((d) => (
            <article key={d.n} className={`pain ${d.tint}`}>
              <div className="pain-top">
                <span className="num">{d.n}</span>
                <span className="round"><Icon name={d.icon} /></span>
              </div>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
              <Vignette kind={d.vignette} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- cómo trabajamos ---------- */
function Como() {
  return (
    <section id="como" style={{ scrollMarginTop: 72 }}>
      <div className="wrap row-pad">
        <div className="eyebrow">Cómo trabajamos</div>
        <h2 className="h2" style={{ maxWidth: 760, marginBottom: 48 }}>Un proceso claro, <em>paso a paso.</em></h2>
        <div className="steps">
          {PASOS.map((p) => (
            <div className="step" key={p.n}>
              <span className="n">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- qué montamos ---------- */
function Montamos() {
  return (
    <section id="montamos" className="solid" style={{ scrollMarginTop: 72 }}>
      <div className="wrap row-pad">
        <div className="eyebrow">Qué montamos</div>
        <h2 className="h2" style={{ maxWidth: 760, marginBottom: 48 }}>Una pieza para <em>cada problema.</em></h2>
        <div className="pieces">
          {MONTAMOS.map((m) => (
            <article className="piece" key={m.title}>
              <span className={`tag ${m.tint}`}>{m.resuelve}</span>
              <h3>{m.title}</h3>
              {m.items.map((it) => (
                <div className="item" key={it.name}>
                  <span className={`tile ${m.tint}`}><Icon name={it.icon} /></span>
                  <div><b>{it.name}</b><span>{it.text}</span></div>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- casos ---------- */
function Casos() {
  const mobile = useMediaQuery('(max-width: 760px)')
  const [c, setC] = useState(0)
  const total = CASOS.length
  const visible = mobile ? 1 : 3
  const prev = () => setC((v) => (v + total - 1) % total)
  const next = () => setC((v) => (v + 1) % total)
  const items = Array.from({ length: visible }, (_, k) => CASOS[(c + k) % total])
  return (
    <section id="casos" style={{ scrollMarginTop: 72 }}>
      <div className="wrap row-pad">
        <div className="casos-head">
          <div>
            <div className="eyebrow">Casos</div>
            <h2 className="h2" style={{ maxWidth: 720 }}>Centros que ya <em>trabajan con nosotros.</em></h2>
          </div>
          <div className="arrows">
            <button className="arrow" type="button" onClick={prev} aria-label="Caso anterior"><Icon name="left" stroke={2.2} /></button>
            <button className="arrow dark" type="button" onClick={next} aria-label="Caso siguiente"><Icon name="right" stroke={2.2} /></button>
          </div>
        </div>
        <div className="casos-grid">
          {items.map((k) => (
            <article className="caso" key={k.nombre}>
              <div className="caso-img" style={{ background: k.bg }}>
                <GrainOverlay id={`g-${k.nombre.replace(/\W/g, '')}`} />
                <span className="sector">{k.sector}</span>
                <div className="logo-box"><div>[LOGO]</div></div>
              </div>
              <div className="caso-body">
                <h3>{k.nombre}</h3>
                <p>{k.frase}</p>
                <div className="chips">{k.servicios.map((s, n) => <span key={n}>{s}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
        <div className="casos-nav">
          <button className="arrow" type="button" onClick={prev} aria-label="Caso anterior"><Icon name="left" stroke={2.2} /></button>
          <div className="counter" aria-live="polite">{c + 1} / {total}</div>
          <button className="arrow dark" type="button" onClick={next} aria-label="Caso siguiente"><Icon name="right" stroke={2.2} /></button>
        </div>
        <div className="dots casos-dots" aria-hidden="true">
          {CASOS.map((_, k) => <i key={k} className={k === c ? 'on' : ''} />)}
        </div>
      </div>
    </section>
  )
}

/* ---------- demo ---------- */
function Demo() {
  return (
    <section id="demo" className="demo-wrap" style={{ scrollMarginTop: 72 }}>
      <div className="demo">
        <div aria-hidden="true">
          <div className="blob" style={{ right: -80, top: -120, width: 480, height: 480, background: '#ff6b35', opacity: 0.55, filter: 'blur(90px)' }} />
          <div className="blob" style={{ right: 120, bottom: -160, width: 440, height: 440, background: '#e84393', opacity: 0.5, filter: 'blur(90px)' }} />
          <div className="blob" style={{ left: -140, bottom: -180, width: 440, height: 440, background: '#6c5ce7', opacity: 0.5, filter: 'blur(100px)' }} />
          <GrainOverlay id="g-demo" />
        </div>
        <div className="demo-in">
          <div className="demo-copy">
            <div className="eyebrow">Demo gratuita</div>
            <h2>{DEMO.title[0]}<em>{DEMO.title[1]}</em>{DEMO.title[2]}</h2>
            <p>{DEMO.text}</p>
            <a className="btn btn-white" href={whatsappUrl}><Icon name="chat" color="#01624e" />{DEMO.cta}</a>
          </div>
          <div className="demo-steps">
            {DEMO.steps.map((s, k) => (
              <div className="glass" key={s}><span className="n">{k + 1}</span><span>{s}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
function Faq() {
  const mobile = useMediaQuery('(max-width: 760px)')
  const [all, setAll] = useState(false)
  const list = mobile && !all ? FAQS.slice(0, 3) : FAQS
  return (
    <section id="faq" style={{ scrollMarginTop: 72 }}>
      <div className="wrap row-pad" style={{ borderTop: '1px dashed var(--dash)' }}>
        <div className="faq-in">
          <div className="faq-title">
            <div className="eyebrow">FAQ</div>
            <h2 className="h2">Preguntas <em>frecuentes.</em></h2>
          </div>
          <div style={{ flex: '1.6 1 460px', minWidth: 0 }}>
            <div className="faq-list">
              {list.map((f, k) => (
                <details key={f.q} open={k === 0 ? true : undefined}>
                  <summary>{f.q}<span className="pm"><Icon name="plus" size={14} stroke={2.4} /></span></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            {mobile && (
              <button className="faq-more" type="button" onClick={() => setAll(!all)}>
                {all ? 'Ver menos preguntas' : 'Ver más preguntas'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- CTA final y pie ---------- */
function Cta() {
  return (
    <section id="cta" className="solid" style={{ scrollMarginTop: 72 }}>
      <div className="wrap cta">
        <h2>{CTA.title[0]}<br /><em>{CTA.title[1]}</em></h2>
        <a className="btn btn-green btn-xl" href={whatsappUrl}><Icon name="chat" size={22} />{CTA.button}</a>
        <p>{CTA.note}</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="solid">
      <div className="wrap">
        <div className="footer-in">
          <Logo />
          <div>{FOOTER.contact}</div>
          <div>{FOOTER.legal.map((l, k) => <span key={l}>{k > 0 && ' · '}<a href="#top">{l}</a></span>)}</div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="page">
      <Background />
      <Header />
      <main>
        <Hero />
        <Dolor />
        <Como />
        <Montamos />
        <Casos />
        <Demo />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
