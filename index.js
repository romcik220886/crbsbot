const sheetId = "1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE";
const { Telegraf } = require('telegraf')
const text = require('./Const')
require('dotenv').config()
const bot = new Telegraf(process.env.TOKEN)

bot.help((ctx) => ctx.reply(text.commands))

bot.command('start', async (ctx) => {
    await ctx.reply('Hallo, ich bin ein CR&BS-Bot. Wählen Sie ein Element aus dem Menü, was Sie tun möchten.', {
      reply_markup: {
        inline_keyboard: [
          [
            {text: 'Suche', callback_data: 'suche',},
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
        const range = 'A:ZZ'; // Replace with your sheet name and range
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
            
        });
        const rows = response.data.values;
        const array = rows;
        const firstElement = rows[0];
        const searchTerm = ctx.message.text;

        // Find the row that contains the search term
        const result = array.filter(subarray => 
          subarray.some((item) => 
            item.toString().toLowerCase().includes(searchTerm.toLowerCase())));

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
          let replyMessage = `Fahrzeug: ${arr[k].Fahrzeug}\n  
Dokumente: ${arr[k]['Docs']}\nVIN: ${arr[k].VIN}\nVerkäufer: ${arr[k]['Verkäufer']}\nVon: ${arr[k].Von}\nEinkaufspreis: ${arr[k].Einkaufspreis}\nMwSt: ${arr[k].MwSt}\nLiefertermin: ${arr[k].Liefertermin}\nAnzahlung: ${arr[k]['Anzahlung ']}\nVerkaufspreis: ${arr[k].Verkaufspreis}\nEikaufsdatum: ${arr[k].Eikaufsdatum}\nVertrag: ${arr[k].Vertrag}\nProforma: ${arr[k].Proforma}\nRechnung: ${arr[k].Rechnung}\nDatum: ${arr[k].Datum}\nAn: ${arr[k].An}\nAv: ${arr[k].AV}\nGewinn: ${arr[k].Gewinn}\nKommentare: ${arr[k]["Kommentare"]}\n`;

          // Check each cell of the row for a hyperlink and include it in the reply message if found
         for (const [key, value] of Object.entries(arr[k])) {
              if (typeof value === 'string' && value.includes('http')) {
                  replyMessage += `${key}: <a href="${value}">${value}</a>\n`;
              }
          }
          ctx.replyWithHTML(replyMessage);
      }

        /*for (let k = 0; k < arr.length; k++) {

            ctx.reply(`Fahrzeug: ${arr[k].Fahrzeug}\n 
Dokumente: ${arr[k]['Docs']}\nVIN: ${arr[k].VIN}\nVerkäufer: ${arr[k]['Verkäufer']}\nVon: ${arr[k].Von}\nEinkaufspreis: ${arr[k].Einkaufspreis}\nMwSt: ${arr[k].MwSt}\nLiefertermin: ${arr[k].Liefertermin}\nAnzahlung: ${arr[k]['Anzahlung ']}\nVerkaufspreis: ${arr[k].Verkaufspreis}\nEikaufsdatum: ${arr[k].Eikaufsdatum}\nVertrag: ${arr[k].Vertrag}\nProforma: ${arr[k].Proforma}\nRechnung: ${arr[k].Rechnung}\nDatum: ${arr[k].Datum}\nAn: ${arr[k].An}\nAv: ${arr[k].AV}\nGewinn: ${arr[k].Gewinn}\nKommentare: ${arr[k]["Kommentare"]}`);
        }*/


    }).catch((err) => {
        console.error(err);
    });
})


bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
