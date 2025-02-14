import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter {
  private userService: UserService;
  private _isLoading: boolean = false;
  private _rememberMe: boolean = false;
  private _view: LoginView;

  public constructor(view: LoginView) {
    this.userService = new UserService();
    this._view = view;
  }

  async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  protected get view() {
    return this._view;
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public get rememberMe() {
    return this._rememberMe;
  }

  public set rememberMe(value: boolean) {
    this._rememberMe = value;
  }
}
