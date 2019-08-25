const Mongo = require('./db/strategies/mongodb/mongodb')
const Contexto = require('./db/strategies/base/contextStrategy')
const SchemaHerois = require('./db/strategies/mongodb/schemas/heroesSchema')
const RotasHerois = require('./routes/HeroRoutes')
const Hapi = require('hapi')

const aplicacao = new Hapi.Server({
    port: 5000
})

function mapRotas(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = await Mongo.connect()
    const context = new Contexto(new Mongo(SchemaHerois, connection))

    aplicacao.route([
        ...mapRotas(new RotasHerois(context), RotasHerois.methods())
    ])

    await aplicacao.start()
    console.log('Servidor rodando na porta', aplicacao.info.port)

    return aplicacao
}

module.exports = main() 
