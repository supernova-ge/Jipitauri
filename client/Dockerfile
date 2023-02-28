FROM node:14
WORKDIR /app/client
COPY ["package.json", "./"]
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm", "start"]