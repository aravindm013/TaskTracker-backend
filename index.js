const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json())
const port = 3055

mongoose.connect('mongodb://localhost:27017/feb2020')
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log('error connecting to db', err)
    })

const Schema = mongoose.Schema
const taskSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    reminder: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.model('Task', taskSchema)

app.get('/', (req, res) => {
    res.send('Welcome to the website')
})

app.get('/api/tasks', (req,res) => {
    Task.find()
        .then((tasks) => {
            res.json(tasks)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})

app.post('/api/tasks', async (req, res) => {
    const body = req.body
    const task = new Task(body)
    task.save()
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})

app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id
    Task.findByIdAndDelete(id)
        .then((task) => {
            res.status(200).json(task)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})

app.listen(port, () => {
    console.log('server is running on port', port)
})