import { Target, CheckCircle2, Circle } from 'lucide-react';
import { useOrchestrAI } from '@/contexts/OrchestrAIContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

export const AssignmentView = () => {
  const { teamMembers, tasks, reassignTask, toggleTaskCompletion } = useOrchestrAI();

  const assignedTasks = tasks.filter(t => t.assignedTo);
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const allAssigned = tasks.every(t => t.assignedTo || t.completed);
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Assignments</h2>
          <p className="text-sm text-muted-foreground">View and manage task distribution</p>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>
            {completedTasks} of {totalTasks} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {assignedTasks.length} assigned • {tasks.filter(t => !t.assignedTo && !t.completed).length} unassigned
            </span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {allAssigned && totalTasks > 0 && (
        <Card className="border-success bg-success/5">
          <CardContent className="pt-6">
            <p className="text-lg font-semibold text-success flex items-center gap-2">
              🎯 All tasks are distributed efficiently!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Assignments by Member */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Assignments by Team Member</h3>
        
        {teamMembers.map((member) => {
          const memberTasks = tasks.filter(t => t.assignedTo === member.id);
          if (memberTasks.length === 0) return null;

          return (
            <Card key={member.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {memberTasks.length} task(s)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memberTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </span>
                          <Badge
                            variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Select
                        value={task.assignedTo || ''}
                        onValueChange={(value) => reassignTask(task.id, value || undefined)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Reassign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassign</SelectItem>
                          {teamMembers.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Unassigned Tasks */}
      {tasks.filter(t => !t.assignedTo && !t.completed).length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Unassigned Tasks</CardTitle>
            <CardDescription>Tasks waiting to be assigned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks
                .filter(t => !t.assignedTo && !t.completed)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <Circle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{task.title}</span>
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Select
                      value={task.assignedTo || ''}
                      onValueChange={(value) => reassignTask(task.id, value || undefined)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No tasks to assign yet. Add some tasks to get started!</p>
        </div>
      )}
    </div>
  );
};
