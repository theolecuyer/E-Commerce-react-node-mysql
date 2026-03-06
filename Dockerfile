# Stage 1: React static files
FROM node:20 AS client-builder

WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ .

ARG REACT_APP_API_URL=/
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: nginx + Node
FROM node:20

RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/ .

COPY --from=client-builder /client/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

ENV USE_LOCALHOST=false

EXPOSE 80 443

CMD nginx && node /app/app.js
