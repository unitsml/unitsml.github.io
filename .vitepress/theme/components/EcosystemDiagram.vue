<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

interface DiagramNode {
  id: string
  label: string
  x: number
  y: number
  icon: string
  color: string
  desc: string
  link?: string
}

const nodes: DiagramNode[] = [
  { id: 'schema', label: 'UnitsML\nXML Schema', x: 300, y: 80, icon: 'schema', color: '#2d2c69', desc: 'Authoritative XML schemas for\nunits of measure', link: '/schemas' },
  { id: 'unitsdb', label: 'UnitsDB', x: 300, y: 260, icon: 'db', color: '#14b8a6', desc: 'Extensive database of\nunits, quantities, dimensions', link: '/unitsdb/' },
  { id: 'ruby', label: 'unitsml-ruby', x: 530, y: 260, icon: 'lib', color: '#57a0fe', desc: 'Ruby gem for\nprogrammatic access', link: '/software/unitsml-ruby' },
  { id: 'xml', label: 'XML\nDocuments', x: 80, y: 80, icon: 'doc', color: '#6b7280', desc: 'Scientific data\nwith units markup' },
  { id: 'otherml', label: 'Other Markup\nLanguages', x: 300, y: 440, icon: 'lang', color: '#6b7280', desc: 'MatML, CML, custom\nXML vocabularies' },
  { id: 'browser', label: 'Schema\nBrowser', x: 530, y: 80, icon: 'browser', color: '#57a0fe', desc: 'Interactive schema\ndocumentation', link: 'https://schema.unitsml.org' },
]

const connections = [
  { from: 'xml', to: 'schema', label: 'validates with' },
  { from: 'schema', to: 'browser', label: 'browse' },
  { from: 'schema', to: 'unitsdb', label: 'references' },
  { from: 'unitsdb', to: 'otherml', label: 'feeds' },
  { from: 'unitsdb', to: 'ruby', label: 'accessed via' },
  { from: 'schema', to: 'otherml', label: 'incorporated into' },
]

const hoveredNode = ref<string | null>(null)

function isNodeConnected(nodeId: string): boolean {
  if (!hoveredNode.value) return true
  return hoveredNode.value === nodeId || connections.some(
    c => (c.from === hoveredNode.value && c.to === nodeId) ||
         (c.to === hoveredNode.value && c.from === nodeId)
  )
}

function isConnectionActive(from: string, to: string): boolean {
  if (!hoveredNode.value) return false
  return (from === hoveredNode.value || to === hoveredNode.value)
}

function navigate(node: DiagramNode) {
  if (node.link) {
    if (node.link.startsWith('http')) {
      window.open(node.link, '_blank', 'noopener')
    } else {
      router.go(node.link)
    }
  }
}
</script>

<template>
  <div class="ecosystem">
    <svg viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" class="ecosystem-svg" role="img" aria-label="UnitsML ecosystem diagram showing relationships between components">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#2d2c69" opacity="0.5"/>
        </marker>
        <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#2d2c69" opacity="0.9"/>
        </marker>
        <marker id="arrowhead-teal" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#14b8a6" opacity="0.5"/>
        </marker>
        <marker id="arrowhead-teal-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#14b8a6" opacity="0.9"/>
        </marker>
        <filter id="node-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.08"/>
        </filter>
        <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.08"/>
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#2d2c69" flood-opacity="0.12"/>
        </filter>
      </defs>

      <!-- Connection lines -->
      <g class="connections">
        <!-- xml → schema -->
        <line x1="150" y1="80" x2="218" y2="80"
          :stroke="isConnectionActive('xml','schema') ? '#2d2c69' : '#2d2c69'"
          :stroke-width="isConnectionActive('xml','schema') ? 2 : 1.5"
          :stroke-dasharray="isConnectionActive('xml','schema') ? 'none' : '4,3'"
          :opacity="isConnectionActive('xml','schema') ? 0.7 : 0.4"
          :marker-end="isConnectionActive('xml','schema') ? 'url(#arrowhead-active)' : 'url(#arrowhead)'"
          class="conn-line"
        />
        <text x="184" y="72" text-anchor="middle" font-size="8" :fill="'#2d2c69'" :opacity="isConnectionActive('xml','schema') ? 0.8 : 0.5" font-family="Inter, sans-serif">validates with</text>

        <!-- schema → browser -->
        <line x1="382" y1="80" x2="448" y2="80"
          stroke="#57a0fe"
          :stroke-width="isConnectionActive('schema','browser') ? 2 : 1.5"
          :stroke-dasharray="isConnectionActive('schema','browser') ? 'none' : '4,3'"
          :opacity="isConnectionActive('schema','browser') ? 0.7 : 0.4"
          marker-end="url(#arrowhead)"
          class="conn-line"
        />
        <text x="415" y="72" text-anchor="middle" font-size="8" fill="#57a0fe" :opacity="isConnectionActive('schema','browser') ? 0.9 : 0.6" font-family="Inter, sans-serif">browse</text>

        <!-- schema → unitsdb -->
        <line x1="300" y1="140" x2="300" y2="198"
          stroke="#14b8a6"
          :stroke-width="isConnectionActive('schema','unitsdb') ? 2 : 1.5"
          :stroke-dasharray="isConnectionActive('schema','unitsdb') ? 'none' : '4,3'"
          :opacity="isConnectionActive('schema','unitsdb') ? 0.7 : 0.4"
          :marker-end="isConnectionActive('schema','unitsdb') ? 'url(#arrowhead-teal-active)' : 'url(#arrowhead-teal)'"
          class="conn-line"
        />
        <text x="316" y="174" font-size="8" fill="#14b8a6" :opacity="isConnectionActive('schema','unitsdb') ? 0.9 : 0.6" font-family="Inter, sans-serif">references</text>

        <!-- unitsdb → ruby -->
        <line x1="382" y1="260" x2="448" y2="260"
          stroke="#57a0fe"
          :stroke-width="isConnectionActive('unitsdb','ruby') ? 2 : 1.5"
          :stroke-dasharray="isConnectionActive('unitsdb','ruby') ? 'none' : '4,3'"
          :opacity="isConnectionActive('unitsdb','ruby') ? 0.7 : 0.4"
          marker-end="url(#arrowhead)"
          class="conn-line"
        />
        <text x="415" y="252" text-anchor="middle" font-size="8" fill="#57a0fe" :opacity="isConnectionActive('unitsdb','ruby') ? 0.9 : 0.6" font-family="Inter, sans-serif">accessed via</text>

        <!-- schema → otherml (diagonal) -->
        <path d="M 245 140 Q 245 340 300 398"
          stroke="#2d2c69"
          :stroke-width="isConnectionActive('schema','otherml') ? 2 : 1.5"
          :stroke-dasharray="isConnectionActive('schema','otherml') ? 'none' : '4,3'"
          :opacity="isConnectionActive('schema','otherml') ? 0.5 : 0.25"
          fill="none"
          marker-end="url(#arrowhead)"
          class="conn-line"
        />
        <text x="240" y="290" font-size="8" fill="#2d2c69" :opacity="isConnectionActive('schema','otherml') ? 0.6 : 0.4" font-family="Inter, sans-serif" transform="rotate(-70, 240, 290)">incorporated into</text>

        <!-- unitsdb → otherml -->
        <line x1="300" y1="320" x2="300" y2="378"
          stroke="#6b7280"
          :stroke-width="isConnectionActive('unitsdb','otherml') ? 2 : 1.5"
          :stroke-dasharray="isConnectionActive('unitsdb','otherml') ? 'none' : '4,3'"
          :opacity="isConnectionActive('unitsdb','otherml') ? 0.6 : 0.3"
          marker-end="url(#arrowhead)"
          class="conn-line"
        />
        <text x="316" y="354" font-size="8" fill="#6b7280" :opacity="isConnectionActive('unitsdb','otherml') ? 0.7 : 0.4" font-family="Inter, sans-serif">feeds</text>
      </g>

      <!-- Nodes -->
      <g
        v-for="node in nodes"
        :key="node.id"
        class="node-group"
        :class="{ hoverable: !!node.link, dimmed: hoveredNode && !isNodeConnected(node.id) }"
        @mouseenter="hoveredNode = node.id"
        @mouseleave="hoveredNode = null"
        @click="navigate(node)"
      >
        <!-- Tooltip background -->
        <g v-if="hoveredNode === node.id" class="tooltip-group">
          <rect
            :x="node.x - 90" :y="node.y - 72"
            width="180" height="36" rx="6"
            fill="#1f1e4a" opacity="0.92"
          />
          <text
            :x="node.x"
            :y="node.y - 52"
            text-anchor="middle"
            fill="white"
            font-size="9"
            font-family="Inter, sans-serif"
            opacity="0.9"
          >
            {{ node.desc.split('\n')[0] }}
          </text>
          <text
            v-if="node.desc.includes('\n')"
            :x="node.x"
            :y="node.y - 42"
            text-anchor="middle"
            fill="white"
            font-size="9"
            font-family="Inter, sans-serif"
            opacity="0.7"
          >
            {{ node.desc.split('\n')[1] }}
          </text>
        </g>

        <rect
          :x="node.x - 82" :y="node.y - 30"
          width="164" height="60" rx="12"
          :fill="node.id === 'schema' ? node.color : '#fff'"
          :stroke="node.id === 'schema' ? 'none' : node.color"
          stroke-width="1.5"
          :filter="hoveredNode === node.id ? 'url(#node-glow)' : 'url(#node-shadow)'"
          class="node-rect"
        />

        <!-- Icon shapes -->
        <g v-if="node.icon === 'schema'" :transform="`translate(${node.x - 60}, ${node.y - 12})`">
          <rect x="0" y="0" width="16" height="20" rx="2" fill="none" stroke="white" stroke-width="1.2" opacity="0.8"/>
          <line x1="4" y1="6" x2="12" y2="6" stroke="white" stroke-width="1" opacity="0.6"/>
          <line x1="4" y1="10" x2="12" y2="10" stroke="white" stroke-width="1" opacity="0.6"/>
          <line x1="4" y1="14" x2="9" y2="14" stroke="white" stroke-width="1" opacity="0.6"/>
        </g>
        <g v-if="node.icon === 'db'" :transform="`translate(${node.x - 60}, ${node.y - 12})`">
          <ellipse cx="8" cy="3" rx="8" ry="3" fill="none" :stroke="node.color" stroke-width="1.2"/>
          <path d="M 0 3 L 0 17 C 0 20, 16 20, 16 17 L 16 3" fill="none" :stroke="node.color" stroke-width="1.2"/>
          <ellipse cx="8" cy="10" rx="8" ry="3" fill="none" :stroke="node.color" stroke-width="0.8" opacity="0.4"/>
        </g>
        <g v-if="node.icon === 'lib'" :transform="`translate(${node.x - 60}, ${node.y - 12})`">
          <text x="8" y="14" text-anchor="middle" font-size="16" font-weight="700" :fill="node.color" opacity="0.6" font-family="monospace">{}</text>
        </g>
        <g v-if="node.icon === 'doc'" :transform="`translate(${node.x - 60}, ${node.y - 12})`">
          <path d="M 2 0 L 11 0 L 16 5 L 16 20 L 2 20 Z" fill="none" :stroke="node.color" stroke-width="1.2"/>
          <path d="M 11 0 L 11 5 L 16 5" fill="none" :stroke="node.color" stroke-width="1"/>
        </g>
        <g v-if="node.icon === 'lang'" :transform="`translate(${node.x - 60}, ${node.y - 12})`">
          <rect x="0" y="2" width="8" height="8" rx="1.5" fill="none" :stroke="node.color" stroke-width="1"/>
          <rect x="10" y="2" width="8" height="8" rx="1.5" fill="none" :stroke="node.color" stroke-width="1"/>
          <rect x="0" y="12" width="8" height="8" rx="1.5" fill="none" :stroke="node.color" stroke-width="1"/>
          <rect x="10" y="12" width="8" height="8" rx="1.5" fill="none" :stroke="node.color" stroke-width="1"/>
        </g>
        <g v-if="node.icon === 'browser'" :transform="`translate(${node.x - 60}, ${node.y - 12})`">
          <rect x="0" y="0" width="18" height="14" rx="2" fill="none" :stroke="node.color" stroke-width="1.2"/>
          <line x1="0" y1="4" x2="18" y2="4" :stroke="node.color" stroke-width="1"/>
          <circle cx="3" cy="2" r="0.8" :fill="node.color" opacity="0.5"/>
          <circle cx="6" cy="2" r="0.8" :fill="node.color" opacity="0.5"/>
        </g>

        <!-- Label -->
        <text
          :x="node.x + 6"
          :y="node.y + 4"
          text-anchor="middle"
          :fill="node.id === 'schema' ? '#fff' : '#2d2c69'"
          font-weight="600"
          font-size="13"
          font-family="Inter, sans-serif"
        >
          {{ node.label.split('\n')[0] }}
        </text>
        <text
          v-if="node.label.includes('\n')"
          :x="node.x + 6"
          :y="node.y + 18"
          text-anchor="middle"
          :fill="node.id === 'schema' ? 'rgba(255,255,255,0.7)' : '#6b7280'"
          font-size="11"
          font-family="Inter, sans-serif"
        >
          {{ node.label.split('\n')[1] }}
        </text>

        <!-- Click indicator for navigable nodes -->
        <text
          v-if="node.link && hoveredNode === node.id"
          :x="node.x + 62"
          :y="node.y + 24"
          fill="white"
          font-size="10"
          opacity="0.6"
          font-family="Inter, sans-serif"
        >
          →
        </text>
      </g>
    </svg>

    <!-- Legend -->
    <div class="diagram-legend">
      <span class="legend-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        Hover nodes for details · Click to navigate
      </span>
    </div>
  </div>
</template>

<style scoped>
.ecosystem {
  margin: 2rem 0;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
}

.ecosystem-svg {
  width: 100%;
  height: auto;
  max-width: 640px;
  margin: 0 auto;
  display: block;
}

.node-group {
  cursor: default;
  transition: opacity 0.3s ease;
}

.node-group.hoverable {
  cursor: pointer;
}

.node-group.dimmed {
  opacity: 0.35;
}

.node-rect {
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.node-group:not(.dimmed):hover .node-rect {
  filter: url(#node-glow);
}

.conn-line {
  transition: all 0.3s ease;
}

.diagram-legend {
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.legend-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.tooltip-group {
  pointer-events: none;
}

@media (max-width: 640px) {
  .ecosystem {
    padding: 1rem;
  }
}
</style>
