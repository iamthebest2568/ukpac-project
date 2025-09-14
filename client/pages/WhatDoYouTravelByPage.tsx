import FigmaStyle1Layout from "../components/layouts/FigmaStyle1Layout";
import { useSession } from "../hooks/useSession";

export default function WhatDoYouTravelByPage() {
  const { navigateToPage, sessionID } = useSession();

  const buttons = [
    {
      text: "ไปต่อ",
      onClick: () => navigateToPage("ask05", { from: "what_do_you_travel_by", sessionID }),
    },
  ];

  return (
    <FigmaStyle1Layout
      backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/1ca30c44dc55682aa7c0c1273799b2f3f61b5c99?width=2160"
      title="What do you travel by"
      buttons={buttons}
      className="what-do-you-travel-by-page"
      imageLoading="eager"
    />
  );
}
