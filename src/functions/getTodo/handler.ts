import "source-map-support/register";
import { validate } from "uuid";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { document } from "@utils/dynamodbClient";

const hello: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { userId } = event.pathParameters;

  if (!validate(userId)) {
    return formatJSONResponse({
      statusCode: 400,
      error: "Invalid userId parameter",
    });
  }

  console.log(userId);

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "user_id = :id",
      ExpressionAttributeValues: {
        ":id": userId,
      },
    })
    .promise();

  return formatJSONResponse({ ...response });
};

export const main = middyfy(hello);
