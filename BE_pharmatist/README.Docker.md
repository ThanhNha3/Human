# Dockerfile và Docker Compose Hướng dẫn

## Dockerfile

- `FROM node:14-alpine`: Sử dụng image Node.js phiên bản 14 dựa trên Alpine Linux, một phiên bản Linux nhẹ nhàng và an toàn.
- `WORKDIR /app`: Tạo thư mục làm việc `/app` trong container.
- `COPY package*.json ./`: Sao chép file `package.json` và `package-lock.json` vào thư mục làm việc.
- `RUN npm install`: Cài đặt các dependencies thông qua npm.
- `COPY . .`: Sao chép toàn bộ mã nguồn vào thư mục làm việc.
- `EXPOSE 8080`: Mở cổng 8080 cho ứng dụng.
- `CMD [ "npm", "start" ]`: Chạy ứng dụng khi container được khởi động.

## Docker Compose (compose.yaml)

- `version: '3'`: Định nghĩa phiên bản của Docker Compose.
- `services:`: Định nghĩa các dịch vụ (containers) của ứng dụng.
    - `app:`: Định nghĩa dịch vụ `app`.
        - `build: .`: Xây dựng image cho dịch vụ `app` từ `Dockerfile` trong thư mục hiện tại.
        - `ports:`: Định nghĩa cổng mà dịch vụ `app` sẽ sử dụng.
        - `environment:`: Định nghĩa các biến môi trường cho dịch vụ `app`.
        - `depends_on:`: Định nghĩa các dịch vụ mà `app` phụ thuộc vào.
    - `db:`: Định nghĩa dịch vụ `db`.
        - `image: mysql:5.7`: Sử dụng image MySQL phiên bản 5.7 cho dịch vụ `db`.
        - `volumes:`: Định nghĩa volume cho dữ liệu của MySQL.
        - `healthcheck:`: Định nghĩa kiểm tra sức khỏe cho dịch vụ `db`.

## Hướng dẫn sử dụng Docker Compose

- `docker-compose build`: Xây dựng các dịch vụ được định nghĩa trong `compose.yaml`.
- `docker-compose up -d`: Khởi chạy các dịch vụ trong chế độ detached (nền).
- `docker-compose stop`: Dừng tất cả các dịch vụ.
- `docker-compose down`: Dừng và xóa tất cả các dịch vụ và mạng.