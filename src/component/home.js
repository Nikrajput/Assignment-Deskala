import React, { useState, useEffect } from "react";
import SEO from './seo';
import Navbar from './navbar';
import Candidates from "./allCandidates";

export default function Landing(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO title="Home" />
      <Navbar />
      <Candidates />
    </>
  );
}
