import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Send,
  Paperclip,
  Mic,
  MoreVertical,
  Phone,
  ArrowLeft,
  CheckCheck,
  User,
  Video,
  Lock,
  Plus,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchChats, sendMessage, subscribe, fetchExperts, accessChat } from '@/services/chatService';
import { toast } from 'sonner';
import VideoCall from '@/components/chat/VideoCall';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ChatPage = () => {
  const { user, login } = useAuth(); // Assuming login updates user context, or we might need a setUser exposed
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [experts, setExperts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const data = await fetchChats();
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const newMessage = await sendMessage(selectedChat._id, message);
      // Update UI
      const updatedChats = chats.map(c => {
        if (c._id === selectedChat._id) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
            lastMessage: newMessage
          };
        }
        return c;
      });
      setChats(updatedChats);
      setSelectedChat(updatedChats.find(c => c._id === selectedChat._id));
      setMessage('');
    } catch (error: any) {
      if (error.code === 'LIMIT_REACHED') {
        setShowSubscriptionDialog(true);
      } else {
        toast.error('Failed to send message');
      }
    }
  };

  const handleSubscribe = async () => {
    try {
      const updatedUser = await subscribe();
      // Ideally update context, but for now we might need to refresh page or assume success
      toast.success('Subscribed successfully! unrestricted chatting enabled.');
      setShowSubscriptionDialog(false);
      // Force a reload or update user in context if possible
      // window.location.reload(); 
      // Better: just assume locally for this session if context doesn't auto-update
      if (user) user.isSubscribed = true;
    } catch (error) {
      toast.error('Subscription failed');
    }
  };

  const handleVideoCall = () => {
    if (!user?.isSubscribed && user?.role === 'farmer') {
      setShowSubscriptionDialog(true);
      return;
    }
    setInCall(true);
  };

  const handleNewChat = async () => {
    setShowNewChatDialog(true);
    try {
      const data = await fetchExperts();
      setExperts(data);
    } catch (error) {
      toast.error('Failed to load experts');
    }
  };

  const startChatWithExpert = async (expertId: string) => {
    const expert = experts.find(e => e._id === expertId);
    try {
      toast.info(`Connecting with ${expert?.name || 'Expert'}...`);
      const chat = await accessChat(expertId);
      if (!chats.find(c => c._id === chat._id)) {
        setChats([chat, ...chats]);
      }
      setSelectedChat(chat);
      setShowNewChatDialog(false);
      toast.success(`Connected with ${expert?.name || 'Expert'}`);
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const ChatList = () => (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-12" />
        </div>
        <Button size="icon" variant="outline" onClick={handleNewChat}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {Array.isArray(chats) && chats.map((chat) => {
          const otherUser = chat.participants.find((p: any) => p._id !== user?.id); // adjust id check based on backend response
          // Backend returns _id for mongo objects
          const otherPart = chat.participants.find((p: any) => p._id !== user?.id && p._id !== user?._id);
          const name = otherPart?.name || "Unknown User";

          return (
            <button
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 ${selectedChat?._id === chat._id ? 'bg-muted/50' : ''
                }`}
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-foreground">{name}</p>
                  <span className="text-xs text-muted-foreground">
                    {chat.lastMessage && new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
        {(!Array.isArray(chats) || chats.length === 0) && (
          <div className="p-4 text-center text-muted-foreground">
            No conversations yet.
          </div>
        )}
      </div>
    </div>
  );

  const ChatThread = () => {
    const otherPart = selectedChat?.participants.find((p: any) => p._id !== user?.id && p._id !== user?._id);
    const name = otherPart?.name || "Unknown User";

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedChat(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-xs text-growth">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleVideoCall}>
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {selectedChat?.messages?.map((msg: any) => {
            const isMe = msg.sender._id === user?.id || msg.sender === user?.id || msg.sender._id === user?._id;
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${isMe
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card text-card-foreground rounded-bl-md shadow-soft'
                    }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                    <span className={`text-xs ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck className={`w-4 h-4 ${msg.seen ? 'text-blue-300' : 'text-primary-foreground/50'}`} />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Mic className="w-5 h-5" />
            </Button>
            <Button variant="hero" size="icon" disabled={!message.trim()} onClick={handleSendMessage}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]"
      >
        <Card variant="default" className="h-full overflow-hidden">
          <div className="flex h-full">
            {/* Chat List - Hidden on mobile when chat selected */}
            <div className={`w-full lg:w-80 border-r border-border ${selectedChat ? 'hidden lg:block' : ''}`}>
              <ChatList />
            </div>

            {/* Chat Thread */}
            <div className={`flex-1 ${!selectedChat ? 'hidden lg:flex' : 'flex'} flex-col`}>
              {selectedChat ? (
                <ChatThread />
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div className="max-w-md">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UserPlus className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      Connect with Agriculture Experts
                    </h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                      Get expert advice on your crops, pest control, and farming techniques. Start a conversation today.
                    </p>
                    <Button onClick={handleNewChat} size="lg" className="gap-2 text-base px-8 h-12">
                      <Plus className="w-5 h-5" />
                      Find an Expert
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <VideoCall inCall={inCall} setInCall={setInCall} />

      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Unlimited Chat & Video Calls!</DialogTitle>
            <DialogDescription>
              You have reached your 2-message limit. Subscribe to our premium plan to continue chatting with experts and unlock Video Calling features.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCheck className="text-green-500 w-5 h-5" />
              <span>Unlimited Messages</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Video className="text-green-500 w-5 h-5" />
              <span>HD Video Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="text-green-500 w-5 h-5" />
              <span>Priority Expert Access</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubscriptionDialog(false)}>Cancel</Button>
            <Button onClick={handleSubscribe}>Subscribe Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Chat</DialogTitle>
            <DialogDescription>
              Select an expert to start a conversation with.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto">
            {Array.isArray(experts) && experts.length > 0 ? (
              experts.map((expert) => (
                <button
                  key={expert._id}
                  onClick={() => startChatWithExpert(expert._id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{expert.name}</p>
                    <p className="text-xs text-muted-foreground">{expert.role}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No experts found.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ChatPage;
