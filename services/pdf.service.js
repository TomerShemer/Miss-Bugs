const pdfkit = require('pdfkit')
const fs = require('fs')
// const blobStream = require('blob-stream')

module.exports = {
    buildBugsPDF
}

function buildBugsPDF(bugs, fileName = 'Bugs.pdf') {
    const doc = new pdfkit

    doc.pipe(fs.createWriteStream(fileName))

    bugs.forEach(bug => {
        doc
            .font('Helvetica')
            .fontSize(16)
            .text(`Bug: ${bug._id}`);
        doc
            .fontSize(25)
            .text(`Title: ${bug.title}`)
        doc
            .fontSize(18)
            .text(`Description: ${bug.description}`)
    })

    doc.end()
    // console.log('PDFing');
    // return Promise.resolve(file)
}
