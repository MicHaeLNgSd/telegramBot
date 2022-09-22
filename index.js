const Telegraf = require("telegraf").Telegraf,
        os = require('node:os'),
        BOT_TOKEN = "5642426512:AAFd_5-C0yMO-RoN9s3fTYfBFXUObBcDXac";
const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx=>{
    ctx.reply("Вітаємо в нашому боті!))")
})

bot.hears([/Привіт+/i, /Hello+/i, /Hi+/i],ctx=>{
    ctx.reply("\u{1F44B}")
});


bot.hears(/[A-Z]+/i,ctx=>{
    let message = ctx.message.text;
    fetch("https://russianwarship.rip/api/v1/statistics/latest",{
            method:'get',
            headers: {'Content-Type': 'application/json'},
    })
    .then(response => 
        //response = response.json()
        response.json()
    )
    .then(data => {
        if( data.data.stats[message] != undefined)
        ctx.reply(message + ": " + data.data.stats[message]);
        else 
        ctx.reply("Вибачте такого не знаю)")
    })
    .catch((er)=>{
        console.log(`Some error was ocured: ${er}`);
    });
});

bot.launch();