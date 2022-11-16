'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> ||
          <!-- <button @click="downloadPDF">Download as PDF</button> -->
        </div>
        <div className="nav-paging"></div>
        <button @click="setPage(-1)">Prev</button>
        <span>Page {{filterBy.page + 1}} of {{totalPages}}</span>
        <button @click="setPage(1)">Next</button>
        <bug-list @setFilterBy="setFilterBy" v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        page: 0
      },
      totalPages: 0
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ totalPages, filteredBugs }) => {
        this.totalPages = totalPages
        this.bugs = filteredBugs
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
    // downloadPDF() {
    //   if (!this.bugs || !this.bugs.length) return console.log('No bugs to print');
    //   bugService.downloadPDF(this.bugs)
    // },
    setPage(diff) {
      this.filterBy.page += diff
      if (this.filterBy.page > this.totalPages - 1) this.filterBy.page = 0
      if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1
      this.loadBugs()
    }

  },
  computed: {
    bugsToDisplay() {
      if (!this.filterBy?.title) return this.bugs
      // return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
      const regex = new RegExp(this.filterBy.title, 'i')
      let bugs = this.bugs.filter(bug => regex.test(bug.title))
      //filter goes here
      return bugs
    },
  },
  components: {
    bugList,
    bugFilter,
  },
}
