import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import Page from "../Index";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
