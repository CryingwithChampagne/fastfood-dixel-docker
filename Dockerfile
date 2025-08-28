# ตัวอย่าง Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --omit=dev

# Copy source code
COPY src ./src

EXPOSE 5000
CMD ["npm", "start"]
