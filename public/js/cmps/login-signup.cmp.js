import { eventBus, showErrorMsg, showSuccessMsg } from "../services/eventBus-service.js"
import { userService } from "../services/user-service.js"

export default {
    props: [],
    template: `
        <section className="login-signup">
            <form @submit.prevent="login">
                <h3>Login:</h3>
                <input type="text" v-model="credentials.username" placeholder="Username" />
                <input type="password" v-model="credentials.password" placeholder="Password" />
                <button>Login</button>
            </form>
            <form @submit.prevent="signup">
                <h3>Signup</h3>
                <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
                <input type="text" v-model="signupInfo.username" placeholder="Username" />
                <input type="password" v-model="signupInfo.password" placeholder="Password" />
                <button>Signup</button>
            </form>
        </section>
    `,
    data() {
        return {
            credentials: {
                username: 'puki',
                password: '1234'
            },
            signupInfo: {
                fullname: '',
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            userService.login(this.credentials)
                .then(user => {
                    this.$emit('onChangeLoginStatus')
                    // showUserMsg('Logged in')
                })
                .catch(err => {
                    console.log('Cannot login', err)
                    // showErrorMsg('Cannot login')
                })
        },
        signup() {
            userService.signup(this.signupInfo)
                .then(user => {
                    this.$emit('onChangeLoginStatus')
                    // eventBus.showSuccessMsg({ txt: 'Signed up!', type: 'warning' })
                })
                .catch(err => {
                    console.log('Cannot signup', err)
                    // showErrorMsg('Cannot signup')
                })
        }
    },
    computed: {
    },
}