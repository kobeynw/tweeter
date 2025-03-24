import {
  AuthToken,
  FollowCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import "isomorphic-fetch";

describe("Server Facade", () => {
  const serverFacade = new ServerFacade();

  test("Register", async () => {
    const request: RegisterRequest = {
      firstName: "bob",
      lastName: "smith",
      userAlias: "@bobby",
      password: "myPassword",
      imageString: "someString",
      imageFileExtension: ".jpg",
    };

    const [user, authToken] = await serverFacade.register(request);

    expect(user).toBeInstanceOf(User);
    expect(authToken).toBeInstanceOf(AuthToken);
  });

  test("Get Followers", async () => {
    const request: PagedUserItemRequest = {
      token: "abcdefg",
      userAlias: "@Allen",
      pageSize: 3,
      lastItem: null,
    };

    const [users, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(users).toHaveLength(3);
    expect(hasMore).toBeTruthy();
  });

  test("Get Followers Count", async () => {
    const request: FollowCountRequest = {
      token: "abcdefg",
      user: {
        firstName: "Allen",
        lastName: "Anderson",
        alias: "@allen",
        imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",
      },
    };

    const followerCount = await serverFacade.getFollowerCount(request);

    expect(followerCount).toBeGreaterThan(0);
  });
});
