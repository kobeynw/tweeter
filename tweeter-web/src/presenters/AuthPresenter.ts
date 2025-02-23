import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";
import { AuthToken, User } from "tweeter-shared";

export interface AuthView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export abstract class AuthPresenter<A extends AuthView> extends Presenter<A> {
  private _service: UserService;
  private _isLoading: boolean;

  public constructor(view: A) {
    super(view);
    this._service = new UserService();
    this._isLoading = false;
  }

  protected async doAuthFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      this.isLoading = true;

      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  protected get service() {
    return this._service;
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }
}
