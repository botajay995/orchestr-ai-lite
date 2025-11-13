import { useState } from 'react';
import { OrchestrAIProvider } from '@/contexts/OrchestrAIContext';
import { ProjectSetup } from '@/components/ProjectSetup';
import { TeamSection } from '@/components/TeamSection';
import { TaskSection } from '@/components/TaskSection';
import { AssignmentView } from '@/components/AssignmentView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('setup');

  return (
    <OrchestrAIProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  OrchestrAI Lite
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  AI-Powered Team & Task Management
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 h-auto p-1">
              <TabsTrigger value="setup" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">✨</span> Setup
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">👥</span> Team
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">📋</span> Tasks
              </TabsTrigger>
              <TabsTrigger value="assignments" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">🎯</span> Assign
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-6">
              <ProjectSetup />
            </TabsContent>

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
        <footer className="border-t mt-12 sm:mt-16 py-4 sm:py-6 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground">
            <p>OrchestrAI Lite - AI-Powered Project Management</p>
          </div>
        </footer>
      </div>
    </OrchestrAIProvider>
  );
};

export default Index;
