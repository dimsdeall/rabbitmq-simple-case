import amqp, { Channel, Connection } from 'amqplib'
import config from '../env.config'

const exchangeName = 'pubsubTopic'
const queueName = 'pubsubQueue2'

let channel: Channel, connection: Connection

async function subscribeRabbitMq() {
    try {
        connection = await amqp.connect(config.rabbitMqUrl)
        channel = await connection.createChannel()
        await channel.assertExchange(exchangeName, 'topic', { durable: true });
        const { queue } = await channel.assertQueue(queueName, { exclusive: true });

        channel.bindQueue(queue, exchangeName, '#.cons2.#');
        console.log(`Consumer 2 now subscribe....`);

        channel.consume(queue, (message) => {
            if (message && message.content) {
                console.log(`Receive on Consumer 2: ${message.content.toString()}`);
            }
        }, { noAck: true });

    } catch (error) {
        console.error(error)
    }
}

subscribeRabbitMq()
