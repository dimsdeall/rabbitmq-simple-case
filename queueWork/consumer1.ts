import amqlib, { Channel, Connection } from 'amqplib'
import config from '../env.config'

let connection: Connection, channel: Channel
const queueName = 'queueWork'

async function configRabbit() {
    try {
        connection = await amqlib.connect(config.rabbitMqUrl)
        channel = await connection.createChannel()
        await channel.assertQueue(queueName, { durable: true })

        console.log('Consumer 1 subscribe now...')

        channel.consume(queueName, (message) => {
            if (message) {
                console.log(`Receive on Consumer 1: ${message.content.toString()}`)
            }
        }, { noAck: false })

    } catch (error) {
        console.log(error);
    }
}

configRabbit()