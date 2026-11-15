import { useState, useEffect } from 'react'
import { today, newCard, gradeCard, touch } from '../srs'
import { lookup, links, speak } from '../lib/dict'

const LV = ['A1', 'A2', 'B1', 'B2', 'C1']
const rank = (l) => { const i = LV.indexOf(l); return i < 0 ? 9 : i }

// يقبل: JSON (مصفوفة نصوص أو كائنات) أو نصًا بسطر لكل كلمة مع مستوى اختياري مثل: about, A1
function parseList(text, name) {
  let arr
  if (name.toLowerCase().endsWith('.json')) {
    arr = JSON.parse(text).map((x) => typeof x === 'string' ? { w: x } : {
      w: x.word || x.w, lvl: x.level || x.cefr || x.lvl || '',
      ar: x.ar || '', ex: x.example || x.ex || '', exAr: x.example_ar || x.exAr || ''
    })
  } else {
    arr = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
      const lvl = (l.match(/\b([ABC][12])\b/i) || [])[1] || ''
      return { w: l.replace(/\b[ABC][12]\b/gi, '').split(/[,\t;]/)[0].trim(), lvl: lvl.toUpperCase() }
    })
  }
  const seen = new Set()
  return arr
    .filter((x) => x.w && !seen.has(x.w.toLowerCase()) && seen.add(x.w.toLowerCase()))
    .map((x) => ({ w: x.w, lvl: x.lvl || '', ar: x.ar || '', ex: x.ex || '', exAr: x.exAr || '' }))
    .sort((a, b) => rank(a.lvl) - rank(b.lvl))
}

function Detail({ w, auto }) {
  const [info, setInfo] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const load = async () => {
    setBusy(true); setErr('')
    try { setInfo(await lookup(w.w)) } catch { setErr('تعذر جلب التعريف (لا اتصال أو كلمة غير موجودة). استعمل الروابط.') }
    setBusy(false)
  }
  useEffect(() => { setInfo(null); setErr(''); if (auto) load() }, [w.w])
  const L = links(w.w)
  const play = () => info && info.audio ? new Audio(info.audio).play().catch(() => speak(w.w)) : speak(w.w)

  return (
    <div className="detail">
      {info && (
        <>
          {info.ipa && <div className="ipa">{info.ipa}</div>}
          {info.meanings.map((m, i) => (
            <div key={i} className="mean"><b>{m.pos}</b> {m.def}{m.ex && <div className="ex">{m.ex}</div>}</div>
          ))}
        </>
      )}
      {!info && !busy && <button className="link" onClick={load}>عرض التعريف الإنجليزي</button>}
      {busy && <div className="msg">جارٍ الجلب…</div>}
      {err && <div className="msg">{err}</div>}
      <button className="say" onClick={play}>استمع</button>
      <div className="srcs">
        <a href={L.oxford} target="_blank" rel="noopener noreferrer">Oxford</a>
        <a href={L.cambridge} target="_blank" rel="noopener noreferrer">Cambridge</a>
        <a href={L.youglish} target="_blank" rel="noopener noreferrer">YouGlish</a>
      </div>
    </div>
  )
}

function Face({ w }) {
  return (
    <>
      <div className="word">{w.w}</div>
      {w.lvl && <span className="pill">{w.lvl}</span>}
      {w.ar && <div className="ar">{w.ar}</div>}
      {w.ex && <><div className="ex">{w.ex}</div><div className="exa">{w.exAr}</div></>}
    </>
  )
}

export default function Vocab({ S, setS, words, setWords }) {
  const [mode, setMode] = useState('home')
  const [queue, setQueue] = useState([])
  const [cur, setCur] = useState(0)
  const [shown, setShown] = useState(false)
  const [note, setNote] = useState('')

  const key = (w) => w.w.toLowerCase()
  const due = words.filter((w) => S.p[key(w)] && S.p[key(w)].due <= today())
  const fresh = words.filter((w) => !S.p[key(w)])
  const left = Math.max(0, S.perDay - (S.nt.d === today() ? S.nt.n : 0))
  const newN = Math.min(left, fresh.length)
  const mastered = words.filter((w) => S.p[key(w)] && S.p[key(w)].st === 'm').length

  const start = (m) => { setQueue(m === 'learn' ? fresh.slice(0, left) : due); setCur(0); setShown(false); setNote(''); setMode(m) }
  const next = () => {
    if (cur + 1 >= queue.length) { setMode('home'); setNote('أحسنت، انتهت الجلسة.') } else setCur(cur + 1)
    setShown(false)
  }
  const learn = () => {
    const w = queue[cur]
    setS((s) => { const t = touch(s); return { ...t, p: { ...t.p, [key(w)]: newCard() }, nt: { d: today(), n: (s.nt.d === today() ? s.nt.n : 0) + 1 } } })
    next()
  }
  const grade = (r) => {
    const w = queue[cur]
    setS((s) => { const t = touch(s); return { ...t, p: { ...t.p, [key(w)]: gradeCard(t.p[key(w)], r) } } })
    next()
  }
  const onFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      try {
        const a = parseList(r.result, f.name)
        if (!a.length) throw new Error('empty')
        setWords(a); setNote(`تم استيراد ${a.length} كلمة. التقدم المحفوظ للكلمات نفسها باقٍ.`)
      } catch { setNote('تعذر قراءة الملف. استخدم JSON أو نصًا بسطر لكل كلمة (يمكن إضافة المستوى مثل A1).') }
    }
    r.readAsText(f); e.target.value = ''
  }

  if (mode === 'home') {
    return (
      <>
        <h1>المفردات</h1>
        <div className="stats">
          <div className="st"><b>{due.length}</b><span>مستحقة</span></div>
          <div className="st"><b>{mastered}/{words.length}</b><span>متقنة</span></div>
          <div className="st"><b>{newN}</b><span>جديدة اليوم</span></div>
        </div>
        <button className="btn" disabled={!due.length} onClick={() => start('review')}>راجع {due.length} كلمة</button>
        <button className="btn alt" disabled={!newN} onClick={() => start('learn')}>تعلّم {newN} كلمة جديدة</button>
        <p className="msg">{note || 'الكلمات بترتيب مستوى Oxford. الكلمة بلا ترجمة عربية تعرض تعريفها الإنجليزي من القاموس.'}</p>
        <label className="link">
          استيراد قائمة (JSON أو نص)
          <input type="file" accept=".json,.txt,.csv,text/plain,application/json" hidden onChange={onFile} />
        </label>
      </>
    )
  }

  const w = queue[cur]
  return (
    <>
      <div className="top"><button className="link" onClick={() => setMode('home')}>رجوع</button><span>{cur + 1} / {queue.length}</span></div>
      <div className="bar"><i style={{ width: `${(100 * cur) / queue.length}%` }} /></div>
      {mode === 'learn' ? (
        <>
          <div className="card"><Face w={w} /><Detail w={w} auto={!w.ar} /></div>
          <button className="btn" onClick={learn}>تعلّمتها</button>
        </>
      ) : !shown ? (
        <div className="card fc" tabIndex={0} onClick={() => setShown(true)} onKeyDown={(e) => e.key === 'Enter' && setShown(true)}>
          <div className="word">{w.w}</div>
          <div className="hint">اضغط لإظهار المعنى</div>
        </div>
      ) : (
        <>
          <div className="card"><Face w={w} /><Detail w={w} auto={!w.ar} /></div>
          <div className="row">
            <button className="btn bad" onClick={() => grade('again')}>لم أتذكر</button>
            <button className="btn alt" onClick={() => grade('hard')}>بصعوبة</button>
            <button className="btn" onClick={() => grade('good')}>تذكرتها</button>
          </div>
        </>
      )}
    </>
  )
}
