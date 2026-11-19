import { useEffect, useRef, useState } from 'react'
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

/* Aparición suave al hacer scroll: añade .is-in a los [data-reveal] cuando entran en pantalla */
function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-reveal]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'))
      return undefined
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in')
          io.unobserve(en.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

/* Parallax: los [data-parallax="v"] se desplazan v px por cada px de distancia al centro de la pantalla */
function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const wide = window.matchMedia('(min-width: 961px)')
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        if (el.dataset.wide && !wide.matches) { el.style.translate = ''; el._py = 0; return }
        const r = el.getBoundingClientRect()
        const cur = el._py || 0
        if (r.bottom < -200 || r.top > vh + 200) return
        const center = r.top + r.height / 2 - cur
        const off = Math.round((center - vh / 2) * parseFloat(el.dataset.parallax) * 10) / 10
        el._py = off
        el.style.translate = `0 ${off}px`
      })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    update()
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

/* Devuelve true mientras el elemento está en pantalla */
function useInView(ref) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([en]) => setInView(en.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return inView
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
  const ref = useRef(null)
  // Deriva lenta del fondo según el avance del scroll (profundidad respecto a las filas sólidas)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (ref.current) ref.current.style.transform = `translate3d(0, ${(-p * 30).toFixed(2)}vh, 0)`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    update()
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-in" ref={ref}>
      <Grainient
        colors={['#fcfbf8', '#ffe2d3', '#ffc9dd', '#d9cff8', '#ffb89a']}
        angle={55}
        flow={0.9}
        silk={0.25}
        speed={0.6}
        grainAmount={0.06}
        clickSwirl={false}
        dpr={1.25}
      />
      </div>
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
const CHAT_DELAYS = [600, 900, 1300, 1400, 800, 1200, 700, 900]

function useChatSequence(reduce) {
  const [n, setN] = useState(0)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    if (reduce) return undefined
    let t
    let alive = true
    const run = (i) => {
      if (!alive) return
      if (i < CHAT_DELAYS.length) {
        t = setTimeout(() => { setN(i + 1); run(i + 1) }, CHAT_DELAYS[i])
      } else {
        t = setTimeout(() => {
          setFading(true)
          t = setTimeout(() => { setN(0); setFading(false); run(0) }, 700)
        }, 3800)
      }
    }
    run(0)
    return () => { alive = false; clearTimeout(t) }
  }, [reduce])
  return { k: reduce ? 8 : n, fading: reduce ? false : fading }
}

function Typing() {
  return <div className="typing" aria-hidden="true"><i /><i /><i /></div>
}

function Hero() {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { k, fading } = useChatSequence(reduce)
  return (
    <section id="top" className="hero">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <div className="pill" data-reveal><span className="dot" />{HERO.pill}</div>
          <h1 data-reveal style={{ '--d': '.08s' }}>{HERO.title[0]}<em>{HERO.title[1]}</em></h1>
          <p className="sub" data-reveal style={{ '--d': '.16s' }}>{HERO.sub[0]} <br />{HERO.sub[1]}</p>
          <div data-reveal style={{ '--d': '.24s' }}>
            <a className="btn btn-green btn-lg" href={whatsappUrl}>
              <Icon name="chat" />{HERO.cta}
            </a>
            <div className="checks">
              {HERO.checks.map((c) => <span key={c}><Icon name="check" size={14} color="#01624e" stroke={3} />{c}</span>)}
            </div>
          </div>
        </div>
        <div className="hero-art" data-reveal style={{ '--d': '.2s' }}>
          <div className="phone" data-parallax="0.05">
            <div className="phone-screen">
              <div className="chat-head">
                <span className="avatar">TC</span>
                <div className="t"><b>[Tu centro]</b><span>Asistente · en línea</span></div>
              </div>
              <div className={`chat-body${fading ? ' fading' : ''}`} role="img" aria-label="Conversación de ejemplo: un cliente pide cita y el asistente la reserva y envía un recordatorio.">
                {k >= 1 && <div className="msg in pop">Hola, ¿tenéis plaza el jueves por la tarde?</div>}
                {(k === 2 || k === 5) && <Typing />}
                {k >= 3 && <div className="msg out pop">¡Hola! Sí. Tengo hueco a las 17:00 y a las 18:30. ¿Cuál te va mejor?</div>}
                {k >= 4 && <div className="msg in pop" style={{ maxWidth: '60%' }}>A las 17:00</div>}
                {k >= 6 && <div className="msg out pop">Reservado. Te enviaremos un recordatorio antes de la cita.</div>}
              </div>
              <div className="chat-input"><div className="f">Escribe un mensaje</div><span className="b" /></div>
            </div>
          </div>
          <div className="chip-pos pa" data-parallax="0.1">
            <div className={`chip-card${k >= 7 && !fading ? ' show' : ''}`}>
              <span className="ic" style={{ background: '#d6efe3' }}><Icon name="check" size={15} color="#01624e" stroke={3} /></span>
              <span>Cita confirmada<small>Jueves · 17:00</small></span>
            </div>
          </div>
          <div className="chip-pos pb" data-parallax="0.1">
            <div className={`chip-card${k >= 8 && !fading ? ' show' : ''}`}>
              <span className="ic" style={{ background: '#e4ddfb' }}><Icon name="bell" size={15} /></span>
              <span>Recordatorio enviado<small>Automático</small></span>
            </div>
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
    <section id="dolor" className="solid sheet">
      <div className="wrap row-pad">
        <div className="dolor-head" data-reveal>
          <div>
            <div className="eyebrow">El problema</div>
            <h2 className="dolor-title" aria-label={DOLOR_PHRASES.map((p) => `Nadie ${p}`).join(' ')}>
              <span aria-hidden="true">Nadie{' '}
                <em key={current} className="rot swap">{DOLOR_PHRASES[current]}</em>
              </span>
            </h2>
          </div>
        </div>
        <div className="dots" aria-hidden="true" data-reveal>
          {DOLOR_PHRASES.map((_, k) => <i key={k} className={k === current ? 'on' : ''} />)}
        </div>
        <div className="cards3" style={{ marginTop: 28 }}>
          {DOLORES.map((d, k) => (
            <article key={d.n} className={`pain ${d.tint}`} data-reveal data-parallax={['0.02', '0.05', '0.08'][k]} data-wide="1" style={{ '--d': `${k * 0.12}s` }}>
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
function SvgIcon({ name, x, y, size = 24, color = '#1c1424' }) {
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </g>
  )
}

const CH = [
  { icon: 'browser', label: 'Web', x: 70, y: 74 },
  { icon: 'chat', label: 'WhatsApp', x: 330, y: 74 },
  { icon: 'phone', label: 'Llamadas', x: 70, y: 246 },
  { icon: 'pin', label: 'Google', x: 330, y: 246 },
]

function SceneConecta() {
  return (
    <svg viewBox="0 0 400 320" className="pv-svg" role="img" aria-label="Tu centro conectado con web, WhatsApp, llamadas y Google">
      {CH.map((c, i) => (
        <g key={c.label}>
          <line x1="200" y1="160" x2={c.x} y2={c.y} className="pv-flow" style={{ '--d': `${i * 0.15}s` }} />
          <g className="pv-pop" style={{ '--d': `${0.2 + i * 0.12}s` }}>
            <circle cx={c.x} cy={c.y} r="30" fill="#fff" stroke="#ebe6e0" />
            <SvgIcon name={c.icon} x={c.x} y={c.y} />
            <text x={c.x} y={c.y + 48} textAnchor="middle" className="pv-t">{c.label}</text>
          </g>
        </g>
      ))}
      <circle cx="200" cy="160" r="40" className="pv-ring" />
      <circle cx="200" cy="160" r="40" className="pv-ring r2" />
      <circle cx="200" cy="160" r="40" fill="#1c1424" />
      <circle cx="200" cy="148" r="5" fill="#ff6b35" />
      <text x="200" y="172" textAnchor="middle" className="pv-t w">Tu centro</text>
    </svg>
  )
}

const FUGAS = [
  { label: 'Web', keep: 0.78 },
  { label: 'Mensajes', keep: 0.34, hot: true },
  { label: 'Llamadas', keep: 0.55 },
  { label: 'Seguimiento', keep: 0.42 },
]

function SceneFugas() {
  return (
    <svg viewBox="0 0 400 320" className="pv-svg" role="img" aria-label="Dónde se pierden más clientes: los mensajes sin respuesta">
      <text x="30" y="44" className="pv-t m">Clientes que llegan</text>
      {FUGAS.map((f, i) => {
        const y = 74 + i * 56
        const w = 240
        return (
          <g key={f.label}>
            <text x="30" y={y + 12} className="pv-t">{f.label}</text>
            <rect x="130" y={y} width={w} height="16" rx="8" fill={f.hot ? '#ffd6e8' : '#efeae4'} />
            <rect x="130" y={y} width={w * f.keep} height="16" rx="8" fill="#01624e" className="pv-grow" style={{ '--d': `${i * 0.12}s` }} />
            {f.hot && (
              <g className="pv-pop" style={{ '--d': '.9s' }}>
                <rect x="124" y={y - 8} width={w + 12} height="32" rx="16" fill="none" stroke="#ff6b35" strokeWidth="2" className="pv-hot" />
                <rect x="276" y={y - 34} width="96" height="22" rx="11" fill="#ff6b35" />
                <text x="324" y={y - 19} textAnchor="middle" className="pv-t w s">Mayor pérdida</text>
              </g>
            )}
          </g>
        )
      })}
      <g>
        <rect x="130" y="298" width="10" height="10" rx="3" fill="#01624e" />
        <text x="146" y="307" className="pv-t s">Atendidos</text>
        <rect x="224" y="298" width="10" height="10" rx="3" fill="#ffd6e8" />
        <text x="240" y="307" className="pv-t s">Se pierden</text>
      </g>
    </svg>
  )
}

const PIEZAS = [
  { icon: 'chat', label: 'Agente de WhatsApp' },
  { icon: 'users', label: 'CRM y agenda' },
  { icon: 'browser', label: 'Tu web' },
]

function SceneMonta() {
  return (
    <svg viewBox="0 0 400 320" className="pv-svg" role="img" aria-label="Las piezas se conectan a lo que ya usas">
      {PIEZAS.map((p, i) => {
        const y = 40 + i * 70
        return (
          <g key={p.label} className="pv-pop" style={{ '--d': `${i * 0.18}s` }}>
            <rect x="40" y={y} width="320" height="56" rx="16" fill="#fff" stroke="#ebe6e0" />
            <circle cx="72" cy={y + 28} r="16" fill={['#ffe2d3', '#ffd6e8', '#e4ddfb'][i]} />
            <SvgIcon name={p.icon} x={72} y={y + 28} size={18} />
            <text x="100" y={y + 33} className="pv-t b">{p.label}</text>
            <rect x="296" y={y + 17} width="46" height="24" rx="12" fill="#01624e" className="pv-tog" style={{ '--d': `${0.5 + i * 0.35}s` }} />
            <circle cx="330" cy={y + 29} r="9" fill="#fff" className="pv-knob" style={{ '--d': `${0.5 + i * 0.35}s` }} />
          </g>
        )
      })}
      <g className="pv-pop" style={{ '--d': '1.7s' }}>
        <rect x="116" y="258" width="168" height="36" rx="18" fill="#d6efe3" />
        <SvgIcon name="check" x={142} y={276} size={16} color="#01624e" />
        <text x="162" y="281" className="pv-t b g">Todo conectado</text>
      </g>
    </svg>
  )
}

function SceneMide() {
  return (
    <svg viewBox="0 0 400 320" className="pv-svg" role="img" aria-label="Los resultados mejoran con el tiempo">
      <defs>
        <linearGradient id="pvArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#01624e" stopOpacity=".22" />
          <stop offset="1" stopColor="#01624e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text x="30" y="40" className="pv-t m">Respuestas a tiempo</text>
      {[90, 140, 190, 240].map((y) => <line key={y} x1="30" x2="370" y1={y} y2={y} stroke="#ebe6e0" strokeDasharray="4 6" />)}
      <path d="M30 236 C 90 232, 120 200, 170 186 S 260 130, 300 112 S 350 84, 370 78 L370 250 L30 250 Z" fill="url(#pvArea)" className="pv-fade" />
      <path d="M30 236 C 90 232, 120 200, 170 186 S 260 130, 300 112 S 350 84, 370 78" fill="none" stroke="#01624e" strokeWidth="3.5" strokeLinecap="round" pathLength="1" className="pv-draw" />
      <circle cx="370" cy="78" r="6" fill="#01624e" className="pv-pop" style={{ '--d': '1.1s' }} />
      <g className="pv-pop" style={{ '--d': '1.2s' }}>
        <rect x="64" y="262" width="130" height="34" rx="17" fill="#e4ddfb" />
        <SvgIcon name="trend" x={86} y={279} size={16} />
        <text x="104" y="284" className="pv-t b">Más citas</text>
      </g>
      <g className="pv-pop" style={{ '--d': '1.4s' }}>
        <rect x="206" y="262" width="130" height="34" rx="17" fill="#ffe2d3" />
        <SvgIcon name="repeat" x={228} y={279} size={16} />
        <text x="246" y="284" className="pv-t b">Ajustamos</text>
      </g>
    </svg>
  )
}

const SCENES = [SceneConecta, SceneFugas, SceneMonta, SceneMide]

function ProcessVisual({ active, onPick }) {
  const Scene = SCENES[active]
  return (
    <div className="pv" data-reveal style={{ '--d': '.1s' }}>
      <div className="pv-top">
        <span className="pv-badge">Paso {active + 1} de {PASOS.length}</span>
        <span className="pv-name">{PASOS[active].title}</span>
      </div>
      <div className="pv-stage" key={active}><Scene /></div>
      <div className="pv-dots">
        {PASOS.map((p, k) => (
          <button key={p.n} type="button" className={k === active ? 'on' : ''} aria-label={`Ver paso ${k + 1}: ${p.title}`} aria-current={k === active} onClick={() => onPick(k)} />
        ))}
      </div>
    </div>
  )
}

function Como() {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const ref = useRef(null)
  const inView = useInView(ref)
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (reduce || !inView) return undefined
    const id = setTimeout(() => setActive((v) => (v + 1) % PASOS.length), 4800)
    return () => clearTimeout(id)
  }, [active, reduce, inView])
  return (
    <section id="como" ref={ref} style={{ scrollMarginTop: 72 }}>
      <div className="wrap row-pad">
        <div data-reveal>
          <div className="eyebrow">Cómo trabajamos</div>
          <h2 className="h2" style={{ maxWidth: 760, marginBottom: 48 }}>Un proceso claro, <em>paso a paso.</em></h2>
        </div>
        <div className="como-grid">
          <div className="steps" data-reveal>
            {PASOS.map((p, k) => (
              <div className={`step${k === active ? ' on' : ''}`} key={p.n}>
                <span className="n">{p.n}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
          <ProcessVisual active={active} onPick={setActive} />
        </div>
      </div>
    </section>
  )
}

/* ---------- cómo te ayudamos ---------- */
function Ayuda() {
  return (
    <section id="ayuda" className="solid sheet" style={{ scrollMarginTop: 72 }}>
      <div className="wrap row-pad">
        <div data-reveal>
          <div className="eyebrow">Cómo te ayudamos</div>
          <h2 className="h2" style={{ maxWidth: 760, marginBottom: 48 }}>Una pieza para <em>cada problema.</em></h2>
        </div>
        <div className="pieces">
          {MONTAMOS.map((m, k) => (
            <article className="piece" key={m.title} data-reveal style={{ '--d': `${k * 0.12}s` }}>
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
        <div className="casos-head" data-reveal>
          <div>
            <div className="eyebrow">Casos</div>
            <h2 className="h2" style={{ maxWidth: 720 }}>Centros que ya <em>trabajan con nosotros.</em></h2>
          </div>
          <div className="arrows">
            <button className="arrow" type="button" onClick={prev} aria-label="Caso anterior"><Icon name="left" stroke={2.2} /></button>
            <button className="arrow dark" type="button" onClick={next} aria-label="Caso siguiente"><Icon name="right" stroke={2.2} /></button>
          </div>
        </div>
        <div className="casos-grid" data-reveal style={{ '--d': '.1s' }}>
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
    <section id="demo" className="solid sheet" style={{ scrollMarginTop: 72 }}>
      <div className="wrap row-pad demo-in">
        <div className="demo-copy" data-reveal>
          <div className="eyebrow">Demo gratuita</div>
          <h2>{DEMO.title[0]}<em>{DEMO.title[1]}</em>{DEMO.title[2]}</h2>
          <p>{DEMO.text}</p>
          <a className="btn btn-green btn-lg" href={whatsappUrl}><Icon name="chat" />{DEMO.cta}</a>
        </div>
        <div className="demo-steps">
          {DEMO.steps.map((s, k) => (
            <div className="dstep" key={s} data-reveal style={{ '--d': `${0.1 + k * 0.12}s` }}><span className="n">{k + 1}</span><span>{s}</span></div>
          ))}
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
          <div className="faq-title" data-reveal>
            <div className="eyebrow">FAQ</div>
            <h2 className="h2">Preguntas <em>frecuentes.</em></h2>
          </div>
          <div data-reveal style={{ flex: '1.6 1 460px', minWidth: 0, '--d': '.1s' }}>
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
    <section id="cta" className="solid sheet" style={{ scrollMarginTop: 72 }}>
      <div className="wrap cta">
        <h2 data-reveal><span className="l1">{CTA.title[0]}</span><span className="l2">{CTA.title[1]}</span></h2>
        <div data-reveal style={{ '--d': '.15s' }}>
          <a className="btn btn-green btn-xl" href={whatsappUrl}><Icon name="chat" size={22} />{CTA.button}</a>
          <p>{CTA.note}</p>
        </div>
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
  useReveal()
  useParallax()
  return (
    <div className="page">
      <Background />
      <Header />
      <main>
        <Hero />
        <Dolor />
        <Como />
        <Ayuda />
        <Casos />
        <Demo />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
