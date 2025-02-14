import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
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

export class UserInfoPresenter {
  private userService: UserService;
  private _view: UserInfoView;
  private _isFollower;
  private _isLoading;

  public constructor(view: UserInfoView) {
    this.userService = new UserService();
    this._view = view;
    this._isFollower = false;
    this._isLoading = false;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.userService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweeCount(
        await this.userService.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(
        await this.userService.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    this.view.setDisplayedUser(this.view.currentUser!);
  };

  followDisplayedUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage(
        `Following ${this.view.displayedUser!.name}...`,
        0,
        undefined
      );

      const [followerCount, followeeCount] = await this.userService.follow(
        this.view.authToken!,
        this.view.displayedUser!
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

  public async unfollowDisplayedUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage(
        `Unfollowing ${this.view.displayedUser!.name}...`,
        0,
        undefined
      );

      const [followerCount, followeeCount] = await this.userService.unfollow(
        this.view.authToken!,
        this.view.displayedUser!
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

  private get view() {
    return this._view;
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
