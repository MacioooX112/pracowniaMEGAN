'use client'

import { useEffect, useState } from 'react'
import { getGoogleReviews, Opinion } from '@/app/actions/getReviews';
import Image from 'next/image'
import logo from "@/images/logo-megan.png"
import angielskidlamlodziezy from "@/images/angeilski-dla-mlodziezy.png"
import angielskidladoroslych from "@/images/angielski-dla-doroslych.jpg"
import konwersacja from "@/images/konwersacja.jpg"

import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, CircleHelp, Mail, MapPin, Menu, MessageCircle, Phone, Target, ThumbsUp, Users, X } from 'lucide-react'
import { StaticImageData } from 'next/image';

const nav = [['Kursy', '#kursy'], ['Zajęcia', '#formy'], ['Opinie', '#opinie'], ['Pytania', '#pytania'], ['Kontakt', '#kontakt']]

const benefits = [
  { title: 'Program pod jednego ucznia', text: 'Nie ma gotowego podręcznika dla wszystkich. Zaczynamy od rozmowy do czego potrzebny Ci angielski i na jakim jesteś poziomie.', icon: Target },
  { title: 'Nauka bez blokady', text: 'Blokada i wstyd przed mówieniem to częsty powód, dla którego uczniowie do mnie trafiają. U mnie mówi się od pierwszej lekcji, bez oceniania i bez pośpiechu.', icon: MessageCircle },
  { title: 'Grupy wiekowe', text: 'Młodsza i starsza młodzież, dorośli, aż po osoby po siedemdziesiątce. Tempo, materiały i sposób tłumaczenia dostosowane do każdego.', icon: Users },
  { title: '17 lat praktyki', text: 'Pracownia działa od 2009 roku. Dzięki doświadczeniu wiem jak pomóc w tym, co zwykle sprawia trudność: angielskich czasach, wymowie i strachu przed pierwszym zdaniem.', icon: CalendarDays },
]

const courses = [
  ['Angielski dla młodzieży', 'Wsparcie w nauce szkolnej, nauka języka angielskiego niezależnie od niej, przygotowanie do egzaminów. Gramatyka wyjaśniona tak, żeby wreszcie miała sens. Poszerzanie słownictwa.', ['pod materiał szkolny', 'matura i egzamin ósmoklasisty', 'nauka mówienia'], angielskidlamlodziezy],
  ['Angielski dla dorosłych', 'Dla osób, które uczyły się latami i nadal boją się odezwać, oraz dla tych, którzy zaczynają zupełnie od zera.', ['blokada językowa', 'angielski do pracy', 'wyjazdy i podróże'], angielskidladoroslych],
  ['Konwersacje', 'Rozmowy na tematy, które Cię interesują. Poprawiam na bieżąco, ale nie przerywam w pół zdania.', ['swobodna rozmowa'], konwersacja],
  ['Przygotowanie do egzaminów', 'Matura, egzamin ósmoklasisty, certyfikaty i rozmowy kwalifikacyjne. Ćwiczymy dokładnie ten format, który Cię czeka.', ['matura', 'certyfikaty', 'rozmowa kwalifikacyjna'], 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=85'],
]

const formats = [['Zajęcia indywidualne', 'Jeden na jeden, tempo dopasowane do ucznia'], ['Zajęcia w parze', 'Nauka z drugą osobą o zbliżonym poziomie'], ['Mała grupa', 'Kameralne zajęcia, każdy zdąży się odezwać'], ['Konwersacje', 'Rozmowy bez podręcznika'], ['Przygotowanie do egzaminu', 'Zajęcia pod konkretny format'], ['Zajęcia online', 'Przez internet, z dowolnego miejsca']]
const processSteps = [
  ['Rozmowa', 'Umawiamy się na pierwsze spotkanie. Sprawdzam poziom i pytam do czego angielski jest potrzebny: praca, szkoła, wyjazd czy rozmowy z rodziną za granicą.'],
  ['Program pod cel', 'Proponuję materiały na czas nauki. Modyfikuję je, gdy w jej trakcie coś idzie szybciej albo wolniej.'],
  ['Regularne zajęcia', 'Spotykamy się według ustalonej częstotliwości w tygodniu w Pracowni przy Źródlanej albo online, jeśli tak wygodniej. Po każdej lekcji wiadomo, co ćwiczyć do następnego razu.'],
]

const faqs: { question: string; anwser: string }[] = [
  { question: 'Od czego zaczynamy?', anwser: 'Umawiamy pierwsze spotkanie, sprawdzam poziom, ustalamy cel i dopiero potem układam program.' },
  { question: 'Czy mogę zacząć od zera?', anwser: 'Tak. Uczę od podstaw zarówno młodzież jak i doroslych, którzy nie mieli wcześniej kontaktu z angielskim.' },
  { question: 'Mam blokadę i wstydzę się mówić. Czy to problem?', anwser: 'To częsty powód, dla którego uczniowie do mnie trafiają. Zaczynamy od prostych zdań na tematy, które Cię interesują, bez poprawiania co drugie słowo.' },
  { question: 'Ile trwają zajęcia i jak często się odbywają?', anwser: 'Najczęściej 60 minut, raz lub dwa razy w tygodniu. Długość i częstotliwość ustalamy przy zapisie, zależnie od celu i wieku ucznia.' },
  { question: 'Czy w Pracowni przygotuję się do matury i certyfikatów?', anwser: 'Tak. Ćwiczymy dokładnie ten format, który czeka ucznia: zadania z arkusza, wypowiedź ustną i pisemną, powtórki pod termin egzaminu.' },
  { question: 'Gdzie odbywają się zajęcia?', anwser: 'W Pracowni przy ulicy Źródlanej 30a w Zielonej Górze, od poniedziałku do piątku w godzinach 7:00 - 19:00. Prowadzę też zajęcia online, więc odległość nie jest przeszkodą.' },
]

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="kicker"><span className="kicker-line" /><span className="kicker-text">{children}</span><span className="kicker-line" /></div>
}

export default function Page() {
  const [open, setOpen] = useState<number[]>([])
  const [mobile, setMobile] = useState(false)
  const [opinionsList, setOpinionsList] = useState<Opinion[]>([]);
  const [cardsPerView, setCardsPerView] = useState(2);
  const [opinionIndex, setOpinionIndex] = useState(0);
  const [contactView, setContactView] = useState<'contact' | 'form'>('contact')
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const totalOpinions = opinionsList.filter((o) => o.visible).length;
  const maxOpinionIndex = Math.max(0, totalOpinions - cardsPerView);
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

const getColorPair = (name: string) => {
  if (!name) return COLOR_PAIRS[0];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PAIRS[Math.abs(hash) % COLOR_PAIRS.length];
};

  // Responsywność karuzeli opinii
  useEffect(() => {
    const updateVisible = () => setCardsPerView(window.innerWidth < 700 ? 1 : 2)
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

  useEffect(() => {
    async function fetchReviews() {
      const googleReviews = await getGoogleReviews();
      if (googleReviews.length > 0) {
        setOpinionsList(googleReviews);
      }
    }
    fetchReviews();
  }, []);


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
  return <main>
    <header className="site-header"><a href="#start" className="logo">Pracownia<br />Megan</a><nav>{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}<a className="phone-pill" href="tel:501486888"><Phone size={17} />501 486 888</a></nav><button className="menu-button" aria-label="Otwórz menu" onClick={() => setMobile(true)}><Menu /></button></header>
    {mobile && <div className="mobile-overlay" onClick={() => setMobile(false)}><div className="mobile-menu" onClick={(e) => e.stopPropagation()}><div className="mobile-menu-top"><span className="logo">Pracownia<br /><strong>MEGAN</strong></span><button aria-label="Zamknij menu" onClick={() => setMobile(false)}><X /></button></div>{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMobile(false)}>{label}</a>)}<a className="button" href="#kontakt" onClick={() => setMobile(false)}>Napisz wiadomość</a></div></div>}
    <div className="location" id="start">Zielona Góra · Źródlana 30a</div>
    <section className="hero"><div className="portrait">
    <Image 
      src={logo} 
      alt="Logo Pracowni Megan"
      width={300}
      height={300}
      priority
    />
  </div><div className="hero-copy"><Kicker>JĘZYK, KTÓRY SPRAWIA FRAJDĘ</Kicker><h1>Przejdź na "ty" <br/>z angielskim</h1><p className="hero-text">
    Kameralne kursy angielskiego w&nbsp;Zielonej Górze.<br />
    Młodzież młodsza i&nbsp;starsza oraz dorośli.<br />
    Zajęcia indywidualne i&nbsp;grupowe<br className="mobile-only" /> do&nbsp;pięciu&nbsp;osób.
  </p>
<div className="hero-actions"><a className="button" href="tel:501486888"><Phone size={18} />501 486 888</a><a className="outline-button" href="#kontakt">Napisz wiadomość</a></div></div></section>
    <section id="o-nas" className="section patterned reveal"><div className="pattern-motifs" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => { const Icon = [CircleHelp, MessageCircle, ThumbsUp][index % 3]; return <Icon key={index} size={index % 3 === 1 ? 32 : 26} strokeWidth={1.35} /> })}</div><div className="pattern-content"><h2>Dlaczego Pracownia Megan?</h2><div className="benefit-grid">{benefits.map(({ title, text, icon: Icon }) => <article className="benefit reveal reveal-delay" key={title}><div className="benefit-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.8} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section id="jak-wygladaja" className="section process-section"><Kicker>BEZ NIESPODZIANEK</Kicker><h2>Jak wyglądają zajęcia?</h2><div className="process-grid" aria-label="Jak wyglądają zajęcia">{processSteps.map(([title, text], index) => <article className="process-step" key={title}><div className="process-number">0{index + 1}</div><h3>{title}</h3><p>{text}</p>{index < processSteps.length - 1 && <ArrowRight className="process-arrow" aria-hidden="true" />}</article>)}</div></section>
    <section id="kursy" className="section courses reveal"><Kicker>DLA KAŻDEGO WIEKU</Kicker><h2>Kursy</h2><div className="course-grid">{courses.map(([title, text, tags, image], index) => 
      <article className={`course reveal course-slide-${(index % 2) === 0 ? 'left' : 'right'}`} key={title as string}>
        {/* Kontener na zdjęcie */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image 
            src={image as string | StaticImageData} 
            fill 
            alt="" 
            className="object-cover" 
          />
        </div>

        <div className="course-copy">
          <h3>{title as string}</h3>
          <p>{text as string}</p>
          <div className="tags">
            {(tags as string[]).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </article>
      )}</div></section>
    <section id="formy" className="section formats"><Kicker>ELASTYCZNIE DLA CIEBIE</Kicker><h2>Formy zajęć</h2><div className="format-list">{formats.map(([title, text], index) => <div className="format-row" key={title}><span className="format-number">0{index + 1}</span><strong>{title}</strong><span>{text}</span></div>)}</div><a className="button" href="#kontakt">Zapytaj o cenę</a></section>
    
    {/* SEKCJA OPINII PODPIĘTA POD STATE */}
    <section id="opinie" className="reviews reveal">
  <h2>Opinie</h2>
  <div className="review-carousel">
    <button 
      className="carousel-arrow" 
      aria-label="Poprzednia opinia" 
      disabled={opinionIndex === 0} 
      onClick={() => setOpinionIndex((index) => Math.max(0, index - 1))}
    >
      <ArrowLeft />
    </button>
    
    <div 
      className="review-viewport"
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const distance = event.changedTouches[0].clientX - touchStart;
        if (Math.abs(distance) > 45) {
          setOpinionIndex((index) => distance < 0 ? Math.min(maxOpinionIndex, index + 1) : Math.max(0, index - 1));
        }
        setTouchStart(null);
      }}
    >
      <div 
        className="review-track" 
        style={{ transform: `translateX(calc(-${opinionIndex} * (var(--opinion-card-width) + var(--opinion-gap))))` }}
      >
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

    <button 
      className="carousel-arrow" 
      aria-label="Następna opinia" 
      disabled={opinionIndex >= maxOpinionIndex} 
      onClick={() => setOpinionIndex((index) => Math.min(maxOpinionIndex, index + 1))}
    >
      <ArrowRight />
    </button>
  </div>

  {/* Kropki nawigacyjne */}
  <div className="opinion-dots" aria-label="Wybierz opinię">
    {Array.from({ length: maxOpinionIndex + 1 }, (_, index) => (
      <button
        type="button"
        key={index}
        className={opinionIndex === index ? 'active' : ''}
        aria-label={`Pokaż zestaw opinii ${index + 1}`}
        aria-current={opinionIndex === index}
        onClick={() => setOpinionIndex(index)}
      />
    ))}
  </div>
</section>

    <section id="pytania" className="section faq reveal"><Kicker>ZANIM ZADZWONISZ</Kicker><h2>Częste pytania</h2>{faqs.map(({ question, anwser }, index) => { const isOpen = open.includes(index); return <div className={`faq-item ${isOpen ? 'active' : ''}`} key={question}><button aria-expanded={isOpen} onClick={() => setOpen((current) => isOpen ? current.filter((item) => item !== index) : [...current, index])}><span>{question}</span><ChevronDown /></button><div className={`faq-answer ${isOpen ? 'is-open' : ''}`}><p>{anwser}</p></div></div> })}</section>
    
    {/* SEKCJA KONTAKTU Z PODPIĘTYM FORMULARZEM RESEND */}
    <section id="kontakt" className="contact reveal">
      <h2>Zapisz się</h2>
      <div className="contact-tabs" role="tablist" aria-label="Zapisz się">
        <button type="button" role="tab" aria-selected={contactView === 'contact'} className={contactView === 'contact' ? 'active' : ''} onClick={() => setContactView('contact')}><Phone aria-hidden="true" />501 486 888</button>
        <button type="button" role="tab" aria-selected={contactView === 'form'} className={contactView === 'form' ? 'active' : ''} onClick={() => setContactView('form')}><Mail aria-hidden="true" />pracowniamegan@gmail.com</button>
      </div>
      <div className={`contact-grid contact-view-${contactView}`}>
        <div className="contact-info" role="tabpanel" tabIndex={0} onClick={() => setContactView('contact')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setContactView('contact') }}>
          <a href="tel:501486888" className="big-phone"><Phone />501 486 888</a>
          <a href="mailto:pracowniamegan@gmail.com" className="email"><Mail />pracowniamegan@gmail.com</a>
          <div className="hours">{['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'].map((day, i) => <div key={day}><span>{day}</span><b>{i < 5 ? '7:00 - 19:00' : 'nieczynne'}</b></div>)}</div>
          <div className="address"><MapPin size={19} />Źródlana 30a<br />65-734 Zielona Góra</div>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10322.726681744294!2d15.510340000000001!3d51.951976!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470613ea8065700d%3A0xf21a9bbfa11be3b0!2zxblyw7NkbGFuYSAzMEEsIDY1LTczNCBaaWVsb25hIEfDs3JhLCBQb2xza2E!5e1!3m2!1spl!2sus!4v1787571751475!5m2!1spl!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>        
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

    <footer><span>Pracownia MEGAN</span><span>© 2026</span></footer>
  </main>
}