import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
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
} from 'lucide-react';
import { chatThreads, mockExpert, mockFarmer } from '@/data/mockData';

const mockMessages = [
  { id: '1', senderId: mockFarmer.id, content: 'Hello, I have a question about my tomato plants', type: 'text', createdAt: new Date('2024-01-15T09:00:00'), isRead: true },
  { id: '2', senderId: mockExpert.id, content: 'Hello! I\'d be happy to help. What seems to be the issue?', type: 'text', createdAt: new Date('2024-01-15T09:05:00'), isRead: true },
  { id: '3', senderId: mockFarmer.id, content: 'The leaves are turning yellow and falling off. Started about a week ago.', type: 'text', createdAt: new Date('2024-01-15T09:10:00'), isRead: true },
  { id: '4', senderId: mockExpert.id, content: 'This could be due to several reasons - overwatering, nutrient deficiency, or a fungal infection. Can you share a photo of the affected leaves?', type: 'text', createdAt: new Date('2024-01-15T09:15:00'), isRead: true },
  { id: '5', senderId: mockFarmer.id, content: 'Sure, here is a photo', type: 'text', createdAt: new Date('2024-01-15T09:20:00'), isRead: true },
  { id: '6', senderId: mockExpert.id, content: 'I recommend applying neem oil spray every 3 days.', type: 'text', createdAt: new Date('2024-01-15T10:30:00'), isRead: false },
];

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const selectedThread = chatThreads.find((t) => t.id === selectedChat);

  const ChatList = () => (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-12" />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatThreads.map((thread) => {
          const otherUser = thread.participants.find((p) => p.id !== mockFarmer.id);
          return (
            <button
              key={thread.id}
              onClick={() => setSelectedChat(thread.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 ${
                selectedChat === thread.id ? 'bg-muted/50' : ''
              }`}
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-foreground">{otherUser?.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {thread.lastMessage && new Date(thread.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {thread.lastMessage?.content}
                  </p>
                  {thread.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const ChatThread = () => {
    const otherUser = selectedThread?.participants.find((p) => p.id !== mockFarmer.id);

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
              <p className="font-semibold text-foreground">{otherUser?.name}</p>
              <p className="text-xs text-growth">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          {mockMessages.map((msg) => {
            const isMe = msg.senderId === mockFarmer.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card text-card-foreground rounded-bl-md shadow-soft'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                    <span className={`text-xs ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck className={`w-4 h-4 ${msg.isRead ? 'text-blue-300' : 'text-primary-foreground/50'}`} />}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card p-3 rounded-2xl rounded-bl-md shadow-soft">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
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
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Mic className="w-5 h-5" />
            </Button>
            <Button variant="hero" size="icon" disabled={!message.trim()}>
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
                  <div>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a chat from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default ChatPage;
