import { UserService } from "../model/service/UserService";
import { User, AuthToken } from "tweeter-shared";

export interface RegisterView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export class RegisterPresenter {
  private userService: UserService;
  private _isLoading: boolean = false;
  private _rememberMe: boolean = false;
  private _view: RegisterView;

  public constructor(view: RegisterView) {
    this.userService = new UserService();
    this._view = view;
  }

  async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
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
