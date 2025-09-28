import DesktopMockup from "./components/DesktopMockup";
import Page from "../Ask02_2Page";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <Page {...props} />
  </DesktopMockup>
);

export default Wrapped;
