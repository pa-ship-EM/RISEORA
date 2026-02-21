import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Clock, ArrowRight, BookMarked, GraduationCap } from "lucide-react";
import { useEducation } from "@/hooks/use-education";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Badge } from "@/components/ui/badge";

export default function EducationPage() {
    const { modules, isLoading, getModuleProgress } = useEducation();

    if (isLoading) {
        return (
            <DashboardLayout>
                <DashboardSkeleton />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary mb-2">Learning Center</h1>
                    <p className="text-muted-foreground">Master your credit knowledge through our guided educational modules.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const progress = getModuleProgress(module.id);
                        const isCompleted = progress?.isCompleted;
                        const progressPercent = module.totalLessons > 0
                            ? Math.round(((progress?.completedLessons || 0) / module.totalLessons) * 100)
                            : 0;

                        return (
                            <Card key={module.id} className="hover:shadow-lg transition-all border-slate-200">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        {isCompleted ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completed</Badge>
                                        ) : progressPercent > 0 ? (
                                            <Badge variant="secondary">In Progress</Badge>
                                        ) : (
                                            <Badge variant="outline">New</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="font-serif text-xl">{module.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {module.totalLessons} Lessons</span>
                                            <span>{progressPercent}%</span>
                                        </div>
                                        <Progress value={progressPercent} className="h-1.5" />
                                    </div>
                                    <Button className="w-full font-bold group">
                                        {isCompleted ? "Review Content" : progressPercent > 0 ? "Continue Learning" : "Start Module"}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {modules.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <BookMarked className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-semibold mb-2">No Modules Active</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                            We're currently preparing new educational content. Please check back soon.
                        </p>
                    </div>
                )}

                <section className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                            <GraduationCap className="h-12 w-12 text-primary" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl font-bold text-primary mb-2">Your Educational Journey</h2>
                            <p className="text-sm text-muted-foreground">
                                Completing these modules helps you understand your rights under the FCRA and empowers you to manage your financial reputation independently.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
