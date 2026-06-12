from pymongo import MongoClient
from dotenv import load_dotenv
import certifi
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGODB_URI"),
    tlsCAFile=certifi.where()
)

print(client.list_database_names())