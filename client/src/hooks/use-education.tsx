import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { apiRequest } from "../lib/queryClient";

export interface EducationModule {
    id: string;
    title: string;
    description: string;
    content: string; // JSON string
    orderIndex: number;
    totalLessons: number;
}

export interface UserProgress {
    moduleId: string;
    completedLessons: number;
    isCompleted: boolean;
    lastAccessedAt: string;
}

export function useEducation() {
    const { data: modules = [], isLoading: modulesLoading } = useQuery<EducationModule[]>({
        queryKey: ["/api/education/modules"],
    });

    const { data: progress = [], isLoading: progressLoading } = useQuery<UserProgress[]>({
        queryKey: ["/api/education/progress"],
    });

    const updateProgressMutation = useMutation({
        mutationFn: async ({ moduleId, completedLessons, isCompleted }: { moduleId: string, completedLessons: number, isCompleted: boolean }) => {
            const res = await apiRequest("POST", `/api/education/progress/${moduleId}`, {
                completedLessons,
                isCompleted
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/education/progress"] });
        },
    });

    const getModuleProgress = (moduleId: string) => {
        return progress.find(p => p.moduleId === moduleId);
    };

    return {
        modules,
        progress,
        isLoading: modulesLoading || progressLoading,
        updateProgress: updateProgressMutation.mutate,
        getModuleProgress,
    };
}
