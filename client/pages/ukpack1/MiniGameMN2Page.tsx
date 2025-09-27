import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import Page from "../MiniGameMN2Page";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
