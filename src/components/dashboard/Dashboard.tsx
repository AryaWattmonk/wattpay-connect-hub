import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLink, LogOut, Menu, Zap } from 'lucide-react';
import { dataService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import type { Financer, Process } from '@/services/api';

export const Dashboard = () => {
  const [financers, setFinancers] = useState<Financer[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedFinancer, setSelectedFinancer] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('');
  const [combinedPdfUrl, setCombinedPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { userEmail, clearAuth } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    loadFinancers();
  }, []);

  const loadFinancers = async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getFinancers();
      setFinancers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load financers"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProcesses = async (financerId: string) => {
    if (!financerId) {
      setProcesses([]);
      return;
    }

    try {
      const data = await dataService.getProcessesByFinancier(financerId);
      setProcesses(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load processes"
      });
    }
  };

  const handleFinancerChange = (value: string) => {
    setSelectedFinancer(value);
    setSelectedProcess('');
    loadProcesses(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFinancer || !selectedProcess || !combinedPdfUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedFinancerName = financers.find(f => f.id === selectedFinancer)?.name || '';
      const selectedProcessName = processes.find(p => p.processStageId === selectedProcess)?.processStageName || '';
      
      await dataService.submitWattpayRequest({
        financer: selectedFinancerName,
        process: selectedProcessName,
        userId: '6', // TODO: Get actual user ID
        combinedPdf: combinedPdfUrl
      });
      
      toast({
        title: "Success",
        description: "Request submitted successfully!"
      });
      
      // Reset form
      setSelectedFinancer('');
      setSelectedProcess('');
      setCombinedPdfUrl('');
      setProcesses([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const redirectToWattPay = () => {
    window.open('https://watt-pay.com', '_blank');
  };

  const isFormValid = selectedFinancer && selectedProcess && combinedPdfUrl.trim();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">WattPay Quick Access</h1>
              <p className="text-muted-foreground">Manage your financer processes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {userEmail}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-background/50 border-border/50">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-sm border-border/50">
                <DropdownMenuItem onClick={redirectToWattPay} className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Go to WattPay.com
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Form */}
        <Card className="max-w-2xl mx-auto bg-gradient-card backdrop-blur-sm border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Submit Financer Request
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select a financer and process to submit your request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="financer" className="text-foreground">
                  Financer <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedFinancer} onValueChange={handleFinancerChange} disabled={isLoading}>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder={isLoading ? "Loading financers..." : "Select Financer"} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
                    {financers.map((financer) => (
                      <SelectItem key={financer.id} value={financer.id}>
                        {financer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="process" className="text-foreground">
                  Process <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={selectedProcess} 
                  onValueChange={setSelectedProcess}
                  disabled={!selectedFinancer || processes.length === 0}
                >
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder={!selectedFinancer ? "Select a financer first" : "Select Process"} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
                    {processes.map((process) => (
                      <SelectItem key={process.processStageId} value={process.processStageId}>
                        {process.processStageName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="combinedPdf" className="text-foreground">
                  Combined PDF URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="combinedPdf"
                  type="url"
                  placeholder="Enter PDF URL"
                  value={combinedPdfUrl}
                  onChange={(e) => setCombinedPdfUrl(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};