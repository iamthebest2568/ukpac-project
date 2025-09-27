import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import Page from "../EndSequencePage";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <Page {...props} />
  </DesktopMockup>
);

export default Wrapped;
