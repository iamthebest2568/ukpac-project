import React from "react";
import TabletMockup from "../ukpack2/components/TabletMockup";
import Page from "../FakeNewsPage";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
