// اتصال بالمصادر: قاموس مجاني (Free Dictionary API) + روابط مباشرة لـ Oxford وCambridge وYouGlish
const K = (w) => 'ej1d:' + w.toLowerCase()

export async function lookup(word) {
  try { const c = localStorage.getItem(K(word)); if (c) return JSON.parse(c) } catch {}
  const r = await fetch('https://api.dictionaryapi.dev/v2/entries/en/' + encodeURIComponent(word))
  if (!r.ok) throw new Error('not found')
  const e = (await r.json())[0]
  const phon = e.phonetics || []
  const out = {
    ipa: e.phonetic || (phon.find((p) => p.text) || {}).text || '',
    audio: (phon.find((p) => p.audio) || {}).audio || '',
    meanings: (e.meanings || []).slice(0, 3).map((m) => ({
      pos: m.partOfSpeech,
      def: (m.definitions[0] || {}).definition,
      ex: (m.definitions.find((d) => d.example) || {}).example
    }))
  }
  try { localStorage.setItem(K(word), JSON.stringify(out)) } catch {}
  return out
}

export const links = (w) => {
  const q = encodeURIComponent(w)
  return {
    oxford: `https://www.oxfordlearnersdictionaries.com/search/english/?q=${q}`,
    cambridge: `https://dictionary.cambridge.org/search/english/direct/?q=${q}`,
    youglish: `https://youglish.com/pronounce/${q}/english`
  }
}

export function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    speechSynthesis.cancel(); speechSynthesis.speak(u)
  } catch {}
}
