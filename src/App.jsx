import { useState } from 'react'
import { SEED } from './data/seed'
import { useStored } from './store'
import { today } from './srs'
import Today from './views/Today'
import Vocab from './views/Vocab'
import Sources from './views/Sources'
import Progress from './views/Progress'

const TABS = [['today', 'اليوم'], ['vocab', 'المفردات'], ['src', 'المصادر'], ['prog', 'التقدم']]

export default function App() {
  const [S, setS] = useStored('ej1', {
    start: today(), perDay: 15, target: 6.5,
    p: {}, nt: { d: '', n: 0 }, streak: 0, last: '', done: {}, mocks: [], errors: []
  })
  const [W, setW] = useStored('ej1w', { list: SEED })
  const [tab, setTab] = useState(() => {
    const t = new URLSearchParams(window.location.search).get('tab')
    return TABS.some(([k]) => k === t) ? t : 'today'
  })
  const words = W.list
  const key = (w) => w.w.toLowerCase()
  const dueN = words.filter((w) => S.p[key(w)] && S.p[key(w)].due <= today()).length
  const learnedN = words.filter((w) => S.p[key(w)]).length

  return (
    <>
      <main className="app">
        {tab === 'today' && <Today S={S} setS={setS} dueN={dueN} learnedN={learnedN} goto={setTab} />}
        {tab === 'vocab' && <Vocab S={S} setS={setS} words={words} setWords={(list) => setW({ list })} />}
        {tab === 'src' && <Sources S={S} />}
        {tab === 'prog' && <Progress S={S} setS={setS} />}
      </main>
      <nav className="nav">
        {TABS.map(([k, t]) => (
          <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}>
            {t}{k === 'vocab' && dueN > 0 ? <i className="dot">{dueN}</i> : null}
          </button>
        ))}
      </nav>
    </>
  )
}
