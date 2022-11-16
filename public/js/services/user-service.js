const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
    getLoggedInUser,
    login,
    logout,
    signup
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            return setLoggedInUser(user)
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            return setLoggedInUser(user)
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function setLoggedInUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}