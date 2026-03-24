FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Must be provided at build time, e.g. https://corp.podiumrentacar.com
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN node ./node_modules/vite/bin/vite.js build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
