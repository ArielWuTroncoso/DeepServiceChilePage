# Multi-stage: React SPA (Vite) + Spring Boot en un solo contenedor.
# Se usa cuando el sitio se despliega como UN servicio en Render.

# --- Etapa 1: build del frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

# --- Etapa 2: build del backend ---
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
COPY --from=frontend-builder /app/src/main/resources/static ./src/main/resources/static
RUN mvn -B clean package -DskipTests

# --- Etapa 3: runtime ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=backend-builder /app/target/deepservice-1.0.0.jar app.jar
USER spring
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]
