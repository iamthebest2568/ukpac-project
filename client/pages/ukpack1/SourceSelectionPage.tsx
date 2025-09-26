import React from "react";
import TabletMockup from "./components/TabletMockup";
import SourceSelection from "../../components/journey/SourceSelection";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
