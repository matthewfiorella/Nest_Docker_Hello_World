FROM amazon/dynamodb-local:latest
COPY ./dynamodb /home/dynamodblocal/data
WORKDIR /home/dynamodblocal
USER root
CMD ["-jar", "DynamoDBLocal.jar", "-sharedDb", "-dbPath", "./data", "-port", "8080"]