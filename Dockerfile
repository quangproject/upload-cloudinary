# ============================
# 1️⃣ BUILD STAGE
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Chỉ copy file lock + package để tối ưu cache
COPY package.json yarn.lock ./

# Cài deps (có thể bỏ devDeps bằng --production=false)
RUN yarn install --frozen-lockfile

# Copy toàn bộ source vào sau
COPY . .

# Build project
RUN yarn build


# ============================
# 2️⃣ RUNTIME STAGE
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

# Chỉ copy package file để install production deps
COPY package.json yarn.lock ./

# Cài đặt production deps (giảm size đáng kể)
RUN yarn install --frozen-lockfile --production=true

# Copy build output từ stage build
COPY --from=builder /app/dist ./dist

# Nếu cần file khác (config.json, assets...) thì COPY thêm
# COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

CMD ["yarn", "start"]
