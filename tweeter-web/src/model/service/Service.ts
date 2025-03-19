import { ServerFacade } from "../network/ServerFacade";

export class Service {
  protected static serverFacade: ServerFacade = new ServerFacade();
}
