# ใช้ base image ของ Node.js
FROM node:18-alpine

# ตั้ง working directory ใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json (ถ้ามี)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์โปรเจกต์ทั้งหมด
COPY . .

# เปิดพอร์ต 5000 (ให้ตรงกับใน server.js)
EXPOSE 5000

# สั่งรันแอป
CMD ["npm", "start"]
