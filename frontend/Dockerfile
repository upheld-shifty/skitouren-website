# ── dev stage ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
# npm install instead of npm ci — generates package-lock.json on first build
RUN npm install
COPY . .
EXPOSE 5173

# ── build stage ──────────────────────────────────────────────────────────────
FROM dev AS build
RUN npm run build


# ── prod stage: Nginx SPA + API proxy ────────────────────────────────────────
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
