'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiPost } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Paperclip,
  X,
  Trash2,
  MessageSquare,
  School,
  CalendarCheck,
  BookOpen,
  Wallet,
  Bus,
  Building2,
  Library,
  FileText,
  RefreshCw,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { label: 'My Attendance', icon: CalendarCheck, query: 'What is my current attendance percentage?' },
  { label: 'Upcoming Exams', icon: BookOpen, query: 'Show my upcoming exam schedule' },
  { label: 'Fee Status', icon: Wallet, query: 'What is my current fee status?' },
  { label: 'Timetable', icon: School, query: 'Show my today\'s timetable' },
  { label: 'Library Books', icon: Library, query: 'What books do I have issued?' },
  { label: 'Applications', icon: FileText, query: 'Status of my applications' },
];

function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Campus Assistant. I can help you with attendance, exams, fees, timetable, and more. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = useApiPost('/student/chatbot/message', {
    onSuccess: (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again or contact support.',
          timestamp: new Date(),
        },
      ]);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    chatMutation.mutate({ message: input.trim(), sessionId });
  };

  const handleQuickQuestion = (query: string) => {
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    chatMutation.mutate({ message: query, sessionId });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your AI Campus Assistant. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">AI Assistant</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ask me anything about your campus life
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={clearChat}>
          <RefreshCw size={14} />
          New Chat
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="hidden lg:block space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Quick Questions
          </p>
          <div className="space-y-2">
            {quickQuestions.map((q) => (
              <button
                key={q.label}
                onClick={() => handleQuickQuestion(q.query)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:border-primary/50 hover:shadow-md transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <q.icon size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium">{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-3 glass-card border-0 flex flex-col overflow-hidden">
          <CardHeader className="pb-3 border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Campus AI Assistant</CardTitle>
                <CardDescription>Online | Ready to help</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea ref={scrollRef} className="h-full">
              <div className="p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'flex gap-3',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.role === 'assistant' && (
                        <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2.5',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted/50 rounded-bl-md'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={cn(
                          'text-[10px] mt-1',
                          msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {msg.role === 'user' && (
                        <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                          <AvatarFallback className="bg-secondary text-xs">
                            <User size={14} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                  {chatMutation.isPending && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t shrink-0">
            <div className="flex items-center gap-2 w-full">
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                <Paperclip size={16} />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="pr-10"
                  disabled={chatMutation.isPending}
                />
              </div>
              <Button
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
              >
                <Send size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}

export default ChatbotPage;
