# Etapa 1 - Build (compila o projeto)
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /rentalcar
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2 - Runtime (roda o jar)
FROM eclipse-temurin:17-jdk
WORKDIR /rentalcar
COPY --from=build /rentalcar/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
