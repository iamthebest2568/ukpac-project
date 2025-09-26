import React from "react";
import TabletMockup from "./components/TabletMockup";
import Page from "../Ask02_2Page";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
