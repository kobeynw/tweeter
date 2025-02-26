import React from "react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockCurrentUser = new User("robert", "smith", "bob", "example.com");
  const mockAuthToken = new AuthToken("abc123", 0);

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
      authToken: mockAuthToken,
    });
  });

  it("starts with the Post Status and Clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when field has text", async () => {
    const { postStatusButton, clearButton, textField, user } =
      renderPostStatusAndGetElement();

    await user.type(textField, "a");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when field is cleared", async () => {
    const { postStatusButton, clearButton, textField, user } =
      renderPostStatusAndGetElement();

    await user.type(textField, "a");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPostStatusPresenter = mock<PostStatusPresenter>();
    const mockPostStatusPresenterInstance = instance(mockPostStatusPresenter);

    const post = "sample post";
    const { postStatusButton, textField, user } = renderPostStatusAndGetElement(
      mockPostStatusPresenterInstance
    );

    await user.type(textField, post);

    await user.click(postStatusButton);
    verify(
      await mockPostStatusPresenter.submitPost(
        mockCurrentUser,
        mockAuthToken,
        post
      )
    ).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByLabelText("post status");
  const clearButton = screen.getByLabelText("clear");
  const textField = screen.getByLabelText("post status text field");

  return { postStatusButton, clearButton, textField, user };
};
