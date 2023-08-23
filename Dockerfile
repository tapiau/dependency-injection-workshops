FROM node:18-alpine AS builder
WORKDIR /app
COPY *.json ./
RUN chown -R node /app
USER node
RUN mkdir /home/node/.npm
RUN npm i npm@9.8.1
RUN npm install
COPY src src
RUN npm run build


FROM node:18-alpine
RUN apk add --no-cache tzdata
ENV TZ="Europe/Warsaw"
WORKDIR /app
COPY *.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist/ /app/dist/
EXPOSE 80 3256
CMD ["npm", "start"]
