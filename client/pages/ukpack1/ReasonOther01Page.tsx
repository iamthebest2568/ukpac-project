import React from "react";
import TabletMockup from "./components/TabletMockup";
import Page from "../ReasonOther01Page";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
