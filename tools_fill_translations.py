#!/usr/bin/env python3
"""
يملأ الحقول ar و example و example_ar في ملف JSON الناتج عن build_wordlist.py
بدفعات، ويحفظ بعد كل دفعة (يمكن إيقافه ومتابعته لاحقًا).

    pip install anthropic
    export ANTHROPIC_API_KEY=...
    python tools_fill_translations.py --lang tr --file tr_words.json

راجع الناتج بنفسك: الترجمة الآلية للكلمات المفردة قد تخطئ في المعنى الأشهر.
"""
import argparse, json, os, re, sys, time
import anthropic

NAMES = {"en": "الإنجليزية", "tr": "التركية"}
PROMPT = """أنت مساعد لتعليم اللغات. لكل كلمة (جذر) من اللغة {lang} في القائمة أعد:
- ar: ترجمة عربية موجزة (المعنى أو المعنيان الأشهر؛ للفعل صيغة المضارع المفرد)
- example: جملة قصيرة وبسيطة (مستوى A1-A2) بنفس اللغة تستعمل الكلمة بمعناها الأشهر
- example_ar: ترجمة الجملة إلى العربية
أعد JSON فقط: مصفوفة كائنات بالمفاتيح word و ar و example و example_ar بنفس ترتيب الكلمات، بلا شرح ولا Markdown.
الكلمات: {words}"""


def parse(text):
    m = re.search(r"\[.*\]", text, re.S)
    return json.loads(m.group(0))


def save(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", choices=["en", "tr"], required=True)
    ap.add_argument("--file", required=True)
    ap.add_argument("--batch", type=int, default=40)
    ap.add_argument("--limit", type=int, default=0, help="عدد الكلمات للتجربة")
    ap.add_argument("--model", default="claude-sonnet-5-5")
    a = ap.parse_args()

    data = json.load(open(a.file, encoding="utf-8"))
    todo = [x for x in data if not x.get("ar")]
    if a.limit:
        todo = todo[: a.limit]
    client = anthropic.Anthropic()
    done = 0

    for i in range(0, len(todo), a.batch):
        chunk = todo[i : i + a.batch]
        prompt = PROMPT.format(lang=NAMES[a.lang], words=json.dumps([x["word"] for x in chunk], ensure_ascii=False))
        for attempt in range(3):
            try:
                r = client.messages.create(model=a.model, max_tokens=4000, messages=[{"role": "user", "content": prompt}])
                out = {o["word"]: o for o in parse(r.content[0].text)}
                break
            except Exception as e:
                print("retry:", e, file=sys.stderr)
                time.sleep(2 * (attempt + 1))
        else:
            sys.exit("فشلت الدفعة؛ أعد التشغيل للمتابعة من حيث توقفت.")
        for x in chunk:
            o = out.get(x["word"])
            if o and o.get("ar"):
                x["ar"], x["example"], x["example_ar"] = o["ar"], o.get("example", ""), o.get("example_ar", "")
                done += 1
        save(a.file, data)
        print(f"{done}/{len(todo)}")


if __name__ == "__main__":
    main()
