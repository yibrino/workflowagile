FROM node:18-slim

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install -g @angular/cli@16

COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0"]
