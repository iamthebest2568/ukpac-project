import DesktopMockup from "./components/DesktopMockup";
import Page from "../UkStornawayPage";

const Wrapped = (props: any) => (
  <DesktopMockup>
    <Page {...props} />
  </DesktopMockup>
);

export default Wrapped;
