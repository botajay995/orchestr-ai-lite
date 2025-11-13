import { useState } from 'react';
import { OrchestrAIProvider } from '@/contexts/OrchestrAIContext';
import { TeamSection } from '@/components/TeamSection';
import { TaskSection } from '@/components/TaskSection';
import { AssignmentView } from '@/components/AssignmentView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('team');

  return (
    <OrchestrAIProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  OrchestrAI Lite
                </h1>
                <p className="text-sm text-muted-foreground">
                  Intelligent Team & Task Management System
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
              <TabsTrigger value="team" className="gap-2">
                <span className="hidden sm:inline">👥</span> Team Setup
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-2">
                <span className="hidden sm:inline">📋</span> Project Tasks
              </TabsTrigger>
              <TabsTrigger value="assignments" className="gap-2">
                <span className="hidden sm:inline">🎯</span> Assignments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="team" className="space-y-6">
              <TeamSection />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <TaskSection />
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <AssignmentView />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t mt-16 py-6 bg-card">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>OrchestrAI Lite - Built with React, TypeScript & TailwindCSS</p>
          </div>
        </footer>
      </div>
    </OrchestrAIProvider>
  );
};

export default Index;
