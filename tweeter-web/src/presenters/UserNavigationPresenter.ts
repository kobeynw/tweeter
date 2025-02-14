import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined
  ) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private userService: UserService;
  private _view: UserNavigationView;

  public constructor(view: UserNavigationView) {
    this.userService = new UserService();
    this._view = view;
  }

  public async navigateToUser(
    currentUser: User | null,
    authToken: AuthToken | null,
    event: React.MouseEvent
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  private extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  private get view() {
    return this._view;
  }
}
