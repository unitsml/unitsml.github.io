import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HomePage from './components/HomePage.vue'
import BlogIndex from './components/BlogIndex.vue'
import BlogByline from './components/BlogByline.vue'
import EcosystemDiagram from './components/EcosystemDiagram.vue'
import DataModelDiagram from './components/DataModelDiagram.vue'
import UnitsDBDiagram from './components/UnitsDBDiagram.vue'
import UnitsDBComposite from './components/UnitsDBComposite.vue'
import UnitsDBBrowser from './components/UnitsDBBrowser.vue'
import UnitsDBEntityDetail from './components/UnitsDBEntityDetail.vue'
import TimelineSection from './components/TimelineSection.vue'
import PeopleGrid from './components/PeopleGrid.vue'
import FAQAccordion from './components/FAQAccordion.vue'
import NavScrollHandler from './components/NavScrollHandler.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(NavScrollHandler)
    })
  },
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('BlogIndex', BlogIndex)
    app.component('BlogByline', BlogByline)
    app.component('EcosystemDiagram', EcosystemDiagram)
    app.component('DataModelDiagram', DataModelDiagram)
    app.component('UnitsDBDiagram', UnitsDBDiagram)
    app.component('UnitsDBComposite', UnitsDBComposite)
    app.component('UnitsDBBrowser', UnitsDBBrowser)
    app.component('UnitsDBEntityDetail', UnitsDBEntityDetail)
    app.component('TimelineSection', TimelineSection)
    app.component('PeopleGrid', PeopleGrid)
    app.component('FAQAccordion', FAQAccordion)
  }
}
