FROM node:20

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

ARG NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
