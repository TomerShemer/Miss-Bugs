import { userService } from "../services/user-service.js"
import loginSignup from '../cmps/login-signup.cmp.js'


export default {
    template: `
        <header>
            <h1>Miss Bug</h1>
            <section v-if="user">
                <p>Welcome <router-link to="/user">{{user.fullname}}</router-link></p>
                <button @click="logout">Logout</button>
            </section>
            <section v-else>
                <login-signup @onChangeLoginStatus="onChangeLoginStatus"/>
            </section>
        </header>
    `,
    data() {
        return {
            user: userService.getLoggedInUser()
        }
    },
    methods: {
        onChangeLoginStatus() {
            this.user = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                    this.$router.push('/bug')
                })
        }
    },
    components: {
        loginSignup

    },
    computed: {

    }
}
