# 1. Use an official, lightweight Python image
FROM python:3.10-slim

# 2. Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Create a folder inside the container called /app
WORKDIR /app

# 4. Copy the requirements file into the container
COPY requirements.txt /app/

# 5. Tell Docker to install the Python packages
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy all your Django code into the container
COPY . /app/

# 7. Open port 8000
EXPOSE 8000

# 8. Start the Django server when the container runs
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]