#!/usr/bin/env python3
"""
بناء قائمة كلمات شائعة (بالجذر) للإنجليزية أو التركية.

التثبيت:
    pip install simplemma

المدخلات: ملف تردد بصيغة "كلمة عدد" في كل سطر
(مثل ملفات hermitdave/FrequencyWords: en_full.txt و tr_full.txt)

أمثلة:
    python build_wordlist.py --lang tr --input tr_full.txt --top 2000 --out tr_words.json
    python build_wordlist.py --lang en --input en_full.txt --top 2000 --out en_words.json
"""
import argparse
import json
import re
from collections import Counter

import simplemma

WORD_RE = {
    "en": re.compile(r"^[a-z]+$"),
    "tr": re.compile(r"^[a-zçğıöşü]+$"),
}


def lower(word: str, lang: str) -> str:
    # التركية: I -> ı و İ -> i (lower() العادية تخطئ فيهما)
    if lang == "tr":
        word = word.replace("I", "ı").replace("İ", "i")
    return word.lower()


def build(path: str, lang: str, top: int):
    lemma_counts = Counter()
    forms = {}  # lemma -> أكثر شكل ظاهر تكرارًا (للأمثلة)

    with open(path, encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) != 2 or not parts[1].isdigit():
                continue
            raw, count = lower(parts[0], lang), int(parts[1])
            if not WORD_RE[lang].match(raw) or len(raw) < 2 and raw not in ("a", "i", "o", "e"):
                continue
            lemma = simplemma.lemmatize(raw, lang=lang)
            lemma_counts[lemma] += count
            forms.setdefault(lemma, Counter())[raw] += count

    total = sum(lemma_counts.values())
    result, cumulative = [], 0
    for rank, (lemma, count) in enumerate(lemma_counts.most_common(top), 1):
        cumulative += count
        result.append({
            "rank": rank,
            "word": lemma,
            "count": count,
            "coverage": round(100 * cumulative / total, 2),
            "forms": [w for w, _ in forms[lemma].most_common(4)],
            "ar": "",  # الترجمة العربية
            "example": "",
        })
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", choices=["en", "tr"], required=True)
    ap.add_argument("--input", required=True)
    ap.add_argument("--top", type=int, default=2000)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    words = build(args.input, args.lang, args.top)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=1)
    print(f"تم: {len(words)} كلمة -> {args.out} (تغطية {words[-1]['coverage']}%)")


if __name__ == "__main__":
    main()
