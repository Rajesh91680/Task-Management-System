from pymongo import MongoClient
from datetime import datetime, timedelta

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["intern_db"]
collection = db["tasks"]

# Get tomorrow date
tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

print("Checking tasks for tomorrow:", tomorrow)

tasks = collection.find({"due_date": tomorrow})

found = False

for task in tasks:
    print(f"Reminder: Task '{task['name']}' is due tomorrow!")
    found = True

if not found:
    print("No tasks due tomorrow.")
