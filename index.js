const sheetId = "1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE";
const { Telegraf, Extra } = require('telegraf')

require('dotenv').config()
const bot = new Telegraf(process.env.TOKEN)

bot.help((ctx) => {
    ctx.reply('I can do many things! Try sending me a message.Type /start to start');
})

bot.command('start', (ctx) => {
    const keyboard = Telegraf.Markup.keyboard([
        ['Suche'],
        ['Dashboard'],
        ['Crown Autos', 'Big Step Autos'],
        ["Gruppe Crown Rent", "Gruppe Big Step"]
    ]).resize().oneTime().extra();
    ctx.reply('Hallo, ich bin ein CR&BS-Bot. Wählen Sie ein Element aus dem Menü, was Sie tun möchten.', keyboard);
});
bot.hears('Suche', (ctx) => {
    const keyboard3 = Telegraf.Markup.keyboard([
        ['Suche'],
    ]).resize().extra();
    ctx.reply('Bitte Fahrzeug Name oder Fahrgestellnummer eingeben', keyboard3);
});


bot.hears('Crown Autos', (ctx) => {
    ctx.reply('Klicken Sie auf die Schaltfläche, um zum Crown Autos-Tab zu gelangen', Extra.markup((markup) => {
        return markup.inlineKeyboard([
            markup.urlButton('Gehen Sie zu Crown Autos', 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=811524881')
        ]);
    }));
});
bot.hears('Big Step Autos', (ctx) => {
    ctx.reply('Klicken Sie auf die Schaltfläche, um zur Registerkarte Big Step Autos zu gelangen', Extra.markup((markup) => {
        return markup.inlineKeyboard([
            markup.urlButton('Gehen Sie zu Big Step Autos', 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=382018177')
        ]);
    }));
});
bot.hears('Dashboard', (ctx) => {
    ctx.reply('Klicken Sie auf die Schaltfläche, um zur Registerkarte Dashboard zu wechseln', Extra.markup((markup) => {
        return markup.inlineKeyboard([
            markup.urlButton('Gehen Sie zum Dashboard', 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=1994648634')
        ]);
    }));
});
bot.hears("Gruppe Crown Rent", (ctx) => {
    ctx.reply('der Gruppe Crown Rent beitreten', Extra.markup((markup) => {
        return markup.inlineKeyboard([
            markup.urlButton('Crown Rent', 'https://t.me/+ldnEtjd2_LQyZDJi')
        ]);
    }));
})
bot.hears("Gruppe Big Step", (ctx) => {
    ctx.reply('der Gruppe Big Step beitreten', Extra.markup((markup) => {
        return markup.inlineKeyboard([
            markup.urlButton('Big Step', 'https://t.me/+ueVWW_JMnqY3ZWYy')
        ]);
    }));
})


bot.on("message", (ctx) => {


    const { google } = require('googleapis');
    const keys = require('./credentials.json');

    // Authenticate with the Google Sheets API using your service credentials
    google.auth.getClient({
        credentials: keys,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    }).then(async (client) => {

        // Create an instance of the Google Sheets API
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Get the data from your Google Sheet
        const spreadsheetId = '1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE';
        const range = 'A:AC'; // Replace with your sheet name and range
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
            valueRenderOptions: 'formatted_value',
        });
        const rows = response.data.values;
        const link = "";


        // console.log((rows));
        const array = rows;
        const firstElement = rows[0];

        const searchTerm = ctx.message.text;



        // Find the row that contains the search term
        const result = array.filter(subarray => subarray.some(item => item.toString().includes(searchTerm)));
        const secondElement = result;
        let arr = [];

        for (let j = 0; j < secondElement.length; j++) {
            const obj = {};
            for (let i = 0; i < firstElement.length; i++) {
                obj[firstElement[i]] = secondElement[j][i];
            }
            arr.push(obj);
        }
        for (let k = 0; k < arr.length; k++) {

            ctx.reply(`Fahrzeug: ${arr[k].Fahrzeug}\n VIN: ${arr[k].VIN}\n Verkäufer: ${arr[k]['Verkäufer']}\n Von: ${arr[k].Von}\n Einkaufspreis: ${arr[k].Einkaufspreis}\n Liefertermin: ${arr[k].Liefertermin}\n Anzahlung: ${arr[k]['Anzahlung ']}\n Verkaufspreis: ${arr[k].Verkaufspreis}\n Eikaufsdatum: ${arr[k].Eikaufsdatum}\n Vertrag: ${arr[k].Vertrag}\n Proforma: ${arr[k].Proforma}\n Rechnung:${arr[k].Rechnung}\n Datum: ${arr[k].Datum}\n AN: ${arr[k].An}\n AV: ${arr[k].AV}\n Transport:${arr[k].Transport}\n Gewinn:${arr[k].Gewinn}\n Kommentare: ${arr[k]["Kommentare"]}\n`);
        }
    }).catch((err) => {
        console.error(err);
    });
})


bot.launch();



