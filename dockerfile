FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY demo/.mvn/ .mvn/
COPY demo/mvnw demo/pom.xml ./
RUN ./mvnw dependency:resolve
COPY demo/src ./src
RUN ./mvnw package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar"]