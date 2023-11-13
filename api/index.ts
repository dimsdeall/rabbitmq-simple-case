import express from "express";
import axios from 'axios'
import config from '../env.config'
const app = express()
const port = 4000

const auth = {
    username: config.rabbitmqUser,
    password: config.rabbitmqPass,
};

app.get('/', async (req, res) => {
    return await axios.get(`${config.rabbitmqHttp}/api/definitions`, {auth})
        .then((response) => {
            return res.status(200).send({response: response.data})
        })
        .catch(err => {
            return res.status(403).json({err})
        })
})

app.get('/exchanges', async (req, res) => {
    return await axios.get(`${config.rabbitmqHttp}/api/exchanges`, {auth})
        .then((response) => {
            return res.status(200).send({response: response.data})
        })
        .catch(err => {
            return res.status(403).json({err})
        })
})



app.listen(port, () => {
    console.log(`Api listen port ${port}`);
})