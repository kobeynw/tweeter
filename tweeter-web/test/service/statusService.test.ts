import { AuthToken } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import "isomorphic-fetch";

const statusService = new StatusService();

test("Register", async () => {
  const authToken = new AuthToken("abcdefg", 1234);
  const userAlias = "@allen";
  const pageSize = 3;
  const lastItem = null;

  const [statuses, hasMore] = await statusService.loadMoreStoryItems(
    authToken,
    userAlias,
    pageSize,
    lastItem
  );

  expect(statuses).toHaveLength(3);
  expect(hasMore).toBeTruthy();
});
