#!/bin/bash
# Path to your backup folder
BACKUP_DIR="/home/rajesh/Desktop/MHR/Task-Management-System/mongo_backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M)

# Run the backup inside the Docker container
docker-compose exec -T db mongodump --archive --db=intern_db > "$BACKUP_DIR/backup_$TIMESTAMP.archive"

# Optional: Keep only the last 24 backups (to save disk space)
find "$BACKUP_DIR" -type f -mmin +1440 -delete
