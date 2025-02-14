import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LogoutView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClass: string | undefined
  ) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
}

export class LogoutPresenter {
  private userService: UserService;
  private _view: LogoutView;

  public constructor(view: LogoutView) {
    this.userService = new UserService();
    this._view = view;
  }

  public async logOut(authToken: AuthToken | null) {
    this.view.displayInfoMessage("Logging Out...", 0, undefined);

    try {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }

  private get view() {
    return this._view;
  }
}
