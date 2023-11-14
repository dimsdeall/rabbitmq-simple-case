import express from 'express';
import amqp, { Channel, Connection } from 'amqplib'
import config from '../env.config'

const app = express()
const port = 3000
const exchangeName = 'pubsubConnection'

let channel: Channel, connection: Connection

async function configRabbitMq() {
    // try {
        connection = await amqp.connect(config.rabbitMqUrl)
        channel = await connection.createChannel()
        await channel.assertExchange(exchangeName, 'fanout', { durable: true });
        console.info('RabbitMQ Producer Conneted')
    // } catch (error) {
    //     console.error({error})
    // }
}


app.get('/', async (req, res) => {
    connection = await amqp.connect(config.rabbitMqUrl)
    channel = await connection.createChannel()
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });
    console.info('RabbitMQ Producer Conneted')

    channel.publish(exchangeName, '', Buffer.from('example pub/sub'))
    console.info('>>>> Publish Message Pub/Sub')
    res.status(200).json({
        message: 'success'
    })
    setTimeout(() => {
        channel.close()
        connection.close()
    }, 7000);
})

// configRabbitMq()
app.listen(port, () => {
    console.log(`producer on port ${port}`);

})
