import "source-map-support/register";
import { validate, v4 } from "uuid";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { document } from "@utils/dynamodbClient";

import schema from "./schema";

const createTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { userId } = event.pathParameters;

  if (!validate(userId)) {
    return formatJSONResponse({
      statusCode: 400,
      error: "Invalid userId parameter",
    });
  }

  const { title, deadline } = event.body;

  try {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      throw Error("invalid date");
    }
  } catch (error) {
    return formatJSONResponse({
      statusCode: 400,
      error: "Invalid date",
    });
  }

  await document
    .put({
      TableName: "todos",
      Item: {
        id: v4(),
        user_id: userId,
        title,
        deadline,
        done: false,
      },
    })
    .promise();

  return formatJSONResponse({
    statusCode: 201,
    message: "Created Todo Item successfully",
  });
};

export const main = middyfy(createTodo);
