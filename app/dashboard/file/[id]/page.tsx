"use client";
import { useParams } from "next/navigation";
import React from "react";

const File = () => {
  const params = useParams();

  return <div>File : {params?.id}</div>;
};

export default File;
