import 'dotenv/config'

export default {
    rabbitMqUrl: process.env.RABBIT_MQ_URL ?? '',
    rabbitmqHttp: process.env.RABBITMQ_HTTP ?? '',
    rabbitmqUser: process.env.RABBITMQ_USER ?? '',
    rabbitmqPass: process.env.RABBITMQ_PASS ?? ''
}