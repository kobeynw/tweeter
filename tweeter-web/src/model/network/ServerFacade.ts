import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  Status,
  User,
  UserDto,
  StatusDto,
  AuthTokenDto,
  LoginRequest,
  LoginResponse,
  AuthToken,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://a8rkmhx4zg.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }

  public async getMoreFeedItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/feed");

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }

  public async getMoreStoryItems(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/story");

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<PostStatusRequest, PostStatusResponse>(
      request,
      "/status/submit"
    );

    if (!response.success) {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(
      request,
      "/user/login"
    );

    // Handle errors
    if (response.success) {
      const userItem: User | null = response.user ? (User.fromDto(response.user) as User) : null;
      const tokenItem: AuthToken | null = response.authToken
        ? (AuthToken.fromDto(response.authToken) as AuthToken)
        : null;

      if (userItem == null) {
        throw new Error(`No user found`);
      } else if (tokenItem == null) {
        throw new Error(`No AuthToken found`);
      } else {
        return [userItem, tokenItem];
      }
    } else {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<RegisterRequest, RegisterResponse>(
      request,
      "/user/register"
    );

    // Handle errors
    if (response.success) {
      const userItem: User | null = response.user ? (User.fromDto(response.user) as User) : null;
      const tokenItem: AuthToken | null = response.authToken
        ? (AuthToken.fromDto(response.authToken) as AuthToken)
        : null;

      if (userItem == null) {
        throw new Error(`No user found`);
      } else if (tokenItem == null) {
        throw new Error(`No AuthToken found`);
      } else {
        return [userItem, tokenItem];
      }
    } else {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<LogoutRequest, LogoutResponse>(
      request,
      "/user/logout"
    );

    // Handle errors
    if (!response.success) {
      console.error(response);
      throw new Error(
        response.message !== null ? response.message : "TweeterResponse message error"
      );
    }
  }
}
