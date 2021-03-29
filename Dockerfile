ARG template

FROM ubuntu
WORKDIR /home
COPY . .

RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install git -y
RUN apt-get install default-jre -y
RUN chmod 755 ./pgrok

RUN "git clone ${template}"
RUN mv template.knockback/* .

CMD ["node", "index.js"]