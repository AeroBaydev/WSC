# =============================================================
#  World Skill Challenge - Next.js 14 Dockerfile
#  Multi-stage build: chhoti, secure, fast image banane ke liye
# =============================================================

# ---- Stage 1: deps ----
# Sirf dependencies install karte hain. Alag stage isliye taaki
# code change pe baar-baar npm install na chale (Docker cache use hota hai).
FROM node:20-alpine AS deps
WORKDIR /app
# package files pehle copy karte hain — agar ye nahi badle to Docker
# purani cached install reuse kar lega (build fast hoti hai)
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: builder ----
# Yahan asli `next build` chalta hai.
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ZAROORI: Clerk ka NEXT_PUBLIC key BUILD time pe chahiye, kyunki ye
# client-side bundle me bake ho jaata hai. Isliye build arg se pass karte hain.
# (Baaki secrets - DB, Razorpay - RUNTIME pe aate hain, yahan nahi.)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Stage 3: runner ----
# Final image - sirf chalane layak files. Source code yahan nahi aata.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Security: root user se app mat chalao. Ek normal user banate hain.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# standalone build ki output copy karte hain (server.js + zaroori node_modules)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
# App is port pe sunega; nginx isi port se baat karega
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
