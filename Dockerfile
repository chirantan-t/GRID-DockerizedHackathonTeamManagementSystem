# ===================================================================
# Dockerfile - Spring Boot 3.x Backend (Multi-Stage Build)
# Target Architecture: Java 21 LTS with non-root security & Health Check
# ===================================================================

# Stage 1: Maven Build Container
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /build

# Copy Maven POM and project sources
COPY backend/pom.xml .
COPY backend/src ./src

# Compile and package production application jar
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production Runtime
FROM eclipse-temurin:21-jre-alpine AS backend-runtime
WORKDIR /app

# Install curl for Actuator health checks
RUN apk add --no-cache curl tzdata

# Security: Create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled jar from builder stage
COPY --from=backend-builder /build/target/*.jar /app/app.jar

# Set proper ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose internal application port
EXPOSE 8080

# Environment Defaults
ENV SERVER_PORT=8080 \
    SPRING_PROFILES_ACTIVE=mysql \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Health Check Probe
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Start Application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
