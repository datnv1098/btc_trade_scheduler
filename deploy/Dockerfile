FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

FROM node:20-alpine

WORKDIR /app
ARG API_KEY=Kyk2cc8aGHg9HolCfaU9Xg4GqdMur7SCqtFG3myMr4Hiqwfgt6ZLT10xr5acZFhl
ARG API_SECRET=q2Kr4vgsCRKK3h7AnZesQm0Ou0LlllzFunhtUIaXGCB4P09awyFVTPwnAWf1nY1c
ARG AMOUNT_USDT=10
ARG TELEGRAM_CHAT_ID=-3984416204372
ARG TELEGRAM_TOKEN=0687687777:nAJQUJLGBoUO4PI49JLzDZzNQeyDEnFT6jJ

ENV API_KEY=$API_KEY
ENV API_SECRET=$API_SECRET
ENV AMOUNT_USDT=$AMOUNT_USDT
ENV TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID
ENV TELEGRAM_TOKEN=$TELEGRAM_TOKEN

RUN cat <<EOF >> /usr/local/bin/sh
#!/bin/sh
set -e

export PATH=/usr/local/bin
/bin/sh
EOF

RUN chmod +x /usr/local/bin/sh
RUN apk update && apk add shadow && useradd -M -d /app -s /usr/local/bin/sh service

COPY --from=build /app/node_modules ./node_modules
COPY . .

RUN chown -R service. /app

USER service
# ENTRYPOINT [ "/usr/local/bin/sh" ]
CMD [ "node", "index.js" ]