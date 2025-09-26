import React from "react";
import TabletMockup from "./components/TabletMockup";
import SourceSelection from "../../components/journey/SourceSelection";

const Wrapped = (props: any) => (
  <TabletMockup>
    <SourceSelection {...props} useUk1Button={true} />
  </TabletMockup>
);

export default Wrapped;
