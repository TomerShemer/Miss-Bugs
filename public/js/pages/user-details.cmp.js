import { userService } from "../services/user-service.js"
import { bugService } from "../services/bug-service.js"

import bugList from '../cmps/bug-list.cmp.js'

export default {
    props: [],
    template: `
        <section className="user-details">
            <router-link to="/bug"><button>Go back</button></router-link>
            <h2>Your bugs:</h2>
            <bug-list v-if="bugs" :bugs="bugs"></bug-list>
        </section>
    `,
    data() {
        return {
            user: null,
            bugs: null,
        }
    },
    methods: {
    },
    computed: {

    },
    created() {
        this.user = userService.getLoggedInUser()
        // console.log('this.user', this.user)
        bugService.query({ owner: this.user })
            .then(ownedBugs => {
                this.bugs = ownedBugs
                console.log('ownedBugs', ownedBugs)
            })

    },
    components: {
        bugList
    }
}