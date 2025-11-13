import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useOrchestrAI } from '@/contexts/OrchestrAIContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ProjectSetup = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { setTeamMembers, setTasks } = useOrchestrAI();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!projectDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please describe your project first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-project', {
        body: { projectDescription }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Set the generated data
      setTeamMembers(data.teamMembers || []);
      setTasks(data.tasks || []);

      toast({
        title: "Project generated!",
        description: `Created ${data.teamMembers?.length || 0} team members and ${data.tasks?.length || 0} tasks`,
      });

      setProjectDescription('');
    } catch (error) {
      console.error('Error generating project:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">AI Project Setup</CardTitle>
            <CardDescription>
              Describe your project and let AI generate your team and tasks
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Example: I need to build an e-commerce website with a React frontend and Node.js backend. The project includes user authentication, product catalog, shopping cart, and payment processing. We need both frontend and backend developers, plus a UI/UX designer."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !projectDescription.trim()}
          className="w-full gap-2"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Project
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
