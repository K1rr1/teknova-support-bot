FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm i --quiet --no-progress || yarn || pnpm i
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc -p .
EXPOSE 5050
CMD [ "node", "dist/index.js" ]
