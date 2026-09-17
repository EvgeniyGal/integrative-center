"use client";

import { useState } from "react";

import { ChatWidget } from "@/components/chat/ChatWidget";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export function FloatingActions({ chatEnabled }: { chatEnabled: boolean }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <ScrollToTop raised={chatEnabled} hidden={chatOpen} />
      {chatEnabled ? <ChatWidget onOpenChange={setChatOpen} /> : null}
    </>
  );
}
