<script setup lang="ts">
import { ref } from 'vue'

interface TimelineEvent {
  year: string
  date: string
  title: string
  description: string
  people?: string[]
  organizations?: string[]
  era: 'nist' | 'oasis' | 'calconnect'
  quote?: string
}

const events: TimelineEvent[] = [
  {
    year: '1998',
    date: '1998',
    title: 'Origins at LBNL',
    description: 'Frank Olken and John McCarthy of Lawrence Berkeley National Laboratory lead the initial effort to encode units in XML, driven by needs expressed in the W3C XML Query Language requirements.',
    people: ['Frank Olken', 'John McCarthy'],
    organizations: ['LBNL'],
    era: 'nist',
  },
  {
    year: '1999',
    date: '1999',
    title: 'First publications',
    description: '"Measurement Units in XML Datatypes" published by Olken and McCarthy. MatML (Materials Markup Language) at NIST references the measurement units work.',
    people: ['Frank Olken', 'John McCarthy'],
    organizations: ['LBNL', 'NIST'],
    era: 'nist',
  },
  {
    year: '2003',
    date: 'January 2003',
    title: 'UnitsML takes shape at NIST',
    description: 'The "Units Markup Language" presentation at the Sixth Open Forum on Metadata Registries in Santa Fe, NM. The original NIST homepage goes online in May.',
    people: ['Bob Dragoset', 'Barry Taylor', 'Michael McLay', 'Frank Olken', 'Peter Murray-Rust'],
    organizations: ['NIST', 'LBNL'],
    era: 'nist',
    quote: 'UnitsML will enable markup of scientific units to allow unambiguous storage, exchange, and processing of numeric data.',
  },
  {
    year: '2006',
    date: 'May 5, 2006',
    title: 'UnitsML Schema 0.7',
    description: 'Early NIST schema draft: QuantitySet/Quantity/UnitRef becomes a reference to the Unit element, and dimension elements gain their own symbol attributes.',
    organizations: ['NIST'],
    era: 'nist',
  },
  {
    year: '2006',
    date: 'May 8, 2006',
    title: 'UnitsML Schema 0.7.2',
    description: 'Dimension elements made optional through minOccurs/maxOccurs constraints and extended with an xsd:byte base.',
    organizations: ['NIST'],
    era: 'nist',
  },
  {
    year: '2006',
    date: 'May 9, 2006',
    title: 'UnitsML Schema 0.7.3',
    description: 'Naming cleanup; dimension elements declared global, each with its own type.',
    organizations: ['NIST'],
    era: 'nist',
  },
  {
    year: '2006',
    date: 'May 10, 2006',
    title: 'UnitsML Schema 0.8',
    description: 'Symbol element added to Units, QuantityReferenceType gains a name attribute, and reference datatypes relax from IDREF to string.',
    organizations: ['NIST'],
    era: 'nist',
  },
  {
    year: '2006',
    date: 'May 11, 2006',
    title: 'UnitsML Schema 0.8.1',
    description: 'The enumeration on Unit/System/@type is removed.',
    organizations: ['NIST'],
    era: 'nist',
  },
  {
    year: '2006',
    date: 'May 22, 2006',
    title: 'UnitsML Schema 0.9',
    description: 'NoteType introduced; ConversionFactor\'s note becomes ConversionNote and Unit gains a UnitNote element.',
    organizations: ['NIST'],
    era: 'nist',
  },
  {
    year: '2006',
    date: 'June 23, 2006',
    title: 'UnitsML Schema 0.9.1',
    description: 'ThermoTemp renamed to ThermodynamicTemperature, asciiSymbol attributes replaced by Symbol entities, and powerNumerator becomes required.',
    organizations: ['NIST'],
    era: 'nist',
  },
  {
    year: '2006',
    date: 'July 2006',
    title: 'OASIS Technical Committee formed',
    description: 'The OASIS TC "UnitsML" is formed with its first official teleconference on July 12, convened by Simon Frechette (NIST).',
    people: ['Simon Frechette', 'Mark Carlisle', 'Bob Dragoset', 'Karen Olsen', 'Gary Kramer', 'Peter Lindstrom', 'Kent Reed', 'Evan Wallace'],
    organizations: ['NIST', 'OASIS', 'IBM', 'Granta Design', 'NPL'],
    era: 'oasis',
  },
  {
    year: '2006',
    date: 'July 24, 2006',
    title: 'UnitsML Schema 0.9.2',
    description: 'Schema documentation added; Unit references Prefix directly, and the unused asciisymbols type is removed.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2006',
    date: 'August 16, 2006',
    title: 'UnitsML Schema 0.9.2.1',
    description: 'Prefix attributes become optional with defaults (SI system, base 10); power numerator and denominator default to 1.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2006',
    date: 'November 3, 2006',
    title: 'UnitsML Schema 0.9.3',
    description: 'Default values added for power exponents and prefix system/base attributes across UnitType, UnitRepresentationType, and PrefixType.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2007',
    date: 'February 12, 2007',
    title: 'UnitsML Schema 0.9.4',
    description: 'BaseUnits framework introduced with enumerated and external base units — including a 210-unit list provided by Peter Linstrom — plus an enumerated SI prefix list.',
    people: ['Peter Linstrom'],
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2007',
    date: 'March 13, 2007',
    title: 'UnitsML Schema 0.9.5',
    description: 'BaseUnits renamed to RootUnits; the enumerated unit list switches from UN/CEFACT codes to English names, binary prefixes are added, and the Conversions/ConversionFrom elements are introduced.',
    people: ['Peter Linstrom'],
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2007',
    date: 'April 10, 2007',
    title: 'UnitsML Schema 0.9.6',
    description: 'ConversionFrom renamed to Float64ConversionFrom with a combined URI/ID initialUnit; the Representation element is removed in favor of RootUnits and Conversions, and code-list elements are added for external unit codes.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2007',
    date: 'May 8, 2007',
    title: 'UnitsML Schema 0.9.7',
    description: 'SpecialConversion added; a timeStamp attribute tracks substantive unit changes, and 22 atomic and 10 natural units join the enumerated root unit list.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2007',
    date: 'June 9, 2007',
    title: 'UnitsML Schema 0.9.8',
    description: 'Unit identifiers consolidated into @unitID; SpecialConversion becomes SpecialConversionFrom, and Quantity/UnitReference becomes optional and unbounded.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2007',
    date: 'September 12, 2007',
    title: 'UnitsML Schema 0.9.9',
    description: 'Enumerated unit names normalized (degree_Celsius, electronvolt, knot, standard_atmosphere); torr and unified atomic mass unit added.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2008',
    date: 'January 16, 2008',
    title: 'UnitsML Schema 0.9.10',
    description: 'DimensionSet created at the top level, moving Dimension out of Quantity and adding rational power exponents to each dimension element.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2008',
    date: 'June 24, 2008',
    title: 'UnitsML Schema 0.9.11',
    description: 'Unit and Quantity notes become VersionHistory elements; ItemType allows counted items in dimension expressions, and special conversions gain external URIs.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2008',
    date: 'July 9, 2008',
    title: 'UnitsML Schema 0.9.12',
    description: 'WSDL-based conversions introduced via WSDLConversionFrom alongside Float64 conversions; a dimensionless flag is added to DimensionType.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2008',
    date: 'September 15, 2008',
    title: 'UnitsML Schema 0.9.13',
    description: 'CountedItem support added; binary prefixes Zi and Yi join the prefix list, and source/language attributes become global.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2008',
    date: 'October 14, 2008',
    title: 'UnitsML Schema 0.9.14',
    description: 'URL naming normalized across conversion and reference attributes (@wsdlURL, @initialUnit, @conversionURL), and the xml:lang namespace is adopted.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2008',
    date: 'November 12, 2008',
    title: 'UnitsML Schema 0.9.15',
    description: 'Notes and definitions become unbounded to support multiple languages; SymbolType switches to anyType so symbols can contain markup, and CountedItem gains history and remark elements.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2008',
    date: 'December 9, 2008',
    title: 'UnitsML Schema 0.9.16',
    description: 'Global attributes regrouped into attribute groups; prefix definitions return via PrefixSet/Prefix, all IDs migrate to xml:id, and QuantityReference adopts quantityURL.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2009',
    date: 'January 14, 2009',
    title: 'UnitsML Schema 0.9.17',
    description: 'xml:id required on all primary elements; U.S. survey and FDA label units added with the us_ prefix, and unbounded dimension sequences allow complex dimension expressions.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2009',
    date: 'June 16, 2009',
    title: 'UnitsML Schema 0.9.18',
    description: 'ReferenceType unifies unit and quantity references; bit and byte join the enumerated root units, and code-list values move directly into UnitType.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2010',
    date: 'January 2010',
    title: 'NVUnitsML demo published',
    description: 'An interactive browser-based demo shows unit conversions driven by UnitsML 0.9.18 and XSLT stylesheets.',
    people: ['Peter Linstrom'],
    organizations: ['NIST'],
    era: 'oasis',
  },
  {
    year: '2010',
    date: 'April 13, 2010',
    title: 'UnitsML Schema 0.9.19',
    description: 'PlaneAngle added to DimensionType, xml:lang allowed on prefix symbols, and the U95 uncertainty-radius attributes removed.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2011',
    date: 'January 21, 2011',
    title: 'UnitsML v1.0-csd01',
    description: 'First OASIS Committee Specification Draft, with typographical fixes to the enumerated root unit list (us_gill, polarizability).',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2011',
    date: 'February 4, 2011',
    title: 'UnitsML v1.0-csd02',
    description: 'Version-history elements repositioned within CountedItem and Unit for consistent ordering.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2011',
    date: 'April 13, 2011',
    title: 'UnitsML v1.0-csd03',
    description: 'The enumerated root unit kilogram_force is corrected to gram_force.',
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2011',
    date: 'December 2011',
    title: 'UnitsML v1.0-csd04 approved',
    description: 'The OASIS TC approves UnitsML v1.0 Committee Specification Draft 04, adding light-time units and refining Avoirdupois units.',
    people: ['Bob Dragoset', 'Peter Linstrom', 'Martin Weber', 'Karen Olsen'],
    organizations: ['NIST', 'OASIS'],
    era: 'oasis',
  },
  {
    year: '2016',
    date: '2016',
    title: 'OASIS TC completes work',
    description: 'The OASIS Technical Committee for UnitsML is closed after completing its mandate at that stage.',
    organizations: ['OASIS'],
    era: 'oasis',
  },
  {
    year: '2020',
    date: '2020',
    title: 'Revival',
    description: 'UnitsML work continues through collaboration between NIST and Ribose, renewing the effort for modern standards.',
    people: ['Karen Olsen', 'Nick Nicholas'],
    organizations: ['NIST', 'Ribose'],
    era: 'calconnect',
  },
  {
    year: '2021',
    date: 'February 2021',
    title: 'UnitsDB archive preserved',
    description: 'The original NIST UnitsDB XML dumps are imported into the unitsdb-archive repository, preserving the complete 0.9.18 and 1.0 schema datasets.',
    people: ['Ronald Tse'],
    organizations: ['Ribose'],
    era: 'calconnect',
  },
  {
    year: '2022',
    date: 'September 2022',
    title: 'CalConnect TC UNITS established',
    description: 'CalConnect creates TC UNITS to carry on the UnitsML work. Karen Olsen (NIST) and Nick Nicholas (Ribose) co-chair the technical committee. Presentations are given at SciDataCon 2022 (June) and to CIPM/BIPM (September).',
    people: ['Karen Olsen', 'Nick Nicholas'],
    organizations: ['CalConnect', 'NIST', 'Ribose', 'BIPM'],
    era: 'calconnect',
  },
  {
    year: '2025',
    date: 'May 2025',
    title: 'UnitsDB 1.0 & 2.0 released',
    description: 'UnitsDB 1.0 (March) delivers the first stable release. UnitsDB 2.0 (May) introduces organization-neutral identifiers, multilingual names from BIPM, and cross-references to the BIPM SI Digital Framework, UCUM, and QUDT.',
    people: ['Karen Olsen', 'Nick Nicholas', 'Ronald Tse'],
    organizations: ['CalConnect', 'NIST', 'Ribose'],
    era: 'calconnect',
  },
]

const expanded = ref<Set<number>>(new Set())

function toggle(index: number) {
  const s = new Set(expanded.value)
  if (s.has(index)) s.delete(index)
  else s.add(index)
  expanded.value = s
}

const eraLabels: Record<string, string> = {
  nist: 'NIST Era',
  oasis: 'OASIS Era',
  calconnect: 'CalConnect Era',
}
</script>

<template>
  <div class="history-timeline">
    <div
      v-for="(event, i) in events"
      :key="i"
      class="history-item"
      :class="[`era-${event.era}`, { 'first-of-era': i === 0 || events[i-1].era !== event.era }]"
    >
      <div v-if="i === 0 || events[i-1].era !== event.era" class="era-banner">
        <span class="era-label">{{ eraLabels[event.era] }}</span>
      </div>

      <div class="history-marker">
        <span class="year-label">{{ event.year }}</span>
        <div class="marker-dot"></div>
        <div v-if="i < events.length - 1" class="marker-line"></div>
      </div>

      <div class="history-content" @click="toggle(i)">
        <div class="history-header">
          <div>
            <span class="event-date">{{ event.date }}</span>
            <h4>{{ event.title }}</h4>
          </div>
          <svg class="chevron" :class="{ rotated: expanded.has(i) }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>

        <p class="history-desc">{{ event.description }}</p>

        <blockquote v-if="event.quote" class="history-quote">{{ event.quote }}</blockquote>

        <div v-if="event.people || event.organizations" class="history-meta" :class="{ show: expanded.has(i) }">
          <div v-if="event.organizations?.length" class="orgs">
            <span v-for="org in event.organizations" :key="org" class="org-badge">{{ org }}</span>
          </div>
          <div v-if="event.people?.length" class="people">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="people-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="people-list">{{ event.people.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 2rem 0;
}

.era-banner {
  margin: 1.5rem 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.era-banner::before,
.era-banner::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}

.era-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.history-item {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.history-item.first-of-era {
  margin-top: 0.5rem;
}

.history-item.era-nist .marker-dot {
  background: var(--unitsml-navy);
}

.history-item.era-oasis .marker-dot {
  background: var(--unitsml-teal-dark);
}

.history-item.era-calconnect .marker-dot {
  background: var(--unitsml-teal);
  box-shadow: 0 0 0 4px rgba(48, 223, 192, 0.2);
}

.history-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 80px;
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

.history-content {
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

.history-item.era-nist .history-content {
  border-left-color: var(--unitsml-navy);
}

.history-item.era-oasis .history-content {
  border-left-color: var(--unitsml-teal-dark);
}

.history-item.era-calconnect .history-content {
  border-left-color: var(--unitsml-teal);
}

.history-content:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(45, 44, 105, 0.06);
}

.history-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.event-date {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  margin-bottom: 0.25rem;
}

.history-header h4 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.chevron {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: transform 0.3s ease;
  margin-top: 0.125rem;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.history-desc {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0.5rem 0 0;
}

.history-quote {
  margin: 0.75rem 0 0;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-left: 3px solid var(--unitsml-teal);
  border-radius: 0 8px 8px 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.history-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease;
  margin-top: 0;
}

.history-meta.show {
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
  .history-marker {
    width: 56px;
  }

  .year-label {
    font-size: 0.75rem;
  }

  .history-content {
    padding: 1rem;
  }
}
</style>
