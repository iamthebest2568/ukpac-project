import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import Page from "../Ask04Page";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <Page {...props} />
  </DesktopMockup>
);

export default Wrapped;
