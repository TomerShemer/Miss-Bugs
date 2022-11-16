const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service')
const pdfService = require('./services/pdf.service')
const userService = require('./services/user.service.js')
const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// LIST
app.get('/api/bug', (req, res) => {
    const { title, page } = req.query

    let owner = null
    if (req.query?.owner) owner = JSON.parse(req.query.owner)
    // console.log('owner', JSON.parse(owner))

    const filterBy = {
        title: title || '',
        page: +page || 0,
        owner: owner || '',
    }
    bugService.query(filterBy)
        .then(bugs => {
            // console.log(bugs);
            res.send(bugs)
        })
})

// READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    // console.log('req.cookies.visitedBugs', req.cookies.visitedBugs)

    let visitedBugs = req.cookies.visitedBugs || []
    // console.log('visitedBugs', visitedBugs)

    if (visitedBugs.length >= 3) {
        console.log('User has visited more than 3 bugs');
        return res.status(401).send('Wait for a bit')
    }

    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 12000 })

    bugService.getBugById(bugId)
        .then(bug => res.send(bug))
})

// ADD
app.post('/api/bug', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot add bug, not a logged in user')

    // console.log('req.query', req.query)
    const { title, description, severity, createdAt } = req.body

    const bug = {
        title,
        description,
        severity,
        createdAt,
        owner: loggedInUser
    }

    bugService.save(bug)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot save bug')
        })
})

// UPDATE
app.put('/api/bug/:bugId', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot update bug, not a logged in user')

    //TODO add owner validation

    const { _id, title, description, severity, createdAt } = req.body

    const bug = {
        _id,
        title,
        description,
        severity,
        createdAt
    }

    bugService.save(bug, loggedInUser)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot save bug')
        })
})

// DELETE
app.delete('/api/bug/:bugId/', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot update bug, not a logged in user')
    console.log('loggedInUser', loggedInUser)
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`Bug ${bugId} removed!`))
        .catch(err => {
            console.log('OOPS:', err)
            res.status(400).send('Unknown bug')
        })
})

// app.get('/api/bug/pdf', (req, res) => {
//     bugService.query()
//         .then(bugs => {
//             pdfService.buildBugsPDF(bugs)
//         })
// })

// LOGIN
app.post('/api/auth/login', (req, res) => {
    userService.checkLogin(req.body)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid credentials')
            }
        })

})

// SIGNUP
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body)
        .then(user => {
            // console.log('user', user)
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

// LOGOUT

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})


const PORT = process.env.PORT || 3030

app.listen(PORT, () =>
    console.log(`Server ready at port http://127.0.0.1:${PORT}/`)
)