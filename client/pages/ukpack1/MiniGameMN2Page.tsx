import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import Page from "../MiniGameMN2Page";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <Page {...props} />
  </DesktopMockup>
);

export default Wrapped;
