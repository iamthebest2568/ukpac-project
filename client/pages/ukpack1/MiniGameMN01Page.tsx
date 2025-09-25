import React from "react";
import TabletMockup from "../ukpack2/components/TabletMockup";
import Page from "../MiniGameMN01Page";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
