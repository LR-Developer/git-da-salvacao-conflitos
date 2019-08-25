const Mongo = require('./db/strategies/mongodb/mongodb')
const Context = require('./db/strategies/base/contextStrategy')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema')
const HeroRoutes = require('./routes/HeroRoutes')
const Hapi = require('hapi')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = await Mongo.connect()
    const context = new Context(new Mongo(HeroesSchema, connection))

    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.port)

    return app
}

module.exports = main() 
