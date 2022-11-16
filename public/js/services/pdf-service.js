export default {
    buildBugsPDF,
}

function buildBugsPDF() {
    console.log('downloading');

    return axios.get('/api/bug/pdf')
        .then(file => {
            console.log('got file');
            return file
        })
}