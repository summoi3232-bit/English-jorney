// التكرار المتباعد: دوال نقية سهلة الاختبار
export const STEPS = [1, 3, 7, 14, 30, 60, 120]

const pad = (n) => String(n).padStart(2, '0')
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const today = () => ymd(new Date())
export const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d) }

export const newCard = () => ({ i: 0, due: addDays(1), st: 'l', l: 0 })

// result: 'good' | 'hard' | 'again'
export function gradeCard(p, result) {
  let i = p.i, l = p.l || 0
  if (result === 'good') i = Math.min(i + 1, STEPS.length - 1)
  if (result === 'again') { i = 0; l += 1 }
  return { i, l, due: addDays(STEPS[i]), st: STEPS[i] >= 30 ? 'm' : 'l' }
}

// تحديث سلسلة الأيام المتتالية
export const touch = (s) => s.last === today() ? s
  : { ...s, streak: s.last === addDays(-1) ? s.streak + 1 : 1, last: today() }

// نطاق IELTS: متوسط المهارات الأربع بتقريب نصف درجة
export const band = (a, b, c, d) => Math.round(((a + b + c + d) / 4) * 2) / 2
