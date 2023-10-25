
import * as dotenv from 'dotenv';
dotenv.config();

import { Bot, Context,BotConfig, InlineKeyboard} from 'grammy';

import { env } from './config/env-config';

// const { Telegraf, Markup ,ContextMessageUpdate} = require('telegraf');
import { Telegraf, Markup } from 'telegraf';
//const translate = require('translate-api');

// import translate from 'google-translate-api';



const fetch = require('node-fetch');


const bot = new Bot(env.TOKEN);

bot.command('start', async (ctx: Context) => {
  const firstName = ctx.from && ctx.from.first_name ? `<i>${ctx.from.first_name}</i>` : "<i>Noma'lum</i>";

  const keyboard = new InlineKeyboard();

    const rowSize = 2; 

    for (let i = 0; i < viloyatlar.length; i += rowSize) {
        const row = viloyatlar.slice(i, i + rowSize);
        keyboard.row(...row.map((viloyat) => InlineKeyboard.text(viloyat, `select_${viloyat}`)));
    }

  ctx.reply(`Salom, <i>${firstName}</i>. Xush kelibsiz !\nViloyatlardan birini tanlang !`, { parse_mode: 'HTML',reply_markup:keyboard });
});


bot.command('info', async (ctx: Context) => {
  await ctx.reply('Bot @Tolibjon_Qurbonboyev tomonidan ishlab chiqilgan.\nBu bot ob-havo haqida ma\'lumot beradi.\nMa\'lumot olish uchun /start buyrug\'ini bosing');
});

const map = new Map()
map.set("Clear","osmon musaffo")
map.set("Clouds","bulutli havo")
map.set("Smoke","tumanli havo")
map.set("Rain","yomg'irli")
map.set("Snow","qorli")
map.set("Mist","tuman")

const viloyatlar = [
  'Andijon',
  'Buxoro',
  'Farg\'ona',
  'Jizzax',
  'Namangan',
  'Navoiy',
  'Qashqadaryo',
  'Samarqand',
  'Sirdaryo',
  'Surxondaryo',
  'Toshkent',
  'Xorazm',
  'Qoraqalpog\'iston Respublikasi'
];

const tumanlar = [
  'Andijon',
  'Buxoro',
  'Farg\'ona',
  'Jizzax',
  'Namangan',
  'Navoiy',
  'Qashqadaryo',
  'Samarqand',
  'Sirdaryo',
  'Termiz',
  'Toshkent',
  'Urgench',
  'Nukus'
];

let index=0;


bot.on('callback_query:data', async (ctx) => {
  const command = ctx.callbackQuery.data;
  const viloyat = command.replace('select_', '');
  index=viloyatlar.indexOf(viloyat)
  
  try {
    if (viloyat) {
      const weatherData = await getWeather(tumanlar[index]);
      if (weatherData) {
        const message = createWeatherMessage(viloyat, weatherData);
        await ctx.reply(message);
      } else {
        await ctx.reply("Ob-havo ma'lumotlarini olishda xatolik yuz berdi.");
      }
    } else {
      await ctx.reply("Viloyat nomini kiritishingiz kerak.");
    }
  } catch (error) {
    console.error(`Ob-havo ma'lumotlarini olishda xatolik yuz berdi (${viloyat}):`, error);
    await ctx.reply("Ob-havo ma'lumotlarini olishda xatolik yuz berdi.");
  }
});


async function getWeather(city: string) {
  const apiKey = process.env.MY_WEATHER 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Ob-havo ma\'lumotlarini olishda xatolik yuz berdi:', error);
    return null;
  }
}

function createWeatherMessage(viloyat: string, weatherData: any) {
  const harorat = weatherData.main.temp;
  const main: string = weatherData.weather[0].main;
  return `Shahar: ${viloyatlar[index]}\nHarorat: ${Math.round(harorat-273.15)} °C\nTasvir: ${map.get(main)}`;
}

async function testWeather(){
  const viloyatlar = [
    "Andijon",
    "Buxoro",
    "Farg'ona",
    "Jizzax",
    "Namangan",
    "Navoiy",
    "Qashqadaryo",
    "Nukus",
    "Samarqand",
    "Sirdaryo",
    "Termiz",
    "Tashkent",
    "Urgench",
  ]
  for (const viloyat of viloyatlar) {
    const weatherData = await getWeather(viloyat)
    console.log(`ob-havo ma'lumotlari - ${viloyat}:`, weatherData);
    
  }
}


bot.on('message', async (ctx: Context) => {
  await ctx.reply('Men faqat /start yoki /info buyruqlarini tushunaman.');
});

testWeather().catch(console.error)


bot.start();


// async function eng_uzb(matn: string): Promise<string> {
//   try {
//     const natija = await translate(matn, { from: 'en', to: 'uz' });
//     return natija.text;
//   } catch (xato) {
//     return `Tarjima xato yuz berdi: ${xato}`;
//   }
// }

// eng_uzb('Hello').then((natija) => {
//   console.log(natija);
// }).catch((xato) => {
//   console.error(xato);
// });
// async function eng_uzb(matn:string){
//   try {
//     const natija = await translate(matn, { from: 'en', to: 'uz' });
//     return natija
//   } catch (xato) {
//     return `Tarjima xato yuz berdi: ${xato}`;
//   }
// }

// const inglizdanOzbekchagaTarjima = (matn:string) => {
//   translate.getText(matn, {form:'en', to: 'uz' })
//     .then((natija: any) => {
//       return natija;
//     })
//     .catch((xato: any) => {
//       console.error('Tarjima xato yuz berdi:', xato);
//     });
// };
