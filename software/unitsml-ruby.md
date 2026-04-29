---
title: unitsml-ruby
description: Library to work with UnitsML in Ruby
---

# unitsml-ruby

<div class="page-links">
  <a href="https://github.com/unitsml/unitsml-ruby" target="_blank" rel="noopener" class="link-card">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
    <span>View on GitHub</span>
  </a>
</div>

Library to work with UnitsML in Ruby — parse unit strings, generate MathML representations, and perform dimensional analysis.

## Installation

```bash
gem install unitsml
```

## Usage

```ruby
require 'unitsml'

# Parse a unit expression
unit = Unitsml::Unit.parse("m/s^2")

# Generate MathML
mathml = unit.to_mathml

# Access dimensional information
dimension = unit.dimension
```

## Features

<div class="ruby-features">
  <div class="ruby-feature">
    <div class="ruby-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    </div>
    <h4>Unit Parsing</h4>
    <p>Parse UnitsML unit expressions into structured Ruby objects with full dimensional analysis.</p>
  </div>
  <div class="ruby-feature">
    <div class="ruby-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    </div>
    <h4>MathML Generation</h4>
    <p>Generate MathML markup for unit symbols and expressions, ready for scientific document rendering.</p>
  </div>
  <div class="ruby-feature">
    <div class="ruby-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
    <h4>UnitsDB Integration</h4>
    <p>Built on top of UnitsDB data for accurate unit definitions, symbols, and dimensional relationships.</p>
  </div>
</div>

<style scoped>
.page-links {
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.5rem 0 2.5rem;
}
.link-card {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.875rem; font-weight: 500;
  text-decoration: none; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); transition: all 0.25s ease;
}
.link-card:hover { border-color: var(--vp-c-brand-1); box-shadow: 0 2px 8px rgba(45, 44, 105, 0.08); }
.ruby-features {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem; margin: 1.5rem 0 3rem;
}
.ruby-feature {
  padding: 1.25rem; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  border-radius: 12px; transition: all 0.25s ease;
}
.ruby-feature:hover { border-color: var(--vp-c-brand-1); box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06); }
.ruby-icon { color: var(--vp-c-brand-1); margin-bottom: 0.625rem; }
.ruby-feature h4 { font-size: 0.9375rem; font-weight: 600; color: var(--vp-c-text-1); margin-bottom: 0.375rem; }
.ruby-feature p { font-size: 0.8125rem; color: var(--vp-c-text-2); line-height: 1.6; margin: 0; }
</style>
