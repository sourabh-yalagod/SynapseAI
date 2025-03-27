"use client";
import ChatBox from "@/components/ChatBox";
import PDFView from "@/components/PDFView";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const File = () => {
  const params: { id: string } = useParams();
  const id = params.id;

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    (async () => {
      if (params.id) {
        const { data } = await axios.get(`/api/document/${params.id}`);
        console.log(data);
        setUrl(data?.data?.url);
        setName(data?.data?.name);
      }
    })();
  }, [params.id]);
  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      {/* Right */}
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">
        {/* Chat */}
        <ChatBox id={id} />
      </div>

      {/* Left */}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        {/* PDFView */}
        <PDFView name={name} url={url} />
      </div>
    </div>
  );
};

export default File;
