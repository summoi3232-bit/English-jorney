import { RESOURCES } from '../data/plan'
import { currentMonth } from './Today'

export default function Sources({ S }) {
  const month = currentMonth(S.start)
  const groups = [...new Set(RESOURCES.map((r) => r.g))]
  return (
    <>
      <h1>المصادر</h1>
      <p className="msg">المميّز بنجمة مناسب لشهرك الحالي ({month}). الروابط تفتح في صفحة جديدة.</p>
      {groups.map((g) => (
        <section key={g}>
          <h2>{g}</h2>
          <ul className="list">
            {RESOURCES.filter((r) => r.g === g).map((r) => {
              const fit = month >= r.m[0] && month <= r.m[1]
              return (
                <li key={r.u} className={fit ? '' : 'dim'}>
                  <a href={r.u} target="_blank" rel="noopener noreferrer">{fit ? '★ ' : ''}{r.n}</a>
                  <small>{r.d}</small>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </>
  )
}
