import express from 'express'
import amqlib, { Channel, Connection } from 'amqplib'
import config from '../env.config'
const app = express()
const port = 3000

let connection: Connection, channel: Channel
const queueName = 'queueWork'

async function configRabbit() {
    try {
        connection = await amqlib.connect(config.rabbitMqUrl)
        channel = await connection.createChannel()

        await channel.assertQueue(queueName, {
            durable: true,
            deadLetterExchange: "dead.exchange",
            deadLetterRoutingKey: `dead.${queueName}`
        })
    } catch (error) {
        console.log(error);
    }
}

configRabbit()

app.get('/', (req, res) => {
    try {
        channel.sendToQueue(queueName, Buffer.from('test queue'), {
            persistent: true
        })
        res.send({ message: 'success' })
    } catch (error) {
        res.status(401).send({ error })
    }
})

app.listen(port, () => {
    console.info(`Producer on port ${port}`)
})