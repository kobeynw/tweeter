import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LogoutView extends View {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClass: string | undefined
  ) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private userService: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this.userService = new UserService();
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
}
