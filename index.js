const sheetId = "1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE";
const { Telegraf, Markup} = require('telegraf')
const text = require('./Const')
require('dotenv').config()
const bot = new Telegraf(process.env.TOKEN)



bot.help((ctx) => ctx.reply(text.commands))

bot.command('start', async (ctx) => {
    await ctx.replyWithHTML('<b>Привет ' + ctx.from.first_name +', я СR&BS бот.</b>\n\n<i>Выбери один пункт из меню:</i>', {
      reply_markup: {
        inline_keyboard: [
          [
            {text: 'Поиск  🔍', callback_data: 'search'}
          ],
          [
            {text: 'Статистика  📈', url: 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=1994648634'}
          ],
          [
            {text: 'Таблица Crown Autos', url: 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=811524881'},
            {text: 'Таблица Big Step Autos', url: 'https://docs.google.com/spreadsheets/d/1Dt2OZUrcfErKpIFiRjE2s8_GfMi20LX9CM0-gVjbvgE/edit#gid=382018177'}
          ],
          [
            {text: 'Группа Crown Rent', url: 'https://t.me/+ldnEtjd2_LQyZDJi'},
            {text: 'Группа Big Step', url: 'https://t.me/+ueVWW_JMnqY3ZWYy'}
          ]  
        ]
      }
    })
  })

  
  bot.on('callback_query', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML('<b>Для поиска введи один из следующих параметров:</b>\n\n<i>1. Марка автомобиля\n2. VIN номер (последние 4 цифры)\n3. Продавец/Покупатель\n4. Цена покупки/продажи\n5. Номер счета</i>');
  });

  bot.on("message",(ctx) =>{
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
      const range = 'A1:ZZ'; // Replace with your sheet name and range
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      });
      const res = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      ranges: range,
    });
      const rows = response.data.values;
    
      // console.log((rows));
      const array = rows;
      const firstElement = rows[0];
      const searchTerm = ctx.message.text;
    
      // Find the row that contains the search term
      const result = array.filter(subarray => 
        subarray.some(item => 
          item.toString().toLowerCase().includes(searchTerm.toLowerCase())));
      const secondElement = result;
      console.log(result)
      let arr = [];
      
    for(let j = 0; j < secondElement.length; j++){
      const obj = {};
      for(let i =0; i < firstElement.length; i++){
        obj[firstElement[i]] = secondElement[j][i];
      }
      arr.push(obj);
    }
      for(let k =0; k < arr.length; k++){
        let replyMessage = `<b>Автомобиль</b>:   <i>${arr[k].Fahrzeug}</i>\n  
<b>Документы:</b>   <a href="${res.data.sheets[0].data[0].rowData[arr[k].No].values[1].hyperlink}"><i>Docs</i></a>\n<b>VIN:</b>   <i>${arr[k].VIN}</i>\n<b>Продавец:</b>   <a href="${res.data.sheets[0].data[0].rowData[arr[k].No].values[3].hyperlink}"><i>${arr[k]['Verkäufer']}</i></a>\n<b>Куплено на компанию:</b>   <i>${arr[k].Von}</i>\n<b>Цена покупки(нетто):</b>   <i>${arr[k].Einkaufspreis}</i>\n<b>НДС:</b>   <i>${arr[k].MwSt}</i>\n<b>Дата поставки:</b>   <i>${arr[k].Liefertermin}</i>\n<b>Предоплата:</b>   <i>${arr[k]['Anzahlung ']}</i>\n<b>Цена продажи(нетто):</b>   <a href="${res.data.sheets[0].data[0].rowData[arr[k].No].values[11].hyperlink}"><i>${arr[k].Verkaufspreis}</i></a>\n<b>Дата покупки:</b>   <i>${arr[k].Eikaufsdatum}</i>\n<b>Договор:</b>   <a href="${res.data.sheets[0].data[0].rowData[arr[k].No].values[14].hyperlink}"><i>${arr[k].Vertrag}</i></a>\n<b>Счёт-проформа:</b>   <a href="${res.data.sheets[0].data[0].rowData[arr[k].No].values[15].hyperlink}"><i>${arr[k].Proforma}</i></a>\n<b>Счёт:</b>   <a href="${res.data.sheets[0].data[0].rowData[arr[k].No].values[17].hyperlink}"><i>${arr[k].Rechnung}</i></a>\n<b>Дата:</b>   <i>${arr[k].Datum}</i>\n<b>Продано на:</b>   <i>${arr[k].An}</i>\n<b>Подтверждение о вывозе:</b>   <i>${arr[k].AV}</i>\n<b>Прибыль:</b>   <i>${arr[k].Gewinn}</i>\n<b>Комментарии:</b>   <i>${arr[k]["Kommentare"]}</i>`;
        
        ctx.replyWithHTML(replyMessage);
        console.log(res.data.sheets[0].data[0].rowData[24].values[14])
      }
    }).catch((err) => {
      console.error(err);
    });
    })
    
    bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
