"use client";
import { useMemo } from "react";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";

const useData = () => {
  const features = useMemo(
    () => [
      {
        name: "Store your PDF Documents",
        description:
          "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
        icon: GlobeIcon,
      },
      {
        name: "Blazing Fast Responses",
        description:
          "Experience lightning-fast answers to your queries, ensuring you get the information you need instantly.",
        icon: ZapIcon,
      },
      {
        name: "Chat Memorisation",
        description:
          "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
        icon: BrainCogIcon,
      },
      {
        name: "Interactive PDF Viewer",
        description:
          "Engage with your PDFs like never before using our intuitive and interactive viewer.",
        icon: EyeIcon,
      },
      {
        name: "Cloud Backup",
        description:
          "Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage.",
        icon: ServerCogIcon,
      },
      {
        name: "Responsive Across Devices",
        description:
          "Access and chat with your PDFs seamlessly on any device, whether it's your desktop, tablet, or smartphone.",
        icon: MonitorSmartphoneIcon,
      },
    ],
    []
  );

  return { features };
};

export default useData;
