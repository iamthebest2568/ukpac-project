import React from "react";
import TabletMockup from "./components/TabletMockup";
import Page from "../WhatDoYouTravelByPage";

const Wrapped = (props: any) => (
  <TabletMockup>
    <Page {...props} />
  </TabletMockup>
);

export default Wrapped;
