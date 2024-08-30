FROM node:alpine

# Installiere die notwendigen Pakete
RUN apk add --no-cache \
    libc6-compat \
    tzdata \
    && apk add --no-cache --virtual .build-deps \
    musl-locales musl-locales-lang

# Setze die Umgebungsvariablen für UTF-8
ENV LANG=de_DE.UTF-8
ENV LANGUAGE=de_DE.UTF-8
ENV LC_ALL=de_DE.UTF-8

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json package-lock.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "server.js" ]