# Use Maven image for building
FROM maven:3.9-openjdk-17 AS build

WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime image
FROM openjdk:17-jre-slim

WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Create non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
