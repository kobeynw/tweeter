import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;
  let postStatusPresenter: PostStatusPresenter;

  const user: User = new User("robert", "smith", "bob", "example.com");
  const authToken: AuthToken = new AuthToken("abc123", Date.now());
  const post: string = "Hello, world";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(user, authToken, post);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0, undefined)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and authToken", async () => {
    await postStatusPresenter.submitPost(user, authToken, post);

    verify(mockStatusService.postStatus(authToken, anything())).once();
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost(user, authToken, post);

    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000, undefined)
    ).once();
  });

  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
    const error = new Error("a status post error occurred");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

    await postStatusPresenter.submitPost(user, authToken, post);

    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: a status post error occurred"
      )
    ).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000, undefined)
    ).never();
  });
});
