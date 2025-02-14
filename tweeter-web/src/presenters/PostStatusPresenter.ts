import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClass: string | undefined
  ) => void;
  clearLastInfoMessage: () => void;
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostStatusPresenter {
  private statusService: StatusService;
  private _view: PostStatusView;
  private _isLoading: boolean;

  public constructor(view: PostStatusView) {
    this.statusService = new StatusService();
    this._view = view;
    this._isLoading = false;
  }

  public async submitPost(
    currentUser: User | null,
    authToken: AuthToken | null,
    post: string,
    event: React.MouseEvent
  ) {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage("Posting status...", 0, undefined);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000, undefined);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.isLoading = false;
    }
  }

  private get view() {
    return this._view;
  }

  public get isLoading() {
    return this._isLoading;
  }

  private set isLoading(value: boolean) {
    this._isLoading = value;
  }
}
