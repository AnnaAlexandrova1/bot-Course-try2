const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '5294314030:AAHHjaTnlPdKtB9vOsKj4RmpYYT8HTF5MkY';

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас  я загадаю цифру от 0 до 9 и ты должен ее угадать')
    const randomNumber  = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = function (){
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Показат информацию'},
        {command: '/game', description: 'Начать игру'},
    ])
    
        bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
    
        if(text === '/start'){
           await bot.sendMessage(chatId, 'Добро пожаловать на канал про бег!')
           return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/897/df3/897df311-e19d-4a7d-8b27-4929abbcf2cc/3.webp')
    
        }
        if(text === '/game'){
           return startGame(chatId)
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        return bot.sendMessage(chatId, 'Попробуй еще раз, я тебя не понимаю!)')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
          return startGame(chatId)
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал цифру, бот загадал ${chats[chatId]}`, againOptions)
        }
      
    })
}

start();
