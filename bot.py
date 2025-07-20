import os
import logging
from aiogram import Bot, Dispatcher, types, executor

BOT_TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)
logging.basicConfig(level=logging.INFO)

users = {}

@dp.message_handler(commands=['start'])
async def start_handler(message: types.Message):
    uid = message.from_user.id
    if uid not in users:
        users[uid] = {'gold': 0, 'clicks': 0}
    await message.answer("🤑 Welcome to ZARDO!\nUse /click to earn Gold\nUse /profile to view your stats.")

@dp.message_handler(commands=['click'])
async def click_handler(message: types.Message):
    uid = message.from_user.id
    users[uid]['gold'] += 3
    users[uid]['clicks'] += 1
    await message.answer(f"💰 You earned 3 Gold!\nTotal Gold: {users[uid]['gold']}")

@dp.message_handler(commands=['profile'])
async def profile_handler(message: types.Message):
    uid = message.from_user.id
    user = users.get(uid, {'gold': 0, 'clicks': 0})
    await message.answer(f"👤 Your Stats:\nGold: {user['gold']}\nClicks: {user['clicks']}")

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
add main bot file
