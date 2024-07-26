FROM node:16-alpine AS build

WORKDIR /usr/src/app
COPY . /usr/src/app

ARG API_URL

RUN npm install --loglevel verbose
RUN npm run replace-vars
RUN npm run build

FROM nginx
COPY --from=build /usr/src/app/dist/AI-HACKATHON /usr/share/nginx/html
