import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

interface userNavigation {
  navigateToItem: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): userNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: UserNavigationView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  const navigateToUser = (e: React.MouseEvent) =>
    presenter.navigateToUser(currentUser, authToken, e);

  return {
    navigateToItem: navigateToUser,
  };
};

export default useUserNavigation;
