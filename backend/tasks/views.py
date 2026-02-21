from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny # 🔹 Added AllowAny
from rest_framework.response import Response
from rest_framework import status # 🔹 Added for HTTP status codes
from pymongo import MongoClient

# 🔹 Import the Serializer we will create in Step 1
from .serializers import UserRegistrationSerializer 

client = MongoClient("mongodb://db:27017/")
db = client["intern_db"]
collection = db["tasks"]

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def get_tasks(request):

    # ==============================
    # 🔹 GET - Fetch All Tasks
    # ==============================
    if request.method == 'GET':
        data = list(collection.find({}, {"_id": 0}))
        return Response(data)

    # ==============================
    # 🔹 POST - Add New Task
    # ==============================
    if request.method == 'POST':
        name = request.data.get("name")
        due_date = request.data.get("due_date")
        description = request.data.get("description", "")

        if not name or not due_date:
            return Response({"error": "Both name and due_date are required"}, status=400)

        collection.insert_one({
            "name": name,
            "due_date": due_date,
            "description": description,
            "completed": False # 👈 NEW TASKS START AS "NOT COMPLETED"
        })

        return Response({"message": "Task added successfully"}, status=201)

    # ==============================
    # 🔹 PUT - Update Task
    # ==============================
    if request.method == 'PUT':
        old_name = request.data.get("old_name")
        new_name = request.data.get("new_name")
        due_date = request.data.get("due_date")
        description = request.data.get("description")
        completed = request.data.get("completed") # 👈 ADDED COMPLETED STATUS

        if not old_name:
            return Response({"error": "old_name is required"}, status=400)

        update_data = {}

        if new_name: update_data["name"] = new_name
        if due_date: update_data["due_date"] = due_date
        if description is not None: update_data["description"] = description
        if completed is not None: update_data["completed"] = completed # 👈 UPDATE STATUS

        if not update_data:
            return Response({"error": "No update data provided"}, status=400)

        result = collection.update_one({"name": old_name}, {"$set": update_data})

        if result.matched_count == 0:
            return Response({"error": "Task not found"}, status=404)

        return Response({"message": "Task updated successfully"}, status=200)

    # ==============================
    # 🔹 DELETE - Delete Task
    # ==============================
    if request.method == 'DELETE':
        name = request.data.get("name")

        if not name:
            return Response({"error": "name is required"}, status=400)

        result = collection.delete_one({"name": name})

        if result.deleted_count == 0:
            return Response({"error": "Task not found"}, status=404)

        return Response({"message": "Task deleted successfully"}, status=200)

# ==============================
# 🔹 POST - Register New User (NEW)
# ==============================
@api_view(['POST'])
@permission_classes([AllowAny]) # 👈 Unauthenticated users must be able to register!
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)