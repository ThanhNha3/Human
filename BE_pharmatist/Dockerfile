# Sử dụng image Node.js dựa trên Alpine Linux
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Mở cổng 8080 cho ứng dụng
EXPOSE 8080

# Chạy ứng dụng khi container được khởi động
CMD [ "npm", "start" ]