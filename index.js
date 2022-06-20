require('dotenv').config()
const express = require('express')

const app = express()

let store = []

app.listen(process.env.PORT, () => {
    console.log('Here we go')
})

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome to VFS bot'))
bot.command('join', (ctx) => {
    const found = store.find(item => item.update.message.from.id === ctx.update.message.from.id)
    if (!found) {
        store.push(ctx)
    }
    ctx.reply('Join')
})
bot.command('quit', (ctx) => {
    store = store.filter(item => {
        return item.update.message.from.id !== ctx.update.message.from.id
    })
    ctx.reply('Quit')
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


app.get('/ready', (req, res) => {
    store.forEach(ctx => {
        ctx.reply('VFS is open!')
    })
    res.end()
})