const sheetId = "1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE";
const { Telegraf, Extra, Markup } = require('telegraf')
const text = require('./Const')
require('dotenv').config()
const bot = new Telegraf(process.env.TOKEN)

bot.help((ctx) => ctx.reply(text.commands))

bot.command('start', async (ctx) => {
    await ctx.reply('Hallo, ich bin ein CR&BS-Bot. Wählen Sie ein Element aus dem Menü, was Sie tun möchten.', {
      reply_markup: {
        inline_keyboard: [
          [
            {text: 'Suche', callback_data: 'suche', color: 'red'},
          ],
          [
            {text: 'Dashboard', url: 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=1994648634',},
          ],
          [
            {text: 'Crown Autos', url: 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=811524881'},
            {text: 'Big Step Autos', url: 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=382018177'},
          ],
          [
            {text: 'Gruppe Crown Rent', url: 'https://t.me/+ldnEtjd2_LQyZDJi'},
            {text: 'Gruppe Big Step', url: 'https://t.me/+ueVWW_JMnqY3ZWYy'},
          ],   
        ],
      },
    });
  });
  
  bot.on('callback_query', async (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('Bitte Fahrzeugname oder Fahrgestellnummer eingeben:');
  });

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

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
