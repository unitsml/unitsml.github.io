<script setup lang="ts">
import { ref } from 'vue'

interface FAQItem {
  question: string
  answer: string
}

interface FAQGroup {
  title: string
  icon: string
  items: FAQItem[]
}

const groups: FAQGroup[] = [
  {
    title: 'General',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5"/></svg>`,
    items: [
      {
        question: 'What is UnitsML?',
        answer: 'UnitsML is a set of models for unambiguously encoding and identifying scientific units of measure and quantities. It can be used in XML and other markup languages, improving interoperability between different systems. It was developed in response to numerous requests that NIST address this issue, since NIST is responsible for interpreting the International System of Units (SI) for use in the U.S.'
      },
      {
        question: 'What is the scope of this effort?',
        answer: 'The TC develops and publishes a specification that enables the unambiguous representation of units of measure, expressed as XML schemas and generalizable to other formats. Out of scope: 1) the design of UnitsDB (except where it relates to the UnitsML schema), 2) generation of unit codes/symbols, and 3) related properties like uncertainty.'
      },
      {
        question: 'What are the use cases?',
        answer: 'UnitsML may be used with any markup language or system which has data that contains units of measure — in commerce, engineering, and science. Examples include laboratory data management, geographical information systems, and commerce based on physical properties.'
      },
      {
        question: 'What is an example of a concrete application?',
        answer: 'This standard greatly improves the ability to reliably exchange scientific data, particularly in areas where data is exchanged between different disciplines or business sectors — e.g., interpreting data from disparate sources during emergencies, or technical specifications in the manufacturing supply chain.'
      },
    ]
  },
  {
    title: 'Integration & Usage',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
    items: [
      {
        question: 'How is UnitsML used with other standards?',
        answer: 'UnitsML is explicitly designed as a component for constructing other markup languages and information systems. Other languages can: 1) incorporate UnitsML to provide ready-made markup for units, or 2) refer to UnitsML definitions even without using UnitsML notation directly. Both approaches improve interoperability.'
      },
      {
        question: 'Is usage mandatory or optional?',
        answer: 'Use of UnitsML is completely optional. Existing systems with domain-specific markup need not convert. However, UnitsML\'s advantages — ready-made markup and improved interoperability — make a compelling case for new projects.'
      },
      {
        question: 'How might UnitsML be incorporated?',
        answer: 'There are several ways: referencing the schema, including the schema, importing the schema, and redefining schema elements. For details, see "Improving Interoperability by Incorporating UnitsML into Markup Languages."'
      },
    ]
  },
  {
    title: 'UnitsDB',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    items: [
      {
        question: 'What is UnitsDB?',
        answer: 'UnitsDB is a database under development at NIST containing extensive information on scientific units of measure. Its output is available in UnitsML and HTML, with both human and Web Services interfaces.'
      },
      {
        question: 'What is the relationship between UnitsML and UnitsDB?',
        answer: 'UnitsDB outputs data in UnitsML format. The UnitsML schema is also incorporated into other markup languages for handling units of measure. They are complementary: UnitsDB provides the data, UnitsML provides the schema.'
      },
      {
        question: 'Does UnitsML only work with UnitsDB?',
        answer: 'No. UnitsML schema integrates natively with UnitsDB, but can also encode units of measure within other markup languages independently.'
      },
    ]
  },
]

const openItems = ref<Set<string>>(new Set())

function toggle(groupIdx: number, itemIdx: number) {
  const key = `${groupIdx}-${itemIdx}`
  const s = new Set(openItems.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  openItems.value = s
}
</script>

<template>
  <div class="faq-sections">
    <div v-for="(group, gi) in groups" :key="group.title" class="faq-group">
      <h3 class="faq-group-title">
        <span class="faq-group-icon" v-html="group.icon"></span>
        {{ group.title }}
      </h3>
      <div class="faq-items">
        <div
          v-for="(item, ii) in group.items"
          :key="ii"
          class="faq-item"
          :class="{ open: openItems.has(`${gi}-${ii}`) }"
        >
          <button class="faq-question" @click="toggle(gi, ii)">
            <span>{{ item.question }}</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          <div class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.faq-group-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.faq-group-icon {
  color: var(--vp-c-brand-1);
  display: flex;
}

.faq-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: var(--vp-c-bg-soft);
}

.faq-item.open {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.faq-item:hover:not(.open) {
  border-color: rgba(45, 44, 105, 0.3);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: inherit;
  line-height: 1.5;
}

.faq-question:hover {
  color: var(--vp-c-brand-1);
}

.faq-chevron {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
  color: var(--vp-c-brand-1);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.open .faq-answer {
  max-height: 300px;
}

.faq-answer p {
  padding: 0 1.25rem 1.25rem;
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>
