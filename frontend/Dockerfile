# Runs the Vite dev server in the container, matching the 5173 port that
# docker-compose.yml maps out. This is a convenience "run everything locally"
# setup, not a production build - deploy the built frontend/dist output to
# Vercel/static hosting for production instead (see README).
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]