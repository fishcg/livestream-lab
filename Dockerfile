FROM 172.24.173.77:30500/node:24.13.0-alpine

WORKDIR /home/www/livestream-lab

COPY index.html ./
COPY src ./src
COPY server.mjs ./

EXPOSE 4173

ENV TZ=Asia/Shanghai

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4173/').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
