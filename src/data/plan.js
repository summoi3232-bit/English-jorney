// خطة الأشهر الاثني عشر (من المنهج): [الشهر، CEFR، قائمة Oxford، كلمات تراكمية، الناتج]
export const MONTHS = [
  [1, 'A1', 'A1', 350, 'تقديم النفس، أول 10 جلسات سماع'],
  [2, 'A1', 'A1', 700, 'أول جلسة محادثة، كتاب مبسط كامل'],
  [3, 'A2', 'A1 ← A2', 1050, 'حوار 5 دقائق، بريد قصير'],
  [4, 'A2', 'A2', 1400, 'محادثة 10 دقائق، 3 كتب مبسطة'],
  [5, 'B1', 'A2 ← B1', 1750, 'فقرة منظمة، تبادل لغوي'],
  [6, 'B1', 'B1', 2100, 'IELTS تجريبي 1، مسلسل بترجمة إنجليزية'],
  [7, 'B1+', 'B1', 2450, 'مقال رأي، عرض 3 دقائق'],
  [8, 'B2', 'B2', 2800, 'IELTS تجريبي 2، رواية أصلية'],
  [9, 'B2', 'B2', 3150, 'AWL (أول 200)، محاضرة بدون نص'],
  [10, 'B2+', 'Oxford 5000', 3500, 'مقال أكاديمي 300 كلمة، IELTS تجريبي 3'],
  [11, 'C1', 'Oxford 5000', 3850, 'ملخص نقدي لمقال علمي'],
  [12, 'C1', 'Oxford 5000', 4200, 'مقال 1500 كلمة، عرض 10 دقائق، تجريبي نهائي وقرار الحجز']
].map(([m, cefr, oxford, words, goal]) => ({ m, cefr, oxford, words, goal }))

// قوالب الأيام: عمل (نقل ساعتان) / الأربعاء (إنتاج) / الخميس (مدخلات ومراجعة)
export const DAYS = {
  work: [
    { id: 'l1', t: 'سماع نشط لمحتوى مستواك + Shadowing همسًا', min: 45 },
    { id: 'srs', t: 'مراجعة بطاقات المفردات', min: 15, go: 'vocab' },
    { id: 'l2', t: 'بودكاست أو قراءة على الهاتف', min: 45 },
    { id: 'rec', t: 'رسالة صوتية لشريك أو تسجيل ذاتي', min: 15 },
    { id: 'wr', t: '3–5 جمل مكتوبة + سجل الأخطاء', min: 20, go: 'prog' }
  ],
  wed: [
    { id: 'srs', t: 'مراجعة بطاقات المفردات', min: 15, go: 'vocab' },
    { id: 'ai', t: 'محادثة صوتية موجّهة مع Claude', min: 30 },
    { id: 'ex', t: 'رسائل صوتية لشريك تبادل لغوي', min: 30 },
    { id: 'wr', t: 'كتابة نص وتصحيحه', min: 60, go: 'prog' },
    { id: 'gr', t: 'عبارات وقواعد المرحلة', min: 30 }
  ],
  thu: [
    { id: 'srs', t: 'مراجعة بطاقات المفردات', min: 15, go: 'vocab' },
    { id: 'ext', t: 'قراءة أو مشاهدة موسّعة', min: 90 },
    { id: 'spec', t: 'محتوى التخصص (من المرحلة 5)', min: 60 },
    { id: 'rev', t: 'مراجعة أسبوعية وتسجيل صوتي وتخطيط الأسبوع', min: 45 }
  ]
}
export const DAY_NAMES = { work: 'يوم عمل', wed: 'الأربعاء: يوم الإنتاج', thu: 'الخميس: مدخلات ومراجعة' }

// المصادر: m = الأشهر المناسبة [من، إلى]
export const RESOURCES = [
  { g: 'سماع', n: 'BBC Learning English', u: 'https://www.bbc.co.uk/learningenglish', d: 'دروس قصيرة وبودكاست 6 Minute English', m: [1, 8] },
  { g: 'سماع', n: 'VOA Learning English', u: 'https://learningenglish.voanews.com', d: 'أخبار ببطء مع نص مرافق', m: [1, 6] },
  { g: 'سماع', n: 'قنوات المبتدئين على يوتيوب', u: 'https://www.youtube.com/results?search_query=easy+english+beginner+lessons', d: 'بحث جاهز: اختر قناة واحدة والتزم بها', m: [1, 3] },
  { g: 'سماع', n: 'TED-Ed', u: 'https://ed.ted.com', d: 'دروس قصيرة مع أسئلة', m: [5, 10] },
  { g: 'سماع', n: 'OpenLearn (Open University)', u: 'https://www.open.edu/openlearn', d: 'مواد جامعية مجانية', m: [9, 12] },
  { g: 'سماع', n: 'Coursera', u: 'https://www.coursera.org', d: 'محاضرات في اللسانيات وتعليم اللغات', m: [9, 12] },
  { g: 'سماع', n: 'edX', u: 'https://www.edx.org', d: 'محاضرات جامعية', m: [9, 12] },
  { g: 'نطق', n: 'Rachel’s English', u: 'https://rachelsenglish.com', d: 'أصوات الإنجليزية والنطق الأمريكي', m: [1, 6] },
  { g: 'نطق', n: 'YouGlish', u: 'https://youglish.com', d: 'اسمع الكلمة في سياقات حقيقية', m: [1, 12] },
  { g: 'مفردات', n: 'قوائم Oxford 3000 و5000', u: 'https://www.oxfordlearnersdictionaries.com/about/wordlists/oxford3000-5000', d: 'القوائم الرسمية بمستويات CEFR', m: [1, 12] },
  { g: 'مفردات', n: 'Oxford Learner’s Dictionaries', u: 'https://www.oxfordlearnersdictionaries.com', d: 'قاموس إنجليزي-إنجليزي', m: [2, 12] },
  { g: 'مفردات', n: 'Cambridge Dictionary', u: 'https://dictionary.cambridge.org', d: 'قاموس بأمثلة وصوت', m: [2, 12] },
  { g: 'قراءة', n: 'Simple English Wikipedia', u: 'https://simple.wikipedia.org', d: 'مقالات بلغة مبسطة', m: [2, 6] },
  { g: 'قراءة', n: 'Project Gutenberg', u: 'https://www.gutenberg.org', d: 'كتب مجانية للقراءة الموسّعة', m: [6, 12] },
  { g: 'قراءة', n: 'ELT Journal', u: 'https://academic.oup.com/eltj', d: 'مجلة في تعليم الإنجليزية (للمرحلة 6)', m: [10, 12] },
  { g: 'قراءة', n: 'TESOL Quarterly', u: 'https://tesol.onlinelibrary.wiley.com/journal/15457249', d: 'مجلة علمية في تعليم اللغات', m: [10, 12] },
  { g: 'كتابة', n: 'LanguageTool', u: 'https://languagetool.org', d: 'تدقيق الكتابة', m: [2, 12] },
  { g: 'محادثة', n: 'HelloTalk', u: 'https://www.hellotalk.com', d: 'تبادل لغوي ورسائل صوتية', m: [2, 12] },
  { g: 'محادثة', n: 'Tandem', u: 'https://www.tandem.net', d: 'تبادل لغوي', m: [2, 12] },
  { g: 'محادثة', n: 'italki', u: 'https://www.italki.com', d: 'دروس مجتمعية مدفوعة', m: [5, 12] },
  { g: 'محادثة', n: 'Preply', u: 'https://preply.com', d: 'دروس مدفوعة', m: [5, 12] },
  { g: 'اختبارات', n: 'IELTS الرسمي', u: 'https://ielts.org', d: 'التسجيل والمواد الرسمية', m: [6, 12] },
  { g: 'اختبارات', n: 'TOEFL (ETS)', u: 'https://www.ets.org/toefl.html', d: 'صفحة الاختبار الرسمية', m: [6, 12] },
  { g: 'اختبارات', n: 'تغييرات TOEFL منذ يناير 2026', u: 'https://www.eu.ets.org/toefl/test-takers/ibt/upcoming-updates-jan-2026.html', d: 'الصيغة الجديدة ومقياس 1–6', m: [6, 12] }
]
