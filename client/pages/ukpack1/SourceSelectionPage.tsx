import React from "react";
import DesktopMockup from "./components/DesktopMockup";
import SourceSelection from "../../components/journey/SourceSelection";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <SourceSelection {...props} useUk1Button={true} />
  </DesktopMockup>
);

export default Wrapped;
