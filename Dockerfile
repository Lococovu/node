FROM ubuntu
WORKDIR /home
COPY . .

ENV GAME_TEMPLATE=https://github.com/Lococovu/template.knockback

RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install git -y
RUN apt-get install default-jre -y
RUN apt-get install npm -y

RUN npm install --no-audit --unsafe-perm
RUN chmod 755 ./pgrok

RUN git clone https://github.com/Lococovu/template.knockback
RUN mv template.knockback/* .

CMD ["node", "index.js"]