建議內容（可以直接複製貼上進去）

# Comments Tab Integration Guide

This document explains how to add a multilingual **Comments tab** to all FFXIV Library HTML templates (Quest / Fight / Mount / BGM).

---

## 1. Add the Tab Button
Inside the `.tabs` section of your HTML file, add:

```html
<button class="tab-btn" role="tab" aria-selected="false" data-tab="comments">Comments</button>

Place it after existing buttons (e.g., Story / Acquisition / Unlock Quest).

⸻

2. Add the Panel

Inside the .bd section where panels are defined, add:

<div id="panel-comments" class="tab-panel"></div>


⸻

3. Update JavaScript

Extend the panels object:

const panels = {
  story: document.getElementById('panel-story'),
  acq: document.getElementById('panel-acq'),
  unlockq: document.getElementById('panel-unlockq'),
  followq: document.getElementById('panel-followq'),
  comments: document.getElementById('panel-comments')
};

Add translations in i18n for each language:

tabs: {
  story: 'Story',
  acq: 'Acquisition',
  unlockq: 'Unlock Quest',
  followq: 'Follow-Up Quest',
  comments: 'Comments'
},
comments: `
  <div class="stack">
    <div class="row">—</div>
  </div>
`

Do the same for JP and ZH-TW.

⸻

4. Style Notes

No new CSS needed; .tab-btn and .tab-panel already cover styling.

⸻

5. Result
	•	A new Comments tab will appear in all templates.
	•	It defaults to empty (—) but can later embed Disqus, Giscus, or custom comment sections.

⸻

✅ Apply these same steps to:
	•	Quest Guide
	•	Fight Guide
	•	Mount Guide
	•	BGM Guide

---

存檔 → Commit → 就會是一份完整的指南。  
你要我幫你把四個範本的 **完整修改範例**（Quest / Fight / Mount / BGM）也一起補進這份指南裡嗎？
