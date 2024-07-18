# Multistage build
FROM node:latest As builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli@16
COPY . .
RUN npm run build --prod
RUN ls -a

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/samba-web-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Not required as its alreadypresent in nginx image
# CMD ["nginx", "-g", "daemon off;"]
