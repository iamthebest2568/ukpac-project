import React from "react";
import TabletMockup from "./components/TabletMockup";
import Page from "../NotFound";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
