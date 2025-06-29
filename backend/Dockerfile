FROM openjdk:21-jdk-slim
ARG JAR_FILE=target/backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app_backend.jar

EXPOSE 9090
ENTRYPOINT ["java","-jar","app_backend.jar"]