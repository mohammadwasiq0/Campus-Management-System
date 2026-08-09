'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Microscope,
  FileText,
  Users,
  DollarSign,
  Plus,
  ExternalLink,
  BookOpen,
  Calendar,
  Award,
  Globe,
  Search,
  Edit3,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  doi: string;
  type: 'journal' | 'conference' | 'book' | 'patent';
  citations: number;
}

interface ResearchProject {
  id: string;
  title: string;
  fundingAgency: string;
  amount: string;
  duration: string;
  status: 'ongoing' | 'completed' | 'proposed';
  role: string;
  description: string;
}

interface ResearchStudent {
  id: string;
  name: string;
  program: string;
  topic: string;
  startYear: number;
  status: 'active' | 'completed';
}

const publications: Publication[] = [
  { id: 'p1', title: 'Deep Learning Approaches for Natural Language Understanding: A Comprehensive Survey', journal: 'IEEE Transactions on Neural Networks', year: 2025, authors: 'S. Khan, A. Kumar, R. Patel', doi: '10.1109/TNN.2025.12345', type: 'journal', citations: 45 },
  { id: 'p2', title: 'Attention-Based Multi-Modal Fusion for Sentiment Analysis', journal: 'ACL Conference 2024', year: 2024, authors: 'S. Khan, M. Ahmed', doi: '10.18653/v1/2024.acl.567', type: 'conference', citations: 28 },
  { id: 'p3', title: 'Efficient Transformer Architectures for Edge Devices', journal: 'Springer Nature Computer Science', year: 2024, authors: 'S. Khan, P. Verma', doi: '10.1007/s42979-024-1234', type: 'journal', citations: 15 },
  { id: 'p4', title: 'Machine Learning for Predictive Analytics in Education', journal: 'Journal of Educational Data Mining', year: 2023, authors: 'S. Khan, K. Sharma', doi: '10.5281/zenodo.1234567', type: 'journal', citations: 32 },
  { id: 'p5', title: 'Patent: Intelligent Grading System Using NLP', journal: 'US Patent Office', year: 2025, authors: 'S. Khan, IIT Delhi', doi: 'US2025/0123456', type: 'patent', citations: 0 },
];

const researchProjects: ResearchProject[] = [
  { id: 'r1', title: 'AI-Powered Adaptive Learning Platform', fundingAgency: 'DST SERB', amount: '₹45L', duration: '2024-2027', status: 'ongoing', role: 'Principal Investigator', description: 'Developing an adaptive learning platform using AI to personalize educational content for students based on their learning patterns.' },
  { id: 'r2', title: 'Multilingual NLP for Indian Languages', fundingAgency: 'UGC', amount: '₹20L', duration: '2023-2026', status: 'ongoing', role: 'Co-Investigator', description: 'Creating NLP models and datasets for low-resource Indian languages.' },
  { id: 'r3', title: 'Smart Campus IoT Framework', fundingAgency: 'AICTE', amount: '₹15L', duration: '2022-2025', status: 'completed', role: 'Principal Investigator', description: 'IoT-based framework for campus automation and energy management.' },
];

const researchStudents: ResearchStudent[] = [
  { id: 'rs1', name: 'Vikram Reddy', program: 'Ph.D.', topic: 'Explainable AI in Education', startYear: 2024, status: 'active' },
  { id: 'rs2', name: 'Ananya Gupta', program: 'Ph.D.', topic: 'Low-Resource NLP', startYear: 2023, status: 'active' },
  { id: 'rs3', name: 'Rohit Singh', program: 'M.Tech', topic: 'Transformer Optimization', startYear: 2025, status: 'active' },
  { id: 'rs4', name: 'Priya Sharma', program: 'Ph.D.', topic: 'Computer Vision for Agriculture', startYear: 2022, status: 'completed' },
];

const newPublicationDefault = { title: '', journal: '', year: new Date().getFullYear(), authors: '', doi: '', type: 'journal', citations: 0 };

function FacultyResearchPage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [search, setSearch] = useState('');
  const [showAddPub, setShowAddPub] = useState(false);
  const [newPub, setNewPub] = useState(newPublicationDefault);

  const filteredPubs = publications.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.journal.toLowerCase().includes(search.toLowerCase())
  );

  const totalCitations = publications.reduce((a, p) => a + p.citations, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Research</h1>
          <p className="text-muted-foreground mt-1">Manage research projects, publications, and students</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{researchProjects.length}</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{publications.length}</p>
            <p className="text-xs text-muted-foreground">Publications</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">{researchStudents.length}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{totalCitations}</p>
            <p className="text-xs text-muted-foreground">Citations</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-5">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="projects" className="gap-2"><Microscope size={14} /> Projects</TabsTrigger>
              <TabsTrigger value="publications" className="gap-2"><FileText size={14} /> Publications</TabsTrigger>
              <TabsTrigger value="students" className="gap-2"><Users size={14} /> Research Students</TabsTrigger>
              <TabsTrigger value="grants" className="gap-2"><DollarSign size={14} /> Grants</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              {researchProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        <Microscope size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-xs text-muted-foreground">{project.role} • {project.duration}</p>
                      </div>
                    </div>
                    <Badge variant={project.status === 'ongoing' ? 'success' : project.status === 'completed' ? 'secondary' : 'warning'}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Award size={12} /> {project.fundingAgency}</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} /> {project.amount}</span>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="publications">
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search publications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 w-64" />
                </div>
                <Dialog open={showAddPub} onOpenChange={setShowAddPub}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2"><Plus size={14} /> Add Publication</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Publication</DialogTitle>
                      <DialogDescription>Add a research publication to your profile</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Title</label>
                        <Input value={newPub.title} onChange={e => setNewPub({ ...newPub, title: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Journal/Conference</label>
                          <Input value={newPub.journal} onChange={e => setNewPub({ ...newPub, journal: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Type</label>
                          <Select value={newPub.type} onValueChange={v => setNewPub({ ...newPub, type: v as any })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="journal">Journal</SelectItem>
                              <SelectItem value="conference">Conference</SelectItem>
                              <SelectItem value="book">Book Chapter</SelectItem>
                              <SelectItem value="patent">Patent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Year</label>
                          <Input type="number" value={newPub.year} onChange={e => setNewPub({ ...newPub, year: Number(e.target.value) })} />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">DOI</label>
                          <Input value={newPub.doi} onChange={e => setNewPub({ ...newPub, doi: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Authors</label>
                        <Input value={newPub.authors} onChange={e => setNewPub({ ...newPub, authors: e.target.value })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddPub(false)}>Cancel</Button>
                      <Button onClick={() => { setShowAddPub(false); setNewPub(newPublicationDefault); }}>Add Publication</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {filteredPubs.map((pub, i) => (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={pub.type === 'journal' ? 'info' : pub.type === 'conference' ? 'warning' : pub.type === 'patent' ? 'secondary' : 'default'} className="text-[10px]">
                            {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{pub.year}</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{pub.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{pub.journal}</p>
                        <p className="text-xs text-muted-foreground">{pub.authors}</p>
                        <p className="text-xs text-muted-foreground mt-1">DOI: {pub.doi}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{pub.citations}</p>
                          <p className="text-[10px] text-muted-foreground">Citations</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 size={12} /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500"><Trash2 size={12} /></Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchStudents.map((rs, i) => (
                  <motion.div
                    key={rs.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                        {rs.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{rs.name}</h3>
                          <Badge variant={rs.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
                            {rs.status.charAt(0).toUpperCase() + rs.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rs.program} • Since {rs.startYear}</p>
                        <p className="text-xs mt-1"><span className="font-medium">Topic:</span> {rs.topic}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="grants" className="space-y-4">
              <Card className="bg-white/50 dark:bg-gray-800/50 border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Research Grants Overview</h3>
                      <p className="text-xs text-muted-foreground">Total grant funding secured</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">₹80L</p>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    {researchProjects.map((g) => (
                      <div key={g.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-border/50">
                        <div>
                          <p className="text-sm font-medium">{g.fundingAgency}</p>
                          <p className="text-xs text-muted-foreground">{g.title} • {g.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{g.amount}</p>
                          <p className="text-xs text-muted-foreground">{g.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default FacultyResearchPage;
