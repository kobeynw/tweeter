import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClass: string | undefined
  ) => void;
  clearLastInfoMessage: () => void;
  currentUser: User | null;
  authToken: AuthToken | null;
  displayedUser: User | null;
  setDisplayedUser: (user: User) => void;
  setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
  setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;
  private _isFollower;
  private _isLoading;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
    this._isFollower = false;
    this._isLoading = false;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.userService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.userService.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.userService.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  public switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    this.view.setDisplayedUser(this.view.currentUser!);
  };

  followDisplayedUser = async (
    displayedUser: User | null,
    authToken: AuthToken | null,
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0,
        undefined
      );

      const [followerCount, followeeCount] = await this.userService.follow(
        authToken!,
        displayedUser!
      );

      this.isFollower = true;
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.isLoading = false;
    }
  };

  public async unfollowDisplayedUser(
    displayedUser: User | null,
    authToken: AuthToken | null,
    event: React.MouseEvent
  ): Promise<void> {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0,
        undefined
      );

      const [followerCount, followeeCount] = await this.userService.unfollow(
        authToken!,
        displayedUser!
      );

      this.isFollower = false;
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.isLoading = false;
    }
  }

  public get isFollower() {
    return this._isFollower;
  }

  private set isFollower(value: boolean) {
    this._isFollower = value;
  }

  public get isLoading() {
    return this._isLoading;
  }

  private set isLoading(value: boolean) {
    this._isLoading = value;
  }
}
