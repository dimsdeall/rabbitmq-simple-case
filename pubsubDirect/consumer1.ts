import amqp, { Channel, Connection } from 'amqplib'
import config from '../env.config'

const exchangeName = 'pubsubExchangeDirect'
const queueName = 'pubsubQueueDirect1'

let channel: Channel, connection: Connection

async function subscribeRabbitMq() {
    try {
        connection = await amqp.connect(config.rabbitMqUrl)
        channel = await connection.createChannel()
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        const { queue } = await channel.assertQueue(queueName, { exclusive: true });

        channel.bindQueue(queue, exchangeName, 'consum');
        console.log(`Consumer 1 now subscribe....`);

        channel.consume(queue, (message) => {
            if (message && message.content) {
                console.log(`Receive on Consumer 1: ${message.content.toString()}`);
            }
        }, { noAck: true });

    } catch (error) {
        console.error(error)
    }
}

subscribeRabbitMq()
