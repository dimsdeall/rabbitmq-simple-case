import express from 'express';
import amqp, { Channel, Connection } from 'amqplib'
import config from '../env.config'

const app = express()
const port = 3000
const exchangeName = 'pubsubExchangeDirect'

let channel: Channel, connection: Connection

async function configRabbitMq() {
    try {
        connection = await amqp.connect(config.rabbitMqUrl)
        channel = await connection.createChannel()
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        console.info('RabbitMQ Producer Conneted')
    } catch (error) {
        console.error({error})
    }
}


app.get('/', (req, res) => {
    channel.publish(exchangeName, 'consum', Buffer.from('example pub/sub'))
    console.info('>>>> Publish Message Pub/Sub Direct')
    res.status(200).json({
        message: 'success'
    })
})

configRabbitMq()
app.listen(port, () => {
    console.log(`producer on port ${port}`);

})
