import { useState } from 'react'
import { band, today } from '../srs'

const num = (v) => Math.min(9, Math.max(0, Math.round(Number(v) * 2) / 2 || 0))

export default function Progress({ S, setS }) {
  const [f, setF] = useState({ l: '', r: '', w: '', s: '' })
  const [err, setErr] = useState('')
  const [text, setText] = useState('')

  const addMock = () => {
    const m = { l: num(f.l), r: num(f.r), w: num(f.w), s: num(f.s) }
    if ([f.l, f.r, f.w, f.s].some((v) => v === '')) return setErr('أدخل الدرجات الأربع.')
    setErr('')
    setS((s) => ({ ...s, mocks: [...s.mocks, { id: Date.now(), date: today(), ...m, overall: band(m.l, m.r, m.w, m.s) }] }))
    setF({ l: '', r: '', w: '', s: '' })
  }
  const last2 = S.mocks.slice(-2)
  const ready = last2.length === 2 && last2.every((m) => m.overall >= S.target && Math.min(m.l, m.r, m.w, m.s) >= S.target - 0.5)

  const addErr = () => {
    if (!text.trim()) return
    setS((s) => ({ ...s, errors: [{ id: Date.now(), date: today(), text: text.trim() }, ...s.errors] }))
    setText('')
  }

  return (
    <>
      <h1>التقدم</h1>

      <h2>اختبارات IELTS التجريبية</h2>
      <div className="grid4">
        {[['l', 'استماع'], ['r', 'قراءة'], ['w', 'كتابة'], ['s', 'كلام']].map(([k, t]) => (
          <label key={k}>{t}
            <input type="number" min="0" max="9" step="0.5" inputMode="decimal" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      {err && <p className="msg">{err}</p>}
      <button className="btn" onClick={addMock}>أضف نتيجة</button>
      <ul className="list">
        {S.mocks.slice().reverse().map((m) => (
          <li key={m.id}>
            <span>{m.date} · L{m.l} R{m.r} W{m.w} S{m.s}</span>
            <span className="pill">{m.overall}</span>
            <button className="link" onClick={() => setS((s) => ({ ...s, mocks: s.mocks.filter((x) => x.id !== m.id) }))}>حذف</button>
          </li>
        ))}
      </ul>
      <p className="verdict">
        {S.mocks.length < 2 ? 'تحتاج تجريبيين كاملين على الأقل لتقييم الجاهزية.'
          : ready ? 'جاهز: تجريبيان متتاليان حققا الدرجة المطلوبة وكل مهارة ضمن نصف درجة منها. يمكنك حجز الاختبار الحقيقي.'
            : 'لم تتحقق الجاهزية بعد. القاعدة: تجريبيان متتاليان بالدرجة المطلوبة ولا مهارة أقل منها بأكثر من نصف درجة.'}
      </p>

      <h2>سجل الأخطاء</h2>
      <textarea rows="2" value={text} placeholder="الخطأ ← الصيغة الصحيحة" onChange={(e) => setText(e.target.value)} />
      <button className="btn alt" onClick={addErr}>أضف</button>
      <ul className="list">
        {S.errors.map((e) => (
          <li key={e.id}>
            <span dir="auto">{e.text}</span><small>{e.date}</small>
            <button className="link" onClick={() => setS((s) => ({ ...s, errors: s.errors.filter((x) => x.id !== e.id) }))}>حذف</button>
          </li>
        ))}
      </ul>

      <h2>الإعدادات</h2>
      <div className="grid3">
        <label>تاريخ البدء<input type="date" value={S.start} onChange={(e) => setS({ ...S, start: e.target.value })} /></label>
        <label>الدرجة المطلوبة<input type="number" min="4" max="9" step="0.5" value={S.target} onChange={(e) => setS({ ...S, target: Number(e.target.value) || 6.5 })} /></label>
        <label>كلمات يوميًا<input type="number" min="5" max="40" value={S.perDay} onChange={(e) => setS({ ...S, perDay: Number(e.target.value) || 15 })} /></label>
      </div>
    </>
  )
}
