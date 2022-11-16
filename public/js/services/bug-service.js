// import { storageService } from './async-storage-service.js'
// const STORAGE_KEY = 'bugDB'

// const pdfService = require('./pdf.service')
import pdfService from "./pdf-service.js"

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  downloadPDF
}

const BASE_URL = `/api/bug/`

function query(filterBy) {
  // return storageService.query(STORAGE_KEY)
  return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function getById(bugId) {
  // return storageService.get(STORAGE_KEY, bugId)
  return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
  // return storageService.remove(STORAGE_KEY, bugId)
  return axios.delete(BASE_URL + bugId)
    .then(res => res.data)
    .catch(err => {
      console.log('Cannot delete car:', err)
    })
}

function save(bug) {
  // if (bug._id) {
  //   return storageService.put(STORAGE_KEY, bug)
  // } else {
  //   return storageService.post(STORAGE_KEY, bug)
  // }

  // const url = BASE_URL + 'save'
  // var queryParams = `?title=${bug.title}&description=${bug.description}&severity=${bug.severity}&createdAt=${bug.createdAt}`
  // if (bug._id) queryParams += `&_id=${bug._id}`

  // return axios.get(url + queryParams, { params: bug }).then(res => res.data)

  if (bug._id) {
    return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
  } else {
    return axios.post(BASE_URL, bug).then(res => res.data)
  }

}

function getEmptyBug() {
  return {
    _id: '',
    title: '',
    description: '',
    severity: '',
    createdAt: null
  }
}

function downloadPDF() {
  pdfService.buildBugsPDF()
}