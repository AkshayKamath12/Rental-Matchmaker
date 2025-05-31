FROM openjdk:21

# Set the working directory
WORKDIR /app

# Copy the JAR file into the container
COPY target/app-0.0.1-SNAPSHOT.jar /app/app-0.0.1-SNAPSHOT.jar

# Expose the port the application runs on
EXPOSE 8080

# Set the entry point for the container
ENTRYPOINT ["java", "-jar", "app-0.0.1-SNAPSHOT.jar"]
