<script setup lang="ts">
import { ref } from 'vue'

interface TimelineEntry {
  year: string
  title: string
  description: string
  people?: string[]
  organizations?: string[]
  highlight?: boolean
}

const entries: TimelineEntry[] = [
  {
    year: '1998',
    title: 'Origins at LBNL',
    description: 'Frank Olken and John McCarthy of Lawrence Berkeley National Laboratory lead the initial effort to encode units in XML, driven by needs expressed in the W3C XML Query Language requirements.',
    people: ['Frank Olken', 'John McCarthy'],
    organizations: ['LBNL'],
  },
  {
    year: '1999',
    title: 'First publications',
    description: '"Measurement Units in XML Datatypes" published by Olken and McCarthy. MatML (Materials Markup Language) at NIST references the measurement units work.',
    people: ['Frank Olken', 'John McCarthy'],
    organizations: ['LBNL', 'NIST'],
  },
  {
    year: '2003',
    title: 'UnitsML takes shape at NIST',
    description: 'The "Units Markup Language" presentation at the Sixth Open Forum on Metadata Registries in Santa Fe, NM (January 22). Work led by Bob Dragoset (NIST) with Barry Taylor, Michael McLay, Frank Olken, and Peter Murray-Rust (CML). The original NIST homepage goes online in May.',
    people: ['Bob Dragoset', 'Barry Taylor', 'Michael McLay', 'Frank Olken', 'Peter Murray-Rust'],
    organizations: ['NIST', 'LBNL'],
    highlight: true,
  },
  {
    year: '2006',
    title: 'OASIS Technical Committee',
    description: 'NIST proposes standardization. The OASIS TC "UnitsML" is formed on July 12 with its first official teleconference, convened by Simon Frechette (NIST). Major participants include NIST, IBM, Granta Design, NPL, and Univ. of North Florida.',
    people: ['Simon Frechette', 'Mark Carlisle', 'Bob Dragoset', 'Karen Olsen', 'Gary Kramer', 'Peter Lindstrom', 'Kent Reed', 'Evan Wallace'],
    organizations: ['NIST', 'OASIS', 'IBM', 'Granta Design', 'NPL'],
    highlight: true,
  },
  {
    year: '2010',
    title: 'NVUnitsML demo',
    description: 'An interactive browser-based demo (NVUnitsML) shows unit conversions driven by UnitsML 0.9.18 and XSLT stylesheets.',
    people: ['Peter Linstrom'],
    organizations: ['NIST'],
  },
  {
    year: '2011',
    title: 'UnitsML v1.0-csd04',
    description: 'The OASIS TC approves UnitsML v1.0 Committee Specification Draft 04 on December 13, adding light-time units and refining Avoirdupois units. A presentation is given to the SCC-20 TII/TAD Working Group on September 11.',
    people: ['Bob Dragoset', 'Peter Linstrom', 'Martin Weber', 'Karen Olsen'],
    organizations: ['NIST', 'OASIS'],
    highlight: true,
  },
  {
    year: '2016',
    title: 'OASIS TC completes work',
    description: 'The OASIS Technical Committee for UnitsML is closed after completing its mandate at that stage.',
    organizations: ['OASIS'],
  },
  {
    year: '2020',
    title: 'Revival',
    description: 'UnitsML work continues through collaboration between NIST and Ribose, renewing the effort for modern standards.',
    people: ['Karen Olsen', 'Nick Nicholas'],
    organizations: ['NIST', 'Ribose'],
  },
  {
    year: '2021',
    title: 'UnitsDB archive preserved',
    description: 'The original NIST UnitsDB XML dumps are imported into the unitsdb-archive repository, preserving the complete 0.9.18 and 1.0 schema datasets.',
    people: ['Ronald Tse'],
    organizations: ['Ribose'],
  },
  {
    year: '2022',
    title: 'CalConnect TC UNITS',
    description: 'CalConnect creates TC UNITS to carry on the UnitsML work. Karen Olsen (NIST) and Nick Nicholas (Ribose) co-chair the technical committee. Presentations are given at SciDataCon 2022 (June) and to CIPM/BIPM (September) on the semantic SI Brochure.',
    people: ['Karen Olsen', 'Nick Nicholas'],
    organizations: ['CalConnect', 'NIST', 'Ribose', 'BIPM'],
    highlight: true,
  },
  {
    year: '2025',
    title: 'UnitsDB 1.0 & 2.0',
    description: 'UnitsDB 1.0 (March) delivers the first stable release with 380+ units. UnitsDB 2.0 (May) introduces organization-neutral identifiers, multilingual names from BIPM, and cross-references to the BIPM SI Digital Framework, UCUM, and QUDT.',
    people: ['Karen Olsen', 'Nick Nicholas', 'Ronald Tse'],
    organizations: ['CalConnect', 'NIST', 'Ribose'],
    highlight: true,
  },
]

const expanded = ref<Set<string>>(new Set())

function toggle(year: string) {
  const s = new Set(expanded.value)
  if (s.has(year)) s.delete(year)
  else s.add(year)
  expanded.value = s
}
</script>

<template>
  <div class="timeline">
    <div v-for="(entry, i) in entries" :key="entry.year" class="timeline-item" :class="{ highlight: entry.highlight }">
      <!-- Year marker -->
      <div class="timeline-marker">
        <span class="year-label">{{ entry.year }}</span>
        <div class="marker-dot"></div>
        <div v-if="i < entries.length - 1" class="marker-line"></div>
      </div>

      <!-- Content card -->
      <div class="timeline-content" @click="toggle(entry.year)">
        <div class="timeline-header">
          <h4>{{ entry.title }}</h4>
          <svg class="chevron" :class="{ rotated: expanded.has(entry.year) }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>

        <p class="timeline-desc">{{ entry.description }}</p>

        <div v-if="entry.people || entry.organizations" class="timeline-meta" :class="{ show: expanded.has(entry.year) }">
          <div v-if="entry.organizations?.length" class="orgs">
            <span v-for="org in entry.organizations" :key="org" class="org-badge">{{ org }}</span>
          </div>
          <div v-if="entry.people?.length" class="people">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="people-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="people-list">{{ entry.people.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.timeline-item.highlight .marker-dot {
  background: var(--unitsml-teal);
  box-shadow: 0 0 0 4px rgba(48, 223, 192, 0.2);
}

.timeline-item.highlight .timeline-content {
  border-left: 3px solid var(--unitsml-teal);
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 70px;
  padding-top: 0.25rem;
}

.year-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.02em;
  margin-bottom: 0.75rem;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  flex-shrink: 0;
  z-index: 1;
  transition: all 0.3s ease;
}

.marker-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, var(--vp-c-divider), transparent);
  margin-top: 0.5rem;
  min-height: 40px;
}

.timeline-content {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid var(--vp-c-divider);
}

.timeline-content:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06);
  border-left-color: var(--vp-c-brand-1);
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.timeline-header h4 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.chevron {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.timeline-desc {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0.5rem 0 0;
}

.timeline-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease;
  margin-top: 0;
}

.timeline-meta.show {
  max-height: 200px;
  opacity: 1;
  margin-top: 0.75rem;
}

.orgs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.org-badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  background: rgba(45, 44, 105, 0.06);
  color: var(--vp-c-brand-1);
}

.people {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
}

.people-icon {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-top: 1px;
}

.people-list {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .timeline-marker {
    width: 50px;
  }

  .year-label {
    font-size: 0.75rem;
  }

  .timeline-content {
    padding: 1rem;
  }
}
</style>
