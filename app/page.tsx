'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, CircleHelp, Mail, MapPin, Menu, MessageCircle, Phone, Target, ThumbsUp, Users, X } from 'lucide-react'

const nav = [['Kursy', '#kursy'], ['Zajęcia', '#formy'], ['Cennik', '#cennik'], ['Opinie', '#opinie'], ['Pytania', '#pytania']]

const benefits = [
  { title: 'Program pod jednego ucznia', text: 'Nie ma gotowego podręcznika dla wszystkich. Zaczynamy od rozmowy o tym, po co Ci angielski i na jakim jesteś poziomie.', icon: Target },
  { title: 'Nauka bez blokady', text: 'Blokada i wstyd przed mówieniem to najczęstszy powód, dla którego ktoś do mnie trafia. U mnie mówi się od pierwszej lekcji, bez oceniania i bez pośpiechu.', icon: MessageCircle },
  { title: 'Grupy wiekowe', text: 'Młodsza i starsza młodzież, dorośli aż po osoby po siedemdziesiątce. Do każdej grupy inne tempo, inne materiały i inny sposób tłumaczenia.', icon: Users },
  { title: '17 lat praktyki', text: 'Pracownia działa od 2009 roku. Przez ten czas zebrałam własne sposoby na to, co zwykle sprawia trudność: czasy, wymowę i strach przed pierwszym zdaniem.', icon: CalendarDays },
]

const courses = [
  ['Angielski dla młodzieży', 'Wsparcie przy szkole i przygotowanie do egzaminów. Gramatyka wyjaśniona tak, żeby wreszcie miała sens.', ['pod materiał szkolny', 'matura i egzamin ósmoklasisty', 'nauka mówienia'], 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85'],
  ['Angielski dla dorosłych', 'Dla osób, które uczyły się latami i nadal boją się odezwać, oraz dla tych, którzy zaczynają zupełnie od zera. Zaczynamy od mówienia, gramatykę dokładam po drodze.', ['blokada językowa', 'angielski do pracy', 'wyjazdy i podróże'], 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85'],
  ['Konwersacje', 'Godzina rozmowy na tematy, które Cię interesują. Poprawiam na bieżąco, ale nie przerywam w pół zdania.', ['swobodna rozmowa'], 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85'],
  ['Przygotowanie do egzaminów', 'Matura, egzamin ósmoklasisty, certyfikaty i rozmowy kwalifikacyjne. Ćwiczymy dokładnie ten format, który Cię czeka.', ['matura', 'certyfikaty', 'rozmowa kwalifikacyjna'], 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=85'],
]

const formats = [['Zajęcia indywidualne', 'jeden na jeden, tempo dopasowane do ucznia'], ['Zajęcia w parze', 'nauka z drugą osobą o zbliżonym poziomie'], ['Mała grupa', 'kameralne zajęcia, każdy zdąży się odezwać'], ['Konwersacje', 'godzina rozmowy bez podręcznika'], ['Przygotowanie do egzaminu', 'pakiet zajęć pod konkretny termin'], ['Zajęcia online', 'przez internet, z dowolnego miejsca']]
const processSteps = [
  ['Rozmowa', 'Dzwoni Pan albo Pani, umawiamy pierwsze spotkanie. Sprawdzam poziom i pytam, po co Panu ten angielski: praca, szkoła, wyjazd czy rozmowy z rodziną za granicą.'],
  ['Program pod cel', 'Układam plan na najbliższe tygodnie: ile mówienia, ile gramatyki, jakie materiały. Program zmienia się w trakcie, jeśli okazuje się, że coś idzie szybciej albo wolniej.'],
  ['Regularne zajęcia', 'Spotykamy się raz lub dwa razy w tygodniu w pracowni przy Źródlanej albo online, jeśli tak wygodniej. Po każdej lekcji wiadomo, co ćwiczyć do następnego razu.'],
]

const initialOpinions = [
  { name: 'Anna Witek', text: 'Pani Małgosia jest niesamowitym lektorem. Nauka angielskiego z nią to czysta przyjemność, zwłaszcza dla osoby z taką blokadą językową jak ja. Tłumaczy wszystko w tak łatwy i przystępny sposób, że nawet krótki czas wystarczył, abym nauczyła się komunikować z obcokrajowcami. Sumienna, dokładna, a przy tym cudowny drugi człowiek.', visible: true },
  { name: 'Krzysztof Hnatów', text: 'Pełna profeska dydaktyczna. Polecam.', visible: true },
  { name: 'Marek Mostowiak', text: 'Wszystko ideolo.', visible: true },
]

const faqs: { question: string; anwser: string }[] = [
  { question: 'Od czego zaczynamy?', anwser: 'Od krótkiej rozmowy telefonicznej. Umawiamy pierwsze spotkanie, sprawdzam poziom, ustalamy cel i dopiero potem układam program.' },
  { question: 'Czy uczy Pani osoby, które zaczynają od zera?', anwser: 'Tak. Zaczynam od podstaw zarówno z młodzieżą, jak i z dorosłymi, którzy nie mieli wcześniej kontaktu z angielskim.' },
  { question: 'Mam blokadę i wstydzę się mówić. Czy to problem?', anwser: 'To najczęstszy powód, dla którego dorośli do mnie trafiają. Zaczynamy od prostych zdań na tematy, które Pana albo Panią interesują, bez poprawiania co drugie słowo.' },
  { question: 'Ile trwają zajęcia i jak często się odbywają?', anwser: 'Najczęściej raz lub dwa razy w tygodniu. Długość i częstotliwość ustalamy przy zapisie, zależnie od celu i wieku ucznia.' },
  { question: 'Czy przygotowuje Pani do matury i certyfikatów?', anwser: 'Tak. Ćwiczymy dokładnie ten format, który czeka ucznia: zadania z arkusza, wypowiedź ustną i pisemną, powtórki pod termin egzaminu.' },
  { question: 'Gdzie odbywają się zajęcia?', anwser: 'W pracowni przy Źródlanej 30A w Zielonej Górze, od poniedziałku do piątku w godzinach 7:00-19:00. Prowadzę też zajęcia online, więc odległość nie jest przeszkodą.' },
]

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="kicker"><span className="kicker-line" /><span className="kicker-text">{children}</span><span className="kicker-line" /></div>
}

export default function Page() {
  const [open, setOpen] = useState<number[]>([])
  const [mobile, setMobile] = useState(false)
  const [opinionIndex, setOpinionIndex] = useState(0)
  const [visibleOpinions, setVisibleOpinions] = useState(2)
  const [contactView, setContactView] = useState<'contact' | 'form'>('contact')

  // Stany dla Opinii
  const [opinionsList, setOpinionsList] = useState(initialOpinions)

  // Stany dla Formularza Resend
  const [formData, setFormData] = useState({ name: '', title: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const COLOR_PAIRS = [
  { bg: '#BFDBFE', text: '#1E3A8A' }, // Niebieski
  { bg: '#A7F3D0', text: '#064E3B' }, // Zielony
  { bg: '#FDE68A', text: '#78350F' }, // Bursztynowy / Ciepły żółty
  { bg: '#DDD6FE', text: '#4C1D95' }, // Fioletowy
  { bg: '#FECDD3', text: '#881337' }, // Ciemny róż
  { bg: '#99F6E4', text: '#134E4A' }  // Turkusowy
];

// Funkcja przypisująca stałą parę kolorów do nazwy użytkownika
const getColorPair = (name: string) => {
  if (!name) return COLOR_PAIRS[0];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PAIRS[Math.abs(hash) % COLOR_PAIRS.length];
};

  // Pobieranie opinii z API
  useEffect(() => {
    async function fetchOpinions() {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          if (Array.isArray(data) && data.length > 0) {
            setOpinionsList(data)
          }
        }
      } catch (err) {
        console.error('Błąd podczas pobierania opinii:', err)
      }
    }
    fetchOpinions()
  }, [])

  // Responsywność karuzeli opinii
  useEffect(() => {
    const updateVisible = () => setVisibleOpinions(window.innerWidth < 700 ? 1 : 2)
    updateVisible()
    window.addEventListener('resize', updateVisible)
    return () => window.removeEventListener('resize', updateVisible)
  }, [])

  // Animacje reveal
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' })
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
    return () => revealObserver.disconnect()
  }, [])

  // Obsługa wysyłania formularza
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormStatus('success')
        setFormData({ name: '', title: '', email: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch (err) {
      setFormStatus('error')
    }
  }

  const maxOpinionIndex = Math.max(0, opinionsList.length - visibleOpinions)

  return <main>
    <header className="site-header"><a href="#start" className="logo">Pracownia<br /><strong>MEGAN</strong></a><nav>{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}<a className="phone-pill" href="tel:501486888"><Phone size={17} />501 486 888</a></nav><button className="menu-button" aria-label="Otwórz menu" onClick={() => setMobile(true)}><Menu /></button></header>
    {mobile && <div className="mobile-overlay" onClick={() => setMobile(false)}><div className="mobile-menu" onClick={(e) => e.stopPropagation()}><div className="mobile-menu-top"><span className="logo">Pracownia<br /><strong>MEGAN</strong></span><button aria-label="Zamknij menu" onClick={() => setMobile(false)}><X /></button></div>{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMobile(false)}>{label}</a>)}<a className="button" href="#kontakt" onClick={() => setMobile(false)}>Napisz wiadomość</a></div></div>}
    <div className="location">Zielona Góra · Źródlana 30A</div>
    <section id="start" className="hero"><div className="portrait"><img src="https://pracownia-megan.prezentacjastrony.pl/images/logo-megan.png" alt="Logo Pracowni Megan" /></div><div className="hero-copy"><Kicker>JĘZYK, KTÓRY ŻYJE</Kicker><h1>Przywitaj się<br />z nowym językiem</h1><p>Kameralne kursy angielskiego w Zielonej Górze.<br />Dzieci, młodzież i dorośli, grupy do pięciu osób.</p><div className="hero-actions"><a className="button" href="tel:501486888"><Phone size={18} />501 486 888</a><a className="outline-button" href="#kontakt">Napisz wiadomość</a></div></div></section>
    <section id="o-nas" className="section patterned reveal"><div className="pattern-motifs" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => { const Icon = [CircleHelp, MessageCircle, ThumbsUp][index % 3]; return <Icon key={index} size={index % 3 === 1 ? 32 : 26} strokeWidth={1.35} /> })}</div><div className="pattern-content"><h2>Dlaczego Pracownia Megan</h2><div className="benefit-grid">{benefits.map(({ title, text, icon: Icon }) => <article className="benefit reveal reveal-delay" key={title}><div className="benefit-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.8} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section id="jak-wygladaja" className="section process-section"><Kicker>BEZ NIESPODZIANEK</Kicker><h2>Jak wyglądają zajęcia</h2><div className="process-grid" aria-label="Jak wyglądają zajęcia">{processSteps.map(([title, text], index) => <article className="process-step" key={title}><div className="process-number">0{index + 1}</div><h3>{title}</h3><p>{text}</p>{index < processSteps.length - 1 && <ArrowRight className="process-arrow" aria-hidden="true" />}</article>)}</div></section>
    <section id="kursy" className="section courses reveal"><Kicker>DLA KAŻDEGO WIEKU</Kicker><h2>Kursy</h2><div className="course-grid">{courses.map(([title, text, tags, image], index) => <article className={`course reveal course-slide-${(index % 2) === 0 ? 'left' : 'right'}`} key={title as string}><img src={image as string} alt="" /><div className="course-copy"><h3>{title}</h3><p>{text}</p><div className="tags">{(tags as string[]).map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></section>
    <section id="formy" className="section formats"><Kicker>ELASTYCZNIE DLA CIEBIE</Kicker><h2>Formy zajęć</h2><div className="format-list">{formats.map(([title, text], index) => <div className="format-row" key={title}><span className="format-number">0{index + 1}</span><strong>{title}</strong><span>{text}</span></div>)}</div><a className="button" href="#kontakt">Zapytaj o cenę</a></section>
    
    {/* SEKCJA OPINII PODPIĘTA POD STATE */}
    <section id="opinie" className="reviews reveal">
      <h2>Opinie</h2>
      <div className="review-carousel">
        <button className="carousel-arrow" aria-label="Poprzednia opinia" disabled={opinionIndex === 0} onClick={() => setOpinionIndex((index) => Math.max(0, index - 1))}><ArrowLeft /></button>
        <div className="review-viewport">
          <div className="review-track" style={{ transform: `translateX(calc(-${opinionIndex} * (var(--opinion-card-width) + var(--opinion-gap))))` }}>
            {opinionsList.filter(o => o.visible).map((opinion) => (
              <blockquote key={opinion.name}>
                <div className="review-author">
                  {(() => {
                    const { bg, text } = getColorPair(opinion.name);
                    
                    return (
                      <i 
                        aria-hidden="true" 
                        style={{ 
                          backgroundColor: bg,
                          color: text 
                        }}
                      >
                        {opinion.name.charAt(0)}
                      </i>
                    );
                  })()}
                  <div className="review-author-meta">
                    <strong>{opinion.name}</strong>
                    <small>opinia w Google</small>
                  </div>
                </div>
                <p>{opinion.text}</p>
              </blockquote>
            ))}
          </div>
        </div>
        <button className="carousel-arrow" aria-label="Następna opinia" disabled={opinionIndex >= maxOpinionIndex} onClick={() => setOpinionIndex((index) => Math.min(maxOpinionIndex, index + 1))}><ArrowRight /></button>
      </div>
    </section>

    <section id="pytania" className="section faq reveal"><Kicker>ZANIM ZADZWONISZ</Kicker><h2>Częste pytania</h2>{faqs.map(({ question, anwser }, index) => { const isOpen = open.includes(index); return <div className={`faq-item ${isOpen ? 'active' : ''}`} key={question}><button aria-expanded={isOpen} onClick={() => setOpen((current) => isOpen ? current.filter((item) => item !== index) : [...current, index])}><span>{question}</span><ChevronDown /></button><div className={`faq-answer ${isOpen ? 'is-open' : ''}`}><p>{anwser}</p></div></div> })}</section>
    
    {/* SEKCJA KONTAKTU Z PODPIĘTYM FORMULARZEM RESEND */}
    <section id="kontakt" className="contact reveal">
      <h2>Zapisz się</h2>
      <div className="contact-tabs" role="tablist" aria-label="Zapisz się">
        <button type="button" role="tab" aria-selected={contactView === 'contact'} className={contactView === 'contact' ? 'active' : ''} onClick={() => setContactView('contact')}><Phone aria-hidden="true" />501 486 888</button>
        <button type="button" role="tab" aria-selected={contactView === 'form'} className={contactView === 'form' ? 'active' : ''} onClick={() => setContactView('form')}><Mail aria-hidden="true" />pracownia.megan@gmail.com</button>
      </div>
      <div className={`contact-grid contact-view-${contactView}`}>
        <div className="contact-info" role="tabpanel" tabIndex={0} onClick={() => setContactView('contact')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setContactView('contact') }}>
          <a href="tel:501486888" className="big-phone"><Phone />501 486 888</a>
          <a href="mailto:pracownia.megan@gmail.com" className="email"><Mail />pracownia.megan@gmail.com</a>
          <div className="hours">{['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'].map((day, i) => <div key={day}><span>{day}</span><b>{i < 5 ? '7:00 - 19:00' : 'nieczynne'}</b></div>)}</div>
          <div className="address"><MapPin size={19} />Źródlana 30A<br />65-734 Zielona Góra</div>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10322.726681744294!2d15.510340000000001!3d51.951976!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470613ea8065700d%3A0xf21a9bbfa11be3b0!2zxblyw7NkbGFuYSAzMEEsIDY1LTczNCBaaWVsb25hIEfDs3JhLCBQb2xza2E!5e1!3m2!1spl!2sus!4v1787571751475!5m2!1spl!2sus" width="600" height="450" loading="lazy"></iframe>
        </div>

        <form className="contact-form" role="tabpanel" tabIndex={0} onClick={() => setContactView('form')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setContactView('form') }} onSubmit={handleFormSubmit}>
          <h3>Napisz do nas</h3>
          <label>
            Imię i nazwisko
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="np. Anna Kowalska" 
            />
          </label>
          <label>
            Tytuł wiadomości
            <input 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="np. Zapisy na kurs dla dziecka" 
            />
          </label>
          <label>
            Adres e-mail
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="np. anna@poczta.pl" 
            />
          </label>
          <label>
            Treść wiadomości
            <textarea 
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Kto i po co chce się uczyć?" 
            />
          </label>
          <button className="button" type="submit" disabled={formStatus === 'loading'}>
            {formStatus === 'loading' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
          </button>
          
          {formStatus === 'success' && (
            <p style={{ color: '#16a34a', marginTop: '10px', fontSize: '0.9rem', fontWeight: 500 }}>Dziękujemy! Wiadomość została wysłana.</p>
          )}
          {formStatus === 'error' && (
            <p style={{ color: '#dc2626', marginTop: '10px', fontSize: '0.9rem', fontWeight: 500 }}>Błąd podczas wysyłania. Spróbuj ponownie lub zadzwoń.</p>
          )}

          <small>Dane wykorzystamy wyłącznie po to, żeby odpowiedzieć na zgłoszenie.</small>
        </form>
      </div>
    </section>

    <footer><span>Pracownia MEGAN</span><span>© 2025</span></footer>
  </main>
}