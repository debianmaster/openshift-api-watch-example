FROM node:8
ADD package.json .
RUN npm install 
ADD . /
EXPOSE 8080 8081
CMD ["npm","start"] 
