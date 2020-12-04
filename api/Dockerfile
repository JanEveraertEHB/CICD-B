
FROM node:15.3.0-alpine3.10


# COPY [local] [VM]
COPY src /workdir/src

COPY package*.json /workdir/

WORKDIR /workdir

RUN npm install --quiet || cat npm-debug.log


ENV PORT=3000
ENV PG_CONNECTION_STRING=postgresql://doadmin:f2m2wic88ktjntqd@conversationdb-do-user-2476832-0.b.db.ondigitalocean.com:25060/defaultdb?ssl=true

CMD ["npm", "start"]