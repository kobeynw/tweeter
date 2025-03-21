import { AuthToken, Status, PagedStatusItemRequest, PostStatusRequest } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem === null ? null : lastItem.dto,
    };
    const response = await Service.serverFacade.getMoreFeedItems(request);

    return response;
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };
    const response = await Service.serverFacade.getMoreStoryItems(request);

    return response;
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus === null ? null : newStatus.dto,
    };
    await Service.serverFacade.postStatus(request);
  }
}
