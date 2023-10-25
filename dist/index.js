"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const grammy_1 = require("grammy");
const env_config_1 = require("./config/env-config");
//const translate = require('translate-api');
// import translate from 'google-translate-api';
const fetch = require('node-fetch');
const bot = new grammy_1.Bot(env_config_1.env.TOKEN);
bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = ctx.from && ctx.from.first_name ? `<i>${ctx.from.first_name}</i>` : "<i>Noma'lum</i>";
    const keyboard = new grammy_1.InlineKeyboard();
    const rowSize = 2;
    for (let i = 0; i < viloyatlar.length; i += rowSize) {
        const row = viloyatlar.slice(i, i + rowSize);
        keyboard.row(...row.map((viloyat) => grammy_1.InlineKeyboard.text(viloyat, `select_${viloyat}`)));
    }
    ctx.reply(`Salom, <i>${firstName}</i>. Xush kelibsiz !\nViloyatlardan birini tanlang !`, { parse_mode: 'HTML', reply_markup: keyboard });
}));
bot.command('info', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Bot @Tolibjon_Qurbonboyev tomonidan ishlab chiqilgan.\nBu bot ob-havo haqida ma\'lumot beradi.\nMa\'lumot olish uchun /start buyrug\'ini bosing');
}));
const map = new Map();
map.set("Clear", "osmon musaffo");
map.set("Clouds", "bulutli havo");
map.set("Smoke", "tumanli havo");
map.set("Rain", "yomg'irli");
map.set("Snow", "qorli");
map.set("Mist", "tuman");
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
let index = 0;
bot.on('callback_query:data', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const command = ctx.callbackQuery.data;
    const viloyat = command.replace('select_', '');
    index = viloyatlar.indexOf(viloyat);
    try {
        if (viloyat) {
            const weatherData = yield getWeather(tumanlar[index]);
            if (weatherData) {
                const message = createWeatherMessage(viloyat, weatherData);
                yield ctx.reply(message);
            }
            else {
                yield ctx.reply("Ob-havo ma'lumotlarini olishda xatolik yuz berdi.");
            }
        }
        else {
            yield ctx.reply("Viloyat nomini kiritishingiz kerak.");
        }
    }
    catch (error) {
        console.error(`Ob-havo ma'lumotlarini olishda xatolik yuz berdi (${viloyat}):`, error);
        yield ctx.reply("Ob-havo ma'lumotlarini olishda xatolik yuz berdi.");
    }
}));
function getWeather(city) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env.MY_WEATHER;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.log('Ob-havo ma\'lumotlarini olishda xatolik yuz berdi:', error);
            return null;
        }
    });
}
function createWeatherMessage(viloyat, weatherData) {
    const harorat = weatherData.main.temp;
    const main = weatherData.weather[0].main;
    return `Shahar: ${viloyatlar[index]}\nHarorat: ${Math.round(harorat - 273.15)} °C\nTasvir: ${map.get(main)}`;
}
function testWeather() {
    return __awaiter(this, void 0, void 0, function* () {
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
        ];
        for (const viloyat of viloyatlar) {
            const weatherData = yield getWeather(viloyat);
            console.log(`ob-havo ma'lumotlari - ${viloyat}:`, weatherData);
        }
    });
}
bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Men faqat /start yoki /info buyruqlarini tushunaman.');
}));
testWeather().catch(console.error);
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
