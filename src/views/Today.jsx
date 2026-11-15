import { MONTHS, DAYS, DAY_NAMES } from '../data/plan'
import { ymd } from '../srs'

export function currentMonth(start) {
  const days = (Date.now() - new Date(start + 'T00:00:00').getTime()) / 86400000
  return Math.min(12, Math.max(1, Math.floor(days / 30.4) + 1))
}

export default function Today({ S, setS, dueN, learnedN, goto }) {
  const now = new Date()
  const dk = ymd(now)
  const month = currentMonth(S.start)
  const st = MONTHS[month - 1]
  const type = now.getDay() === 3 ? 'wed' : now.getDay() === 4 ? 'thu' : 'work'
  const items = DAYS[type]
  const done = S.done[dk] || []
  const mins = items.reduce((a, x) => a + x.min, 0)
  const doneMins = items.filter((x) => done.includes(x.id)).reduce((a, x) => a + x.min, 0)

  const toggle = (id) => setS((s) => {
    const cur = s.done[dk] || []
    return { ...s, done: { ...s.done, [dk]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } }
  })

  return (
    <>
      <h1>اليوم</h1>
      <div className="stage">
        <div className="top"><b>الشهر {month} من 12</b><span className="pill">{st.cefr}</span></div>
        <div className="msg">قائمة Oxford: {st.oxford} · الهدف: {st.goal}</div>
        <div className="msg">كلمات متعلَّمة {learnedN} من هدف {st.words} هذا الشهر</div>
        <div className="bar"><i style={{ width: `${Math.min(100, (100 * learnedN) / st.words)}%` }} /></div>
      </div>

      <div className="top"><b>{DAY_NAMES[type]}</b><span>{doneMins} / {mins} د</span></div>
      <ul className="list">
        {items.map((x) => (
          <li key={x.id}>
            <label>
              <input type="checkbox" checked={done.includes(x.id)} onChange={() => toggle(x.id)} />
              <span>{x.t}</span>
              <small>{x.min} د</small>
            </label>
            {x.go && <button className="link" onClick={() => goto(x.go)}>فتح</button>}
          </li>
        ))}
      </ul>

      <div className="stats">
        <div className="st"><b>{dueN}</b><span>بطاقات مستحقة</span></div>
        <div className="st"><b>{S.streak}</b><span>أيام متتالية</span></div>
        <div className="st"><b>{Object.keys(S.done).length}</b><span>أيام مسجلة</span></div>
      </div>
      <p className="msg">قاعدة الحد الأدنى: في اليوم المزدحم اكتفِ بالسماع في الذهاب ومراجعة البطاقات (30 د).</p>
    </>
  )
}
