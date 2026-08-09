'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Brain, Search, Plus, Edit2, Trash2, Save, RefreshCw, Download, Upload,
  MessageCircle, FileText, BookOpen, Database, BarChart3, Settings,
  CheckCircle2, XCircle, AlertTriangle, Loader2, Globe, Zap, Cpu,
  SlidersHorizontal, ChevronRight, ArrowUpDown, Layers, Code,
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const aiModels = [
  { id: '1', name: 'GPT-4o', provider: 'OpenAI', type: 'Chat', status: 'active' as const, usage: 78, context: '128K', cost: '₹0.05/1K tokens' },
  { id: '2', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', type: 'Chat', status: 'active' as const, usage: 45, context: '200K', cost: '₹0.03/1K tokens' },
  { id: '3', name: 'Gemini Pro', provider: 'Google', type: 'Chat', status: 'active' as const, usage: 32, context: '128K', cost: '₹0.02/1K tokens' },
  { id: '4', name: 'text-embedding-3-small', provider: 'OpenAI', type: 'Embedding', status: 'active' as const, usage: 90, context: '8K', cost: '₹0.002/1K tokens' },
  { id: '5', name: 'Llama 3.1 70B', provider: 'Meta', type: 'Chat', status: 'inactive' as const, usage: 0, context: '128K', cost: '₹0.01/1K tokens' },
];

const knowledgeBases = [
  { id: '1', name: 'Academic Policies', documents: 45, lastUpdated: '2026-06-28', status: 'active' as const, chunkCount: 1250 },
  { id: '2', name: 'Course Catalog', documents: 120, lastUpdated: '2026-06-25', status: 'active' as const, chunkCount: 3400 },
  { id: '3', name: 'Student Handbook', documents: 15, lastUpdated: '2026-06-20', status: 'active' as const, chunkCount: 890 },
  { id: '4', name: 'FAQ Database', documents: 200, lastUpdated: '2026-06-15', status: 'active' as const, chunkCount: 2100 },
  { id: '5', name: 'Research Papers', documents: 350, lastUpdated: '2026-06-01', status: 'inactive' as const, chunkCount: 15000 },
];

const chatTemplates = [
  { id: '1', name: 'Student Support', purpose: 'Answer student queries', model: 'GPT-4o', base: 'Academic Policies, FAQ' },
  { id: '2', name: 'Faculty Assistant', purpose: 'Help faculty with tasks', model: 'Claude 3.5', base: 'Course Catalog, Academic Policies' },
  { id: '3', name: 'Admission Guide', purpose: 'Guide prospective students', model: 'GPT-4o', base: 'Academic Policies, FAQ' },
];

function AiPage() {
  const [activeTab, setActiveTab] = useState('models');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">AI Configuration</h1><p className="text-muted-foreground mt-1">Manage AI models, knowledge bases, chatbot, and embedding settings</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><BarChart3 size={14} /> Usage Stats</Button>
          <Button size="sm" className="gap-2"><Cpu size={16} /> Configure Model</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Models', value: aiModels.filter(m => m.status === 'active').length, color: 'from-blue-500 to-blue-600' },
          { label: 'Knowledge Bases', value: knowledgeBases.length, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Total Documents', value: knowledgeBases.reduce((s, k) => s + k.documents, 0), color: 'from-amber-500 to-amber-600' },
          { label: 'API Calls (Today)', value: '12,847', color: 'from-purple-500 to-purple-600' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card border-0"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-xl font-bold mt-1">{stat.value}</p></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="models"><Cpu size={14} className="mr-1" /> AI Models</TabsTrigger>
          <TabsTrigger value="knowledge"><Database size={14} className="mr-1" /> Knowledge Base</TabsTrigger>
          <TabsTrigger value="chatbot"><MessageCircle size={14} className="mr-1" /> Chatbot</TabsTrigger>
          <TabsTrigger value="templates"><FileText size={14} className="mr-1" /> Templates</TabsTrigger>
          <TabsTrigger value="embeddings"><Layers size={14} className="mr-1" /> Embeddings</TabsTrigger>
          <TabsTrigger value="usage"><BarChart3 size={14} className="mr-1" /> Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{aiModels.length} AI models configured</p>
            <Button size="sm" className="gap-1"><Plus size={14} /> Add Model</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModels.map((model, i) => (
              <motion.div key={model.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className={cn('glass-card border-0', model.status === 'inactive' && 'opacity-60')}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', model.type === 'Chat' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30')}>
                          {model.type === 'Chat' ? <MessageCircle size={20} className="text-purple-600" /> : <Layers size={20} className="text-blue-600" />}
                        </div>
                        <div><p className="font-medium text-sm">{model.name}</p><p className="text-xs text-muted-foreground">{model.provider}</p></div>
                      </div>
                      <Badge variant={model.status === 'active' ? 'success' : 'secondary'} className="text-[10px] capitalize">{model.status}</Badge>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{model.type}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Context</span><span>{model.context}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span>{model.cost}</span></div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1"><span>Usage</span><span>{model.usage}%</span></div>
                      <Progress value={model.usage} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{knowledgeBases.length} knowledge bases</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1"><Upload size={14} /> Upload Document</Button>
              <Button size="sm" className="gap-1"><Plus size={14} /> Create KB</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledgeBases.map((kb, i) => (
              <motion.div key={kb.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white"><Database size={18} /></div>
                        <div><p className="font-medium text-sm">{kb.name}</p><p className="text-xs text-muted-foreground">{kb.documents} documents</p></div>
                      </div>
                      <Badge variant={kb.status === 'active' ? 'success' : 'secondary'} className="text-[10px] capitalize">{kb.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Chunks: {kb.chunkCount.toLocaleString()}</p>
                      <p>Last updated: {new Date(kb.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs flex-1"><RefreshCw size={12} className="mr-1" /> Sync</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs flex-1"><Settings size={12} className="mr-1" /> Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Chatbot Configuration</CardTitle><CardDescription>Configure the AI chatbot for campus portal</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                <div><p className="text-sm font-medium">Enable Chatbot</p><p className="text-xs text-muted-foreground">Activate AI assistant across the portal</p></div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Primary Model</Label><Select defaultValue="gpt4"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gpt4">GPT-4o (Recommended)</SelectItem><SelectItem value="claude">Claude 3.5 Sonnet</SelectItem><SelectItem value="gemini">Gemini Pro</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Fallback Model</Label><Select defaultValue="gemini"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gpt4">GPT-4o</SelectItem><SelectItem value="claude">Claude 3.5 Sonnet</SelectItem><SelectItem value="gemini">Gemini Pro</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Temperature</Label><Select defaultValue="07"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="01">0.1 (Precise)</SelectItem><SelectItem value="05">0.5 (Balanced)</SelectItem><SelectItem value="07">0.7 (Creative)</SelectItem><SelectItem value="10">1.0 (Very Creative)</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Max Tokens</Label><Select defaultValue="2048"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1024">1,024</SelectItem><SelectItem value="2048">2,048</SelectItem><SelectItem value="4096">4,096</SelectItem></SelectContent></Select></div>
                <div className="space-y-2 col-span-2"><Label>System Prompt</Label><Textarea defaultValue="You are a helpful campus assistant. Answer student questions about courses, fees, schedules, and campus life. Be accurate and concise." rows={3} /></div>
                <div className="space-y-2 col-span-2"><Label>Welcome Message</Label><Input defaultValue="Hello! I'm your campus AI assistant. How can I help you today?" /></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border">
                <div><p className="text-sm font-medium">User Feedback Collection</p><p className="text-xs text-muted-foreground">Collect ratings on chatbot responses</p></div>
                <Switch defaultChecked />
              </div>
              <Button className="gap-2"><Save size={16} /> Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{chatTemplates.length} document templates</p>
            <Button size="sm" className="gap-1"><Plus size={14} /> Create Template</Button>
          </div>
          {chatTemplates.map((tpl, i) => (
            <motion.div key={tpl.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white"><FileText size={18} /></div>
                      <div><p className="font-medium">{tpl.name}</p><p className="text-xs text-muted-foreground">{tpl.purpose}</p></div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Model: {tpl.model}</span>
                    <span>Base: {tpl.base}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="embeddings" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Embedding Settings</CardTitle><CardDescription>Configure text embedding model and chunking strategy</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Embedding Model</Label><Select defaultValue="openai"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="openai">text-embedding-3-small</SelectItem><SelectItem value="openai2">text-embedding-3-large</SelectItem><SelectItem value="local">Local BGE</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Chunk Size</Label><Select defaultValue="512"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="256">256 tokens</SelectItem><SelectItem value="512">512 tokens</SelectItem><SelectItem value="1024">1024 tokens</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Chunk Overlap</Label><Select defaultValue="64"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="32">32 tokens</SelectItem><SelectItem value="64">64 tokens</SelectItem><SelectItem value="128">128 tokens</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Similarity Threshold</Label><Select defaultValue="075"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="05">0.5</SelectItem><SelectItem value="075">0.75</SelectItem><SelectItem value="09">0.9</SelectItem></SelectContent></Select></div>
              </div>
              <Button className="gap-2"><Save size={16} /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-4">
          <Card className="glass-card border-0">
            <CardHeader><CardTitle>Usage Statistics</CardTitle><CardDescription>API usage, token consumption, and cost analysis</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 text-center">
                  <p className="text-2xl font-bold">1,284,732</p>
                  <p className="text-xs text-muted-foreground">Total Tokens (Today)</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 text-center">
                  <p className="text-2xl font-bold">₹642</p>
                  <p className="text-xs text-muted-foreground">Estimated Cost (Today)</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 text-center">
                  <p className="text-2xl font-bold">12,847</p>
                  <p className="text-xs text-muted-foreground">API Calls (Today)</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Model-wise Usage</p>
                {[
                  { model: 'GPT-4o', tokens: '650K', cost: '₹325', calls: 6240, pct: 52 },
                  { model: 'Claude 3.5 Sonnet', tokens: '340K', cost: '₹170', calls: 3450, pct: 28 },
                  { model: 'Gemini Pro', tokens: '180K', cost: '₹90', calls: 2100, pct: 15 },
                  { model: 'text-embedding-3-small', tokens: '115K', cost: '₹57', calls: 1057, pct: 5 },
                ].map((m, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs"><span className="font-medium">{m.model}</span><span className="text-muted-foreground">{m.tokens} | {m.cost} | {m.calls} calls</span></div>
                    <Progress value={m.pct} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default AiPage;
