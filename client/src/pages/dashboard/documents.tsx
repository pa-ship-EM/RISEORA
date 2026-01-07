import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FolderOpen, Image, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DisputeEvidence, DocumentType } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Link } from "wouter";

const DOCUMENT_TYPES: Record<DocumentType, { label: string; color: string }> = {
  'ID': { label: 'Government ID', color: 'bg-blue-100 text-blue-700' },
  'PROOF_OF_ADDRESS': { label: 'Proof of Address', color: 'bg-green-100 text-green-700' },
  'SSN_CARD': { label: 'SSN Card', color: 'bg-purple-100 text-purple-700' },
  'UTILITY_BILL': { label: 'Utility Bill', color: 'bg-amber-100 text-amber-700' },
  'FTC_REPORT': { label: 'FTC Report', color: 'bg-red-100 text-red-700' },
  'CREDIT_REPORT': { label: 'Credit Report', color: 'bg-indigo-100 text-indigo-700' },
  'OTHER': { label: 'Other', color: 'bg-gray-100 text-gray-700' },
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<DisputeEvidence[]>({
    queryKey: ['/api/evidence'],
    queryFn: async () => {
      const res = await fetch('/api/evidence', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/evidence/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast({ title: 'Document Deleted' });
      queryClient.invalidateQueries({ queryKey: ['/api/evidence'] });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Delete Failed' });
    },
  });

  const documentsByType = documents.reduce((acc, doc) => {
    const type = doc.documentType as DocumentType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {} as Record<DocumentType, DisputeEvidence[]>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">My Documents</h1>
            <p className="text-muted-foreground">View and manage your uploaded documents and evidence.</p>
          </div>
          <Badge variant="secondary" className="text-sm" data-testid="badge-doc-count">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : documents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">No Documents Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Documents you upload when creating or managing disputes will appear here. 
                Start by creating a dispute and uploading your supporting evidence.
              </p>
              <Link href="/dashboard/disputes">
                <Button className="gap-2" data-testid="button-go-to-disputes">
                  <ExternalLink className="h-4 w-4" /> Go to Disputes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(documentsByType).map(([type, docs]) => {
              const typeInfo = DOCUMENT_TYPES[type as DocumentType] || DOCUMENT_TYPES.OTHER;
              return (
                <Card key={type}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${typeInfo.color} border-0`}>{typeInfo.label}</Badge>
                        <span className="text-sm text-muted-foreground">({docs.length})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {docs.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
                          data-testid={`document-${doc.id}`}
                        >
                          <div className="flex items-center gap-3">
                            {doc.mimeType.startsWith('image/') ? (
                              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                                <img 
                                  src={`/api/evidence/${doc.id}/thumbnail`} 
                                  alt={doc.fileName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{doc.fileName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <span>•</span>
                                <span>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                              {doc.description && (
                                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px] sm:max-w-[300px]">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteMutation.mutate(doc.id)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-doc-${doc.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Document Types We Support</CardTitle>
            <CardDescription>
              These documents may be required when submitting disputes to credit bureaus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Government ID</p>
                  <p className="text-muted-foreground">Driver's license, passport, state ID</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Proof of Address</p>
                  <p className="text-muted-foreground">Utility bills, bank statements</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">SSN Verification</p>
                  <p className="text-muted-foreground">SSN card (first 5 digits redacted)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Credit Reports</p>
                  <p className="text-muted-foreground">Annual or bureau reports</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">FTC Reports</p>
                  <p className="text-muted-foreground">Identity theft reports</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Other Evidence</p>
                  <p className="text-muted-foreground">Any supporting documentation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
