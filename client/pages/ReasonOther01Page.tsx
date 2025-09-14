import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

export default function ReasonOther01Page() {
  const { navigateToPage, sessionID } = useSession();

  const buttons = [
    {
      text: "ไปต่อ",
      onClick: () => navigateToPage("what_do_you_travel_by", { from: "reason_other_01", sessionID }),
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/1ca30c44dc55682aa7c0c1273799b2f3f61b5c99?width=2160"
      title="Reason other 01"
      buttons={buttons}
      className="reason-other-01-page"
      imageLoading="eager"
    />
  );
}
