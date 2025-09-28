import DesktopMockup from "./components/DesktopMockup";
import Page from "../Index";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <Page {...props} />
  </DesktopMockup>
);

export default Wrapped;
