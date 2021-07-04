// import schema from "./schema";
import { handlerPath } from "@libs/handlerResolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "todo/{userId}",
        request: {
          schema: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
