import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public constructor(view: LoginView) {
    super(view);
  }

  async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    this.doAuthFailureReportingOperation(async () => {
      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");
  }
}
