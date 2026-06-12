from pymongo import MongoClient
from dotenv import load_dotenv
import certifi
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGODB_URI"),
    tlsCAFile=certifi.where()
)

db = client[os.getenv("DB_NAME")]

documents = db["documents"]
chats = db["chats"]