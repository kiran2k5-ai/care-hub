"use client";

import { useEffect, useState, useTransition, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Send, 
  Search, 
  User, 
  Video, 
  Phone, 
  MoreVertical, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { sendMessageAction } from "@/app/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ChatPartner {
  id: string;
  fullName: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatClientProps {
  currentUserId: string;
  role: "patient" | "doctor";
  partners: ChatPartner[];
  initialActivePartnerId?: string;
  initialMessages: Message[];
}

export function ChatClient({ 
  currentUserId, 
  role, 
  partners = [], 
  initialActivePartnerId, 
  initialMessages = [] 
}: ChatClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Set active thread partner
  const [activePartnerId, setActivePartnerId] = useState<string>(
    initialActivePartnerId || partners[0]?.id || ""
  );

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePartner = useMemo(() => {
    return partners.find((p) => p.id === activePartnerId);
  }, [partners, activePartnerId]);

  // Filter partners list
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [partners, searchQuery]);

  // Filter messages for current active partner thread (fallback filter in client)
  const currentMessages = useMemo(() => {
    return initialMessages.filter(
      (m) => 
        (m.senderId === currentUserId && m.receiverId === activePartnerId) ||
        (m.senderId === activePartnerId && m.receiverId === currentUserId)
    );
  }, [initialMessages, currentUserId, activePartnerId]);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Real-time listener for incoming database messages
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // Handle Sending Message
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim() || !activePartnerId) return;

    const content = messageInput;
    setMessageInput("");

    startTransition(async () => {
      const result = await sendMessageAction({
        receiverId: activePartnerId,
        content: content.trim(),
      });
      
      if (result?.error) {
        setMessageInput(content); // restore on error
        return;
      }
      
      router.refresh();
    });
  };

  // Nav Links Header Helper
  const dashboardLink = role === "patient" ? "/patient/dashboard" : "/doctor/dashboard";
  const recordsLink = role === "patient" ? "/patient/records" : "/doctor/patients";
  const schedulerLink = role === "patient" ? "/patient/appointments" : "/doctor/appointments";

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href={dashboardLink} className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight">
            CareHub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href={dashboardLink} 
            className="border border-slate-200 hover:bg-slate-50 text-[#0b335c] text-xs font-semibold px-4.5 py-2 rounded-full transition-colors shadow-sm"
          >
            Dashboard
          </Link>
          <Link 
            href="/login" 
            className="bg-[#0b335c] hover:bg-[#061e38] text-white text-xs font-semibold px-4.5 py-2 rounded-full transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
        
        {/* Left Side: Users list (4-cols width) */}
        <aside className="w-full md:w-80 bg-white border border-slate-200/80 rounded-3xl flex flex-col overflow-hidden shadow-sm shrink-0">
          {/* Header Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-[#009688]" />
              <span>Consultations Chat</span>
            </h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-slate-350"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2">
            {filteredPartners.length > 0 ? (
              filteredPartners.map((part) => {
                const isActive = part.id === activePartnerId;
                return (
                  <button
                    key={part.id}
                    onClick={() => {
                      setActivePartnerId(part.id);
                      router.push(`?activeId=${part.id}`);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center gap-3 ${
                      isActive 
                        ? "bg-[#0b335c]/5 border border-[#0b335c]/10" 
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center font-bold text-xs text-[#0b335c] shrink-0">
                      {part.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-xs truncate">{part.fullName}</p>
                      <p className="text-[10px] text-slate-450 uppercase tracking-wider font-semibold mt-0.5">{part.role}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-slate-400 text-xs italic text-center py-8">No contacts found.</p>
            )}
          </div>
        </aside>

        {/* Right Side: Message Thread Area */}
        <section className="flex-1 bg-white border border-slate-200/80 rounded-3xl flex flex-col overflow-hidden shadow-sm">
          
          {activePartner ? (
            <>
              {/* Top active bar */}
              <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0b335c]">
                    {activePartner.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{activePartner.fullName}</h4>
                    <p className="text-[9px] text-[#009688] font-bold uppercase tracking-wider">Online Consulting Slot</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-450">
                  <button className="hover:text-[#0b335c] cursor-pointer"><Phone className="h-4.5 w-4.5" /></button>
                  <button className="hover:text-[#0b335c] cursor-pointer"><Video className="h-4.5 w-4.5" /></button>
                  <button className="hover:text-[#0b335c] cursor-pointer"><MoreVertical className="h-4.5 w-4.5" /></button>
                </div>
              </div>

              {/* Messages Bubble Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                {currentMessages.length > 0 ? (
                  currentMessages.map((msg) => {
                    const isSelf = msg.senderId === currentUserId;
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-md rounded-2xl px-4 py-3.5 text-xs shadow-xs leading-relaxed ${
                            isSelf 
                              ? "bg-[#0b665c] text-white rounded-tr-none" 
                              : "bg-white border border-slate-150 text-slate-800 rounded-tl-none"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span suppressHydrationWarning className={`block text-[9px] mt-1.5 text-right font-medium ${isSelf ? "text-teal-200" : "text-slate-400"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-3 p-12">
                    <MessageSquare className="h-10 w-10 text-slate-300" />
                    <p className="font-bold text-[#0b335c] text-sm">No messages yet</p>
                    <p className="text-slate-400 text-xs">Start the consultation conversation by typing a message below.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Entry input */}
              <div className="p-4 border-t border-slate-150">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input 
                    type="text"
                    placeholder="Type your message details here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350"
                  />
                  <button 
                    type="submit"
                    disabled={!messageInput.trim() || isPending}
                    className="bg-[#0b335c] hover:bg-[#061e38] disabled:bg-slate-200 text-white p-3 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
              </div>

            </>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-3 p-12">
              <MessageSquare className="h-12 w-12 text-slate-350" />
              <p className="font-bold text-[#0b335c] text-sm">Select a Conversation</p>
              <p className="text-slate-400 text-xs">Pick a consultation partner thread from the sidebar to chat.</p>
            </div>
          )}

        </section>

      </div>

    </main>
  );
}
