ARG VERSION=14
FROM node:${VERSION}
WORKDIR /app/api
COPY ["package.json", "./"]
RUN npm install
RUN chown -R node /app/api/node_modules
RUN npm install -g ts-node
COPY . .
EXPOSE 4000
ENTRYPOINT ["npm", "start"]