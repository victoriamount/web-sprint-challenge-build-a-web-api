// Write your "actions" router here!
const express = require('express')
const Actions = require('./actions-model')
const Projects = require('../projects/projects-model')
const actionsModel = require('./actions-model')

const router = express.Router()

router.get('/', (req, res) => {
    Actions.get()
        .then(acts => {
            res.status(200).json(acts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error retrieving actions' })
        }) 
})

router.get('/:id', validateId, (req, res) => {
    res.status(200).json(req.action)
})

router.post('/', validateActionBody, validateProjectId, (req, res) => {
    Actions.insert(req.body)   
        .then(newAct => {
            res.status(201).json(newAct)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error adding action' })
        })
})

router.put('/:id', validateId, validateActionBody, (req, res) => {
    Actions.update(req.params.id, req.body)
        .then(editedAct => {
            res.status(200).json(editedAct)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error updating action' })
        })
})

router.delete('/:id', validateId, (req, res) => {
    Actions.remove(req.params.id)
        .then(numDel => {
            if (numDel > 0) {
                res.status(200).json({ message: 'the action has been deleted' })
            } else {
                res.status(500).json({ message: 'error deleting action' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'error deleting action' })
        })
})


async function validateId(req, res, next) {
    const { id } = req.params
    try {
      const action = await Actions.get(id)
      if (!action) {
        console.log('action not validated')
        res.status(404).json({ message: "action not found" })
      } else {
        console.log('action validated')
        req.action = action
        next()
      }
    }
    catch(err) {
      res.status(400).json({ message: "invalid action id" })
    }
}

async function validateProjectId(req, res, next) {
    const { project_id } = req.body
    try {
      const project = await Projects.get(project_id)
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

async function validateActionBody(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing action data" })
      } else if (!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(400).json({ message: "missing required project_id, description, and/or notes fields" })
      } else {
        console.log('new action credentials valid')
        next()
      }
}

module.exports = router