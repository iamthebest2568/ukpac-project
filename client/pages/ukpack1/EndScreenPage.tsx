import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import Page from "../EndScreenPage";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <Page {...props} />
  </DesktopMockup>
);

export default Wrapped;
