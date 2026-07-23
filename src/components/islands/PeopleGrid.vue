<script setup lang="ts">
interface Person {
  name: string
  role: string
  org: string
  era?: string
  link?: string
}

const people: Person[] = [
  { name: 'Karen Olsen', role: 'Co-chair, TC UNITS', org: 'NIST Quantum Measurement Division', era: '2006–present', link: 'https://www.nist.gov/people/karen-olsen' },
  { name: 'Nick Nicholas', role: 'Co-chair, TC UNITS', org: 'Ribose', era: '2020–present' },
  { name: 'Bob Dragoset', role: 'UnitsML pioneer, NIST PL', org: 'NIST Physics Laboratory', era: '2003–2016' },
  { name: 'Frank Olken', role: 'Initial XML units encoding', org: 'Lawrence Berkeley National Laboratory', era: '1998–2003' },
  { name: 'John McCarthy', role: 'Initial XML units encoding', org: 'Lawrence Berkeley National Laboratory', era: '1998–1999' },
  { name: 'Simon Frechette', role: 'TC Convenor', org: 'NIST MEL-SIMA', era: '2006' },
  { name: 'Peter Linstrom', role: 'Schema & representation', org: 'NIST CSTL', era: '2003–2022' },
  { name: 'Martin Weber', role: 'Schema development', org: 'NIST Associate / Physics Laboratory', era: '2008–2016' },
  { name: 'Barry Taylor', role: 'Scientific advisor', org: 'NIST (emeritus)', era: '2003' },
  { name: 'Peter Murray-Rust', role: 'CML liaison', org: 'Chemical Markup Language', era: '2003' },
  { name: 'Michael McLay', role: 'NIST EEEL collaborator', org: 'NIST', era: '2003' },
  { name: 'Gary Kramer', role: 'Schema development', org: 'NIST CSTL', era: '2006' },
  { name: 'Mark Carlisle', role: 'SIMA program', org: 'NIST MEL-SIMA', era: '2006' },
  { name: 'Evan Wallace', role: 'Manufacturing systems', org: 'NIST MEL', era: '2006' },
  { name: 'Kent Reed', role: 'BFRL collaborator', org: 'NIST BFRL', era: '2006' },
  { name: 'Ismet Celebi', role: 'AnIML integration, JRES author', org: 'Former NIST Associate', era: '2006–2010' },
  { name: 'Reinhold Schaefer', role: 'WICIL / RheinMain University', org: 'JRES co-author', era: '2010' },
  { name: 'Karen LeGrand', role: 'IEM representative', org: 'International Engineering and Manufacturing', era: '2011' },
]

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('')
}
</script>

<template>
  <div class="people-grid">
    <div v-for="person in people" :key="person.name" class="person-card">
      <div class="person-avatar" :title="person.name">
        {{ initials(person.name) }}
      </div>
      <div class="person-info">
        <a v-if="person.link" :href="person.link" target="_blank" rel="noopener" class="person-name">{{ person.name }}</a>
        <span v-else class="person-name">{{ person.name }}</span>
        <span class="person-role">{{ person.role }}</span>
        <span class="person-org">{{ person.org }}</span>
        <span v-if="person.era" class="person-era">{{ person.era }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.person-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.25s ease;
}

.person-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06);
}

.person-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--unitsml-navy), var(--unitsml-navy-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.person-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.person-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--vp-c-text-1);
}

a.person-name {
  text-decoration: none;
}

a.person-name:hover {
  color: var(--vp-c-brand-1);
}

.person-role {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.person-org {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.person-era {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  margin-top: 0.125rem;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .people-grid {
    grid-template-columns: 1fr;
  }
}
</style>
