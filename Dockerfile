FROM node:26-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG DATABASE_DIR=/data

RUN mkdir -p "${DATABASE_DIR}" && chown -R node:node "${DATABASE_DIR}" /app

USER node

EXPOSE ${PORT}

ENV DATABASE_DIR=${DATABASE_DIR}
ENV NODE_ENV=production
ENV ADDRESS_HEADER="X-Forwarded-For"
ENV XFF_DEPTH=1

CMD ["node", "index.js"]
