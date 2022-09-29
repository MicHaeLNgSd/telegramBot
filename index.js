const Telegraf = require("telegraf").Telegraf,
        os = require('node:os'),
        BOT_TOKEN = "5642426512:AAFd_5-C0yMO-RoN9s3fTYfBFXUObBcDXac";
const bot = new Telegraf(BOT_TOKEN);

let data_from_server = {};
let date_of_data_from_server = "";
let kingOfStatistic = "stats";

function getCurrentDate()
{
    var today=new Date();
    var today_day = String(today.getDate()).padStart(2,'0');
    var today_month = String(today.getMonth()+1).padStart(2,'0');
    var today_year = today.getFullYear();
    today = today_year + "-" + today_month + "-" + today_day;
    console.log(today);
    console.log(date_of_data_from_server);
    return today;
}

function getDataFromServer(forceFetch = false){
    if (!forceFetch){
        return;
    }
    return fetch("https://russianwarship.rip/api/v1/statistics/latest",{
            method:'get',
            headers: {'Content-Type': 'application/json'},
        })

        .then((res) => res.json())

        // .then(response => 
        //     //response = response.json()
        //     response.json()
        // )

        .then(data => {
            data_from_server = data;
            // if( data.data.stats[message] != undefined)
            // else 
            //ctx.reply("Вибачте такого не знаю)")
            console.log("Go to server");
            date_of_data_from_server=data_from_server.data.date;
        })

        .catch((er)=>{
            console.log(`Some error was ocured: ${er}`);
        });

    // let response = await fetch("https://russianwarship.rip/api/v1/statistics/latest",{
    //         method:'GET',
    //         headers: {'Content-Type': 'application/json'},
    //     });

    //     const data = await res.json();
    //     data.then(data => {
    //         data_from_server = data;
    //         date_of_data_from_server=data_from_server.data.date;
    //         console.log("Go to server");
    //     })

    //     .catch((er)=>{
    //         console.log(`Some error was ocured: ${er}`);
    //     });
}

bot.start(ctx=>{
    ctx.replyWithHTML( "Wellcome" , {
        reply_markup : {
            inline_keyboard: [
                [{text : "Resource", url: "https://russianwarship.rip/"}],
                [{text : "Get latest statistic", callback_data: "getAll"},{text : "Get latest statistic by day", callback_data: "getAllByDay"}],
            ]
        }
    });

})

bot.action("getAll",ctx=>{
    ctx.reply("Get all")
    kingOfStatistic = "stats";
});

bot.action("getAllByDay",ctx=>{
    ctx.reply("Get all by day")
    kingOfStatistic = "increase";
});




bot.hears([/Привіт+/i, /Hello+/i, /Hi+/i],ctx=>{
    ctx.reply("\u{1F44B}");
});

bot.command("tanks", async ctx=>{
    await getDataFromServer( date_of_data_from_server != getCurrentDate());
    ctx.reply("tanks: " + data_from_server.data[kingOfStatistic].tanks);
});

bot.hears(/[A-Z]+/i, async ctx=>{
    let message = ctx.message.text;
    console.log(message);
    await getDataFromServer( date_of_data_from_server != getCurrentDate());
    ctx.reply(message + ": " + data_from_server.data[kingOfStatistic][message]);
});

bot.launch();