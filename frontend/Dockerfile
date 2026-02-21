# 1. Use an official Node.js image (Alpine is a super small, fast version of Linux)
FROM node:22-alpine

# 2. Create a folder inside the container called /app
WORKDIR /app

# 3. Copy your package.json files first (this helps Docker build faster)
COPY package.json package-lock.json ./

# 4. Install all the React/Vite dependencies
RUN npm install

# 5. Copy the rest of your frontend code into the container
COPY . .

# 6. Open port 5173 so you can view it in your browser
EXPOSE 5173

# 7. Start the Vite development server 
# (We add --host so it is accessible outside the container)
CMD ["npm", "run", "dev", "--", "--host"]