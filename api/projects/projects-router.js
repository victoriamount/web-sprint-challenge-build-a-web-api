// Write your "projects" router here!
const express = require('express')
const Projects = require('./projects-model')
const Actions = require('../actions/actions-model')

const router = express.Router()



router.get('/', (req, res) => {
    Projects.get()
        .then(projs => {
            res.status(200).json(projs)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error retrieving projects' })
        })
})

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
})

router.post('/',  validateProjectBody, (req, res) => {
    Projects.insert(req.body)
        .then(newProj => {
            res.status(201).json(newProj)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error adding project' })
        })
})

router.put('/:id', validateProjectId, validateProjectBody, (req, res) => {
    Projects.update(req.params.id, req.body) 
        .then(updatedProj => {
            res.status(200).json(updatedProj)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error updating project' })
        })
})

router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.params.id)
        .then(numDel => {
            res.status(200).json({ message: 'the project has been deleted' })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error deleting project' })
        })
})

router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.params.id)
        .then(actArray => {
            res.status(200).json(actArray)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: `error retrieving actions for project ${req.params.id}`})
        })
})

async function validateProjectId(req, res, next) {
    const { id } = req.params
    try {
      const project = await Projects.get(id)
      if (!project) {
        console.log('project not validated')
        res.status(404).json({ message: "project not found" })
      } else {
        console.log('project validated')
        req.project = project
        next()
      }
    }
    catch(err) {
      res.status(400).json({ message: "invalid project id" })
    }
}

async function validateProjectBody(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!req.body.name || !req.body.description) {
        res.status(400).json({ message: "missing required name or description field" })
    } else {
        console.log('new project credentials valid')
        next()
    }
}

module.exports = router