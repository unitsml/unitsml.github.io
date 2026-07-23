---
title: UnitsML Playground
description: Interactive playground for parsing and rendering unit expressions with UnitsML
---

# UnitsML Playground

Parse unit expressions and see them rendered in multiple formats — MathML, LaTeX, Unicode, AsciiMath, and UnitsML XML.

<div class="playground-container">
  <div class="playground-input">
    <label for="unit-input">Unit expression</label>
    <div class="input-row">
      <input
        id="unit-input"
        type="text"
        placeholder="e.g. kg*m/s^2, mm, sqrt(Hz), C^3"
        autocomplete="off"
        spellcheck="false"
      />
      <button id="parse-btn">Parse</button>
    </div>
    <div class="examples">
      <span>Try:</span>
      <button class="example-btn" data-ex="kg*m/s^2">kg*m/s^2</button>
      <button class="example-btn" data-ex="mm">mm</button>
      <button class="example-btn" data-ex="sqrt(Hz)">sqrt(Hz)</button>
      <button class="example-btn" data-ex="C^3">C^3</button>
      <button class="example-btn" data-ex="m*s^-2">m*s^-2</button>
    </div>
  </div>

  <div id="playground-result" class="playground-result" style="display: none;">
    <div class="result-tabs">
      <button class="result-tab active" data-tab="mathml">MathML</button>
      <button class="result-tab" data-tab="latex">LaTeX</button>
      <button class="result-tab" data-tab="unicode">Unicode</button>
      <button class="result-tab" data-tab="asciimath">AsciiMath</button>
      <button class="result-tab" data-tab="xml">UnitsML XML</button>
    </div>
    <div class="result-content">
      <div id="result-mathml" class="result-pane active"></div>
      <div id="result-latex" class="result-pane"></div>
      <div id="result-unicode" class="result-pane"></div>
      <div id="result-asciimath" class="result-pane"></div>
      <div id="result-xml" class="result-pane"></div>
    </div>
  </div>

  <div id="playground-fallback" class="playground-fallback" style="display: none;">
    <p>The full parser requires the <code>@unitsml/unitsml</code> JavaScript package, which is currently being published. For now, use the <a href="/unitsdb/">UnitsDB browser</a> to explore units.</p>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('unit-input');
  const parseBtn = document.getElementById('parse-btn');
  const resultDiv = document.getElementById('playground-result');
  const fallbackDiv = document.getElementById('playground-fallback');
  const tabs = document.querySelectorAll('.result-tab');
  const panes = document.querySelectorAll('.result-pane');
  const exampleBtns = document.querySelectorAll('.example-btn');

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('result-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Example buttons
  exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.ex;
      parse();
    });
  });

  // Parse on Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') parse();
  });

  parseBtn.addEventListener('click', parse);

  async function parse() {
    const expr = input.value.trim();
    if (!expr) return;

    // Try to load unitsml-js from CDN
    if (!window.Unitsml) {
      try {
        await loadScript('https://unpkg.com/@unitsml/unitsml@latest/dist/unitsml.js');
      } catch (e) {
        fallbackDiv.style.display = 'block';
        resultDiv.style.display = 'none';
        return;
      }
    }

    if (!window.Unitsml) {
      fallbackDiv.style.display = 'block';
      resultDiv.style.display = 'none';
      return;
    }

    try {
      const formula = window.Unitsml.parse(expr);
      document.getElementById('result-mathml').innerHTML = formula.to_mathml();
      document.getElementById('result-latex').textContent = formula.to_latex();
      document.getElementById('result-unicode').textContent = formula.to_unicode();
      document.getElementById('result-asciimath').textContent = formula.to_asciimath();
      document.getElementById('result-xml').textContent = formula.to_xml();
      resultDiv.style.display = 'block';
      fallbackDiv.style.display = 'none';
    } catch (err) {
      fallbackDiv.style.display = 'block';
      resultDiv.style.display = 'none';
      fallbackDiv.querySelector('p').textContent = 'Parse error: ' + err.message;
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
});
</script>

<style>
.playground-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.playground-input {
  margin-bottom: 2rem;
}

.playground-input label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.input-row {
  display: flex;
  gap: 0.5rem;
}

.input-row input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.input-row input:focus {
  outline: none;
  border-color: var(--unitsml-teal);
  box-shadow: 0 0 0 3px rgba(48, 223, 192, 0.1);
}

.input-row button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  background: var(--unitsml-navy);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.input-row button:hover {
  background: var(--unitsml-navy-light);
}

.examples {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.examples span {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.example-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
}

.example-btn:hover {
  border-color: var(--unitsml-teal);
  color: var(--unitsml-teal-dark);
}

.playground-result {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.result-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
}

.result-tab {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.result-tab:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.result-tab.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.result-content {
  padding: 1.5rem;
}

.result-pane {
  display: none;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-break: break-all;
}

.result-pane.active {
  display: block;
}

.result-pane math {
  font-size: 1.25rem;
}

.playground-fallback {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
}

.playground-fallback a {
  color: var(--vp-c-brand-1);
}
</style>
