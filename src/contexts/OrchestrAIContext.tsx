import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  workloadCapacity: number; // Max number of tasks
  currentWorkload: number; // Current number of assigned tasks
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  assignedTo?: string; // Team member ID
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface OrchestrAIContextType {
  teamMembers: TeamMember[];
  tasks: Task[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'currentWorkload'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  assignTasksAutomatically: () => void;
  reassignTask: (taskId: string, memberId: string | undefined) => void;
  toggleTaskCompletion: (taskId: string) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setTasks: (tasks: Task[]) => void;
}

const OrchestrAIContext = createContext<OrchestrAIContextType | undefined>(undefined);

export const useOrchestrAI = () => {
  const context = useContext(OrchestrAIContext);
  if (!context) {
    throw new Error('useOrchestrAI must be used within OrchestrAIProvider');
  }
  return context;
};

interface OrchestrAIProviderProps {
  children: ReactNode;
}

export const OrchestrAIProvider = ({ children }: OrchestrAIProviderProps) => {
  // Initialize with example data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const stored = localStorage.getItem('orchestrai-team');
    if (stored) return JSON.parse(stored);
    return [
      {
        id: '1',
        name: 'Sarah Chen',
        role: 'Frontend Developer',
        skills: ['React', 'TypeScript', 'UI/UX'],
        workloadCapacity: 5,
        currentWorkload: 0,
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        role: 'Backend Developer',
        skills: ['Node.js', 'Database', 'API'],
        workloadCapacity: 4,
        currentWorkload: 0,
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        role: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'Database'],
        workloadCapacity: 6,
        currentWorkload: 0,
      },
    ];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('orchestrai-tasks');
    if (stored) return JSON.parse(stored);
    return [
      {
        id: '1',
        title: 'Design Dashboard UI',
        description: 'Create the main dashboard interface with modern design',
        requiredSkills: ['React', 'UI/UX'],
        completed: false,
        priority: 'high',
      },
      {
        id: '2',
        title: 'Build REST API',
        description: 'Develop the backend API endpoints',
        requiredSkills: ['Node.js', 'API'],
        completed: false,
        priority: 'high',
      },
      {
        id: '3',
        title: 'Setup Database Schema',
        description: 'Design and implement the database structure',
        requiredSkills: ['Database'],
        completed: false,
        priority: 'medium',
      },
      {
        id: '4',
        title: 'Implement Authentication',
        description: 'Add user login and registration',
        requiredSkills: ['React', 'Node.js'],
        completed: false,
        priority: 'high',
      },
    ];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('orchestrai-team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('orchestrai-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTeamMember = (member: Omit<TeamMember, 'id' | 'currentWorkload'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString(),
      currentWorkload: 0,
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteTeamMember = (id: string) => {
    // Unassign tasks assigned to this member
    setTasks(tasks.map(t => t.assignedTo === id ? { ...t, assignedTo: undefined } : t));
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  // Smart assignment algorithm
  const assignTasksAutomatically = () => {
    // Reset all workloads
    const updatedMembers = teamMembers.map(m => ({ ...m, currentWorkload: 0 }));
    
    // Sort tasks by priority
    const sortedTasks = [...tasks].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    const updatedTasks = sortedTasks.map(task => {
      if (task.completed) return task;

      // Find eligible members (have matching skills and available capacity)
      const eligibleMembers = updatedMembers
        .filter(member => {
          // Check if member has at least one required skill
          const hasSkill = task.requiredSkills.some(skill =>
            member.skills.includes(skill)
          );
          // Check if member has capacity
          const hasCapacity = member.currentWorkload < member.workloadCapacity;
          return hasSkill && hasCapacity;
        })
        .sort((a, b) => {
          // Prioritize members with more matching skills
          const aMatches = task.requiredSkills.filter(s => a.skills.includes(s)).length;
          const bMatches = task.requiredSkills.filter(s => b.skills.includes(s)).length;
          if (aMatches !== bMatches) return bMatches - aMatches;
          // Then by available capacity
          return (b.workloadCapacity - b.currentWorkload) - (a.workloadCapacity - a.currentWorkload);
        });

      if (eligibleMembers.length > 0) {
        const assignedMember = eligibleMembers[0];
        assignedMember.currentWorkload++;
        return { ...task, assignedTo: assignedMember.id };
      }

      return { ...task, assignedTo: undefined };
    });

    setTasks(updatedTasks);
    setTeamMembers(updatedMembers);
  };

  const reassignTask = (taskId: string, memberId: string | undefined) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, assignedTo: memberId } : t));
    
    // Recalculate workloads
    const workloads = new Map<string, number>();
    tasks.forEach(task => {
      if (task.assignedTo && !task.completed) {
        const current = workloads.get(task.assignedTo) || 0;
        workloads.set(task.assignedTo, current + 1);
      }
    });
    
    setTeamMembers(teamMembers.map(m => ({
      ...m,
      currentWorkload: workloads.get(m.id) || 0,
    })));
  };

  return (
    <OrchestrAIContext.Provider
      value={{
        teamMembers,
        tasks,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addTask,
        updateTask,
        deleteTask,
        assignTasksAutomatically,
        reassignTask,
        toggleTaskCompletion,
        setTeamMembers,
        setTasks,
      }}
    >
      {children}
    </OrchestrAIContext.Provider>
  );
};
