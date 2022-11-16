const fs = require('fs')
const gBugs = require('../data/bug.json')

module.exports = {
    query,
    save,
    getBugById,
    remove
}

const itemsPerPage = 3
function query(filterBy) {
    const { title, page } = filterBy

    if (filterBy.owner) {
        console.log('Getting owned bugs');
        console.log('filterBy.owner', filterBy.owner)
        const ownedBugs = gBugs.filter(bug => {
            // console.log('bug', bug)
            console.log(bug.owner._id);
            console.log(filterBy.owner._id);
            return bug.owner._id === filterBy.owner._id
        })
        return Promise.resolve(ownedBugs)
    }

    const regex = new RegExp(title, 'i')
    let filteredBugs = gBugs.filter(bug => regex.test(bug.title))
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)

    filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)

    return Promise.resolve({ totalPages, filteredBugs })
}

function getBugById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Unkown bug')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    if (!idx) return Promise.reject('Unkown bug')
    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedInUser) {
    if (bug._id) {
        const idx = gBugs.findIndex(currBug => currBug._id === bug._id)
        if (gBugs[idx].owner._id !== loggedInUser._id) return Promise.reject('Not your bug')
        // gBugs[idx] = bug
        gBugs[idx].title = bug.title
        gBugs[idx].description = bug.description
        gBugs[idx].severity = bug.severity
    } else {
        bug._id = _makeId()
        gBugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

// PRIVATE FUNCTIONS

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

// function _createDefaultBugs() {
//     return [
//         {
//             _id: _makeId(),
//             title: 'Button is missing',
//             description: 'No button found',
//             severity: 1,
//         },
//         {
//             _id: _makeId(),
//             title: 'Error while watching',
//             description: 'Cant get content',
//             severity: 2,
//         },
//         {
//             _id: _makeId(),
//             title: 'Warning appears',
//             description: 'An error has occured',
//             severity: 3,
//         },
//     ]
// }