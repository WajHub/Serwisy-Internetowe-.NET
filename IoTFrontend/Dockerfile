FROM node:18-alpine AS build
WORKDIR /app

# copy package files first for better cache
COPY package.json package-lock.json* ./
RUN npm ci --silent

# copy rest
COPY . .

# allow passing the API base at build time
ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE}

# build
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
