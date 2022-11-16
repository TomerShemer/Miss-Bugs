'use strict'

import { bugService } from '../services/bug-service.js'
import { eventBus, showErrorMsg, showSuccessMsg } from '../services/eventBus-service.js'

export default {
  template: `
    <section v-if="bug" class="bug-edit">
        <h1>{{(bug._id) ? 'Edit Bug': 'Add Bug'}}</h1>
        <form @submit.prevent="saveBug">
            <label> 
                <span>Title: </span>
                <input required type="text" v-model="bug.title" placeholder="Enter title...">
            </label>
            <label>
                <span>Severity: </span>
                <input required type="number" v-model="bug.severity" placeholder="Enter severity..." min="0" max="3">
            </label>
            <label>
              <span>Description: </span>
              <input required type="text" v-model="bug.description" placeholder="Enter description..." />
            </label>
            <div class="actions">
              <button type="submit"> {{(bug._id) ? 'Save': 'Add'}}</button>
              <button @click.prevent="closeEdit">Close</button>
            </div>
        </form>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug
      })
    } else this.bug = bugService.getEmptyBug()
  },
  methods: {
    saveBug() {
      // if (!this.bug.title || !this.bug.severity || !this.bug.description) eventBus.emit('show-msg', { txt: 'All fields must be filled out.', type: 'error' })
      // else {
      //   if (!this.bug._id) this.bug.createdAt = Date.now()
      //   bugService.save({ ...this.bug }).then(() => {
      //     eventBus.emit('show-msg', { txt: 'Bug saved successfully', type: 'success' })
      //     this.$router.push('/bug')
      //   })
      // }
      if (!this.bug._id) this.bug.createdAt = Date.now()
      bugService.save(this.bug)
        .then(bug => {
          console.log('Saved bug:', bug);
          // showSuccessMsg('Bug saved successfully')
          this.$router.push('/bug')
        })
        .catch(err => {
          console.log(err)
          // showErrorMsg('Error, please try again')
        })
    },
    closeEdit() {
      this.$router.push('/bug')
    },
  },
}
