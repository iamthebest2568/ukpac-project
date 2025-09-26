import React from "react";
import TabletMockup from "./components/TabletMockup";
import Page from "../Ask04Page";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
