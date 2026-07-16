import { getCurrentUserId } from "@/lib/current-user";
import { getChatPartners, getChatHistory } from "@/lib/queries";
import { ChatClient } from "@/components/dashboard/chat-client";
import { redirect } from "next/navigation";

export default async function DoctorMessagesPage({ 
  searchParams 
}: { 
  searchParams?: Promise<{ activeId?: string }> 
}) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    redirect("/login");
  }

  const query = (await searchParams) ?? {};
  const partners = await getChatPartners(currentUserId, "doctor");
  
  const activePartnerId = query.activeId || partners[0]?.id || "";
  const messages = activePartnerId 
    ? await getChatHistory(currentUserId, activePartnerId) 
    : [];

  return (
    <ChatClient
      currentUserId={currentUserId}
      role="doctor"
      partners={partners}
      initialActivePartnerId={activePartnerId}
      initialMessages={messages}
    />
  );
}
