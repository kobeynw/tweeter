import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClass: string | undefined
  ) => void;
  clearLastInfoMessage: () => void;
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;
  private _isLoading: boolean;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
    this._isLoading = false;
  }

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(
    currentUser: User | null,
    authToken: AuthToken | null,
    post: string
  ) {
    try {
      this._isLoading = true;
      this.view.displayInfoMessage("Posting status...", 0, undefined);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000, undefined);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${
          (error as Error).message
        }`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this._isLoading = false;
    }
  }

  public get isLoading() {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
  }
}
