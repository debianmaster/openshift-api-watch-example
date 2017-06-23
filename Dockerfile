FROM node:8
ADD package.json .
RUN npm install 
ADD . /
EXPOSE 8081 8080
CMD ["npm","start"] 
