FROM node:20-alpine
WORKDIR /tsj_app
COPY . /tsj_app
RUN npm ci
COPY . .
EXPOSE 19006
CMD ["npm", "run", "web"]
#http://0.0.0.0:19006/