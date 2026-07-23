<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

function getPath() {
  return typeof window !== 'undefined' ? window.location.pathname : '/'
}

function isHomePage() {
  return getPath() === '/' || getPath() === '/index.html'
}

function handleScroll() {
  if (!isHomePage()) {
    // Non-home pages: always show nav logo
    document.body.style.removeProperty('--nav-logo-progress')
    document.body.classList.remove('home-logo-hidden')
    document.body.classList.add('home-logo-visible')
    return
  }

  // Home page: calculate how far the hero logo has scrolled
  const heroLogo = document.querySelector('.home-hero-logo') as HTMLElement | null
  let progress = 0

  if (heroLogo) {
    const rect = heroLogo.getBoundingClientRect()
    // The hero logo starts visible. As it scrolls up, progress goes from 0 to 1.
    // When the logo's bottom edge reaches the nav bar area, progress = 1.
    const navBottom = 56 // approximate nav bar height
    const logoBottom = rect.bottom
    const travelDistance = rect.height + 80 // total distance the logo can travel

    if (logoBottom <= navBottom) {
      progress = 1
    } else if (logoBottom >= navBottom + travelDistance) {
      progress = 0
    } else {
      progress = 1 - (logoBottom - navBottom) / travelDistance
    }
  } else {
    // Fallback: use scroll position
    progress = Math.min(1, window.scrollY / 300)
  }

  progress = Math.max(0, Math.min(1, progress))

  // Apply CSS custom property for fine-grained animation control
  document.body.style.setProperty('--nav-logo-progress', String(progress))

  if (progress > 0.15) {
    document.body.classList.remove('home-logo-hidden')
    document.body.classList.add('home-logo-visible')
  } else {
    document.body.classList.remove('home-logo-visible')
    document.body.classList.add('home-logo-hidden')
  }
}

function init() {
  // Force initial state without transition on first paint
  if (isHomePage()) {
    document.body.classList.add('no-transition')
    document.body.classList.add('home-logo-hidden')
    document.body.classList.remove('home-logo-visible')
    document.body.style.setProperty('--nav-logo-progress', '0')
    // Allow transitions to activate after the browser has painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('no-transition')
      })
    })
  } else {
    document.body.classList.remove('home-logo-hidden')
    document.body.classList.add('home-logo-visible')
    document.body.style.removeProperty('--nav-logo-progress')
  }
  handleScroll()
}

let scrollRevealObserver: IntersectionObserver | null = null

onMounted(() => {
  init()
  window.addEventListener('scroll', handleScroll, { passive: true })

  scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        scrollRevealObserver?.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal').forEach(el => scrollRevealObserver!.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <!-- Invisible component — manages nav logo visibility via body CSS classes -->
</template>
