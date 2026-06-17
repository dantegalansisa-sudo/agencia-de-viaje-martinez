import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FlightSearchWidget.css';

type TripType = 'roundtrip' | 'oneway' | 'multi';
type ServiceTab = 'vuelos' | 'hoteles' | 'paquetes' | 'cruceros';
interface Leg { origin: string; destination: string; date: string }

/* ---- Airport data ---- */
const airports = [
  { code: 'SDQ', city: 'Santo Domingo', country: 'Rep. Dominicana' },
  { code: 'STI', city: 'Santiago', country: 'Rep. Dominicana' },
  { code: 'PUJ', city: 'Punta Cana', country: 'Rep. Dominicana' },
  { code: 'POP', city: 'Puerto Plata', country: 'Rep. Dominicana' },
  { code: 'JFK', city: 'New York (JFK)', country: 'Estados Unidos' },
  { code: 'EWR', city: 'Newark (EWR)', country: 'Estados Unidos' },
  { code: 'MIA', city: 'Miami', country: 'Estados Unidos' },
  { code: 'FLL', city: 'Fort Lauderdale', country: 'Estados Unidos' },
  { code: 'MCO', city: 'Orlando', country: 'Estados Unidos' },
  { code: 'BOS', city: 'Boston', country: 'Estados Unidos' },
  { code: 'ATL', city: 'Atlanta', country: 'Estados Unidos' },
  { code: 'IAD', city: 'Washington D.C.', country: 'Estados Unidos' },
  { code: 'PHL', city: 'Philadelphia', country: 'Estados Unidos' },
  { code: 'CLT', city: 'Charlotte', country: 'Estados Unidos' },
  { code: 'BOG', city: 'Bogotá', country: 'Colombia' },
  { code: 'MDE', city: 'Medellín', country: 'Colombia' },
  { code: 'CTG', city: 'Cartagena', country: 'Colombia' },
  { code: 'PTY', city: 'Panamá City', country: 'Panamá' },
  { code: 'SJO', city: 'San José', country: 'Costa Rica' },
  { code: 'CUN', city: 'Cancún', country: 'México' },
  { code: 'MEX', city: 'Ciudad de México', country: 'México' },
  { code: 'CUR', city: 'Curazao', country: 'Antillas' },
  { code: 'AUA', city: 'Aruba', country: 'Antillas' },
  { code: 'SXM', city: 'St. Maarten', country: 'Antillas' },
  { code: 'SJU', city: 'San Juan', country: 'Puerto Rico' },
  { code: 'HAV', city: 'La Habana', country: 'Cuba' },
  { code: 'MAD', city: 'Madrid', country: 'España' },
  { code: 'BCN', city: 'Barcelona', country: 'España' },
  { code: 'LIM', city: 'Lima', country: 'Perú' },
  { code: 'SCL', city: 'Santiago', country: 'Chile' },
  { code: 'GRU', city: 'São Paulo', country: 'Brasil' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina' },
];

const popularRoutes = [
  { from: 'Santo Domingo (SDQ)', to: 'New York (JFK)', label: 'SDQ → JFK' },
  { from: 'Santo Domingo (SDQ)', to: 'Miami (MIA)', label: 'SDQ → MIA' },
  { from: 'Santiago (STI)', to: 'New York (JFK)', label: 'STI → JFK' },
  { from: 'Punta Cana (PUJ)', to: 'Miami (MIA)', label: 'PUJ → MIA' },
  { from: 'Santo Domingo (SDQ)', to: 'Bogotá (BOG)', label: 'SDQ → BOG' },
];

const serviceTabs: { key: ServiceTab; label: string; icon: string }[] = [
  { key: 'vuelos', label: 'Vuelos', icon: '✈' },
  { key: 'hoteles', label: 'Hoteles', icon: '🏨' },
  { key: 'paquetes', label: 'Paquetes', icon: '📦' },
  { key: 'cruceros', label: 'Cruceros', icon: '🚢' },
];

/* ---- Autocomplete component ---- */
function AirportInput({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displayValue = value || query;

  const filtered = query.length > 0
    ? airports.filter(a =>
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : airports.slice(0, 8);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (a: typeof airports[0]) => {
    onChange(`${a.city} (${a.code})`);
    setQuery('');
    setFocused(false);
  };

  return (
    <div className="widget-field widget-field--grow autocomplete-wrapper" ref={wrapperRef}>
      <label className="widget-input-label">{label}</label>
      <input
        className="widget-input"
        placeholder={placeholder}
        value={focused ? query : displayValue}
        onChange={e => { setQuery(e.target.value); onChange(''); }}
        onFocus={() => { setFocused(true); setQuery(''); }}
      />
      <AnimatePresence>
        {focused && (
          <motion.div
            className="autocomplete-dropdown"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {filtered.length > 0 ? filtered.map(a => (
              <button key={a.code} className="autocomplete-item" onClick={() => handleSelect(a)}>
                <span className="autocomplete-code">{a.code}</span>
                <div className="autocomplete-info">
                  <span className="autocomplete-city">{a.city}</span>
                  <span className="autocomplete-country">{a.country}</span>
                </div>
              </button>
            )) : (
              <div className="autocomplete-empty">Sin resultados</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Main Widget ---- */
export default function FlightSearchWidget() {
  const [serviceTab, setServiceTab] = useState<ServiceTab>('vuelos');
  const [tripType, setTripType] = useState<TripType>('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [businessClass, setBusinessClass] = useState(false);
  const [includeBaggage, setIncludeBaggage] = useState(false);
  const [flexDates, setFlexDates] = useState(false);
  const [showPax, setShowPax] = useState(false);
  const [legs, setLegs] = useState<Leg[]>([{ origin: '', destination: '', date: '' }]);
  const [swapped, setSwapped] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const paxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (paxRef.current && !paxRef.current.contains(e.target as Node)) setShowPax(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const swap = () => { setOrigin(destination); setDestination(origin); setSwapped(!swapped); };

  const updateLeg = (i: number, field: keyof Leg, val: string) => {
    setLegs(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  };
  const addLeg = () => { if (legs.length < 4) setLegs([...legs, { origin: '', destination: '', date: '' }]); };
  const removeLeg = (i: number) => { if (legs.length > 1) setLegs(legs.filter((_, idx) => idx !== i)); };

  const paxText = useCallback(() => {
    const parts: string[] = [];
    parts.push(`${adults} Adulto${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Niño${children > 1 ? 's' : ''}`);
    if (babies > 0) parts.push(`${babies} Bebé${babies > 1 ? 's' : ''}`);
    return parts.join(', ');
  }, [adults, children, babies]);

  const search = () => {
    let msg = `✈️ *SOLICITUD DE COTIZACIÓN — Agencia de Viajes Martínez*\n\n`;
    msg += `📋 *Tipo de viaje:* ${tripType === 'roundtrip' ? 'Ida y Vuelta' : tripType === 'oneway' ? 'Solo Ida' : 'Multi-trayecto'}\n`;
    if (tripType !== 'multi') {
      if (origin) msg += `🛫 *Origen:* ${origin}\n`;
      if (destination) msg += `🛬 *Destino:* ${destination}\n`;
      if (departDate) msg += `📅 *Fecha de ida:* ${departDate}\n`;
      if (tripType === 'roundtrip' && returnDate) msg += `📅 *Fecha de vuelta:* ${returnDate}\n`;
    } else {
      legs.forEach((l, i) => {
        if (l.origin || l.destination) {
          msg += `\n🔹 *Trayecto ${i + 1}:* ${l.origin || '—'} → ${l.destination || '—'} | ${l.date || 'Sin fecha'}\n`;
        }
      });
    }
    msg += `\n👥 *Pasajeros:* ${paxText()}`;
    if (businessClass) msg += `\n💼 *Clase:* Business`;
    if (includeBaggage) msg += `\n🧳 *Incluir maleta:* Sí`;
    if (flexDates) msg += `\n📅 *Fechas flexibles:* Sí`;
    msg += `\n\n_Enviado desde myjtravels.com_`;
    window.open(`https://wa.me/18095293515?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleServiceTab = (tab: ServiceTab) => {
    if (tab !== 'vuelos') {
      const labels: Record<ServiceTab, string> = {
        vuelos: '', hoteles: 'hoteles', paquetes: 'paquetes de viaje', cruceros: 'cruceros',
      };
      window.open(`https://wa.me/18095293515?text=${encodeURIComponent(`Hola Agencia de Viajes Martínez! Me interesa información sobre ${labels[tab]}.`)}`, '_blank');
    }
    setServiceTab(tab);
  };

  const fillRoute = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
    if (tripType === 'multi') setTripType('roundtrip');
    setMobileExpanded(true);
  };

  const tripTabs: { key: TripType; label: string }[] = [
    { key: 'roundtrip', label: 'Ida y Vuelta' },
    { key: 'oneway', label: 'Solo Ida' },
    { key: 'multi', label: 'Multi-trayecto' },
  ];

  return (
    <motion.div
      className="flight-widget"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
    >
      {/* Service Tabs */}
      <div className="service-tabs">
        {serviceTabs.map(s => (
          <button
            key={s.key}
            className={`service-tab${serviceTab === s.key ? ' active' : ''}`}
            onClick={() => handleServiceTab(s.key)}
          >
            <span className="service-tab__icon">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Mobile compact trigger */}
      <button className="mobile-search-trigger" onClick={() => setMobileExpanded(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        {origin && destination ? `${origin} → ${destination}` : '¿A dónde quieres volar?'}
      </button>

      {/* Widget body */}
      <div className={`widget-body${mobileExpanded ? ' widget-body--expanded' : ''}`}>
        {/* Trip type tabs */}
        <div className="trip-tabs">
          {tripTabs.map(t => (
            <button key={t.key} className={`trip-tab${tripType === t.key ? ' active' : ''}`} onClick={() => setTripType(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {tripType !== 'multi' ? (
            <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="widget-main-row">
                <AirportInput label="Origen" placeholder="Ciudad o aeropuerto" value={origin} onChange={setOrigin} />
                <button className="swap-btn" onClick={swap} style={{ transform: swapped ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-label="Intercambiar">⇄</button>
                <AirportInput label="Destino" placeholder="Ciudad o aeropuerto" value={destination} onChange={setDestination} />
                <div className="widget-field">
                  <label className="widget-input-label">Ida</label>
                  <input className="widget-input widget-input--date" type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} />
                </div>
                <AnimatePresence>
                  {tripType === 'roundtrip' && (
                    <motion.div className="widget-field" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                      <label className="widget-input-label">Vuelta</label>
                      <input className="widget-input widget-input--date" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="pax-wrapper" ref={paxRef}>
                  <label className="widget-input-label">Pasajeros</label>
                  <button className="widget-input pax-trigger" onClick={() => setShowPax(!showPax)}>
                    {paxText()}<span className="pax-arrow">▾</span>
                  </button>
                  <AnimatePresence>
                    {showPax && (
                      <motion.div className="pax-dropdown" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        <PaxRow label="Adultos" sub="12+ años" value={adults} min={1} max={9} onChange={setAdults} />
                        <PaxRow label="Niños" sub="2-11 años" value={children} min={0} max={6} onChange={setChildren} />
                        <PaxRow label="Bebés" sub="0-1 año" value={babies} min={0} max={4} onChange={setBabies} />
                        <button className="pax-confirm" onClick={() => setShowPax(false)}>Confirmar</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="multi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <AnimatePresence>
                {legs.map((leg, i) => (
                  <motion.div className="widget-row widget-row--multi" key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <div className="widget-field widget-field--grow">
                      <label className="widget-input-label">Origen {i + 1}</label>
                      <input className="widget-input" placeholder="Ciudad" value={leg.origin} onChange={e => updateLeg(i, 'origin', e.target.value)} />
                    </div>
                    <div className="widget-field widget-field--grow">
                      <label className="widget-input-label">Destino {i + 1}</label>
                      <input className="widget-input" placeholder="Ciudad" value={leg.destination} onChange={e => updateLeg(i, 'destination', e.target.value)} />
                    </div>
                    <div className="widget-field">
                      <label className="widget-input-label">Fecha</label>
                      <input className="widget-input widget-input--date" type="date" value={leg.date} onChange={e => updateLeg(i, 'date', e.target.value)} />
                    </div>
                    {legs.length > 1 && <button className="remove-leg-btn" onClick={() => removeLeg(i)} aria-label="Eliminar">✕</button>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {legs.length < 4 && <button className="add-leg-btn" onClick={addLeg}>+ Agregar trayecto</button>}
              <div className="widget-row">
                <div className="pax-wrapper pax-wrapper--multi" ref={paxRef}>
                  <label className="widget-input-label">Pasajeros</label>
                  <button className="widget-input pax-trigger" onClick={() => setShowPax(!showPax)}>{paxText()} <span className="pax-arrow">▾</span></button>
                  <AnimatePresence>
                    {showPax && (
                      <motion.div className="pax-dropdown" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        <PaxRow label="Adultos" sub="12+ años" value={adults} min={1} max={9} onChange={setAdults} />
                        <PaxRow label="Niños" sub="2-11 años" value={children} min={0} max={6} onChange={setChildren} />
                        <PaxRow label="Bebés" sub="0-1 año" value={babies} min={0} max={4} onChange={setBabies} />
                        <button className="pax-confirm" onClick={() => setShowPax(false)}>Confirmar</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options + CTA */}
        <div className="widget-bottom">
          <div className="widget-checks">
            <Checkbox checked={businessClass} onChange={setBusinessClass} label="Business Class" />
            <Checkbox checked={includeBaggage} onChange={setIncludeBaggage} label="Incluir Maleta" />
            <Checkbox checked={flexDates} onChange={setFlexDates} label="Fechas Flexibles" />
          </div>
          <button className="search-btn" onClick={search}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Cotizar por WhatsApp
          </button>
        </div>

        {/* Mobile close */}
        <button className="mobile-close-widget" onClick={() => setMobileExpanded(false)}>Cerrar</button>
      </div>

      {/* Popular routes */}
      <div className="popular-routes">
        <span className="popular-routes__label">Popular:</span>
        {popularRoutes.map(r => (
          <button key={r.label} className="popular-routes__pill" onClick={() => fillRoute(r.from, r.to)}>{r.label}</button>
        ))}
      </div>
    </motion.div>
  );
}

function PaxRow({ label, sub, value, min, max, onChange }: { label: string; sub: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="pax-row">
      <div>
        <div className="pax-label">{label}</div>
        <div className="pax-sublabel">{sub}</div>
      </div>
      <div className="pax-controls">
        <button className="pax-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
        <span className="pax-count">{value}</span>
        <button className="pax-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="widget-checkbox">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="checkbox-custom" />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}
