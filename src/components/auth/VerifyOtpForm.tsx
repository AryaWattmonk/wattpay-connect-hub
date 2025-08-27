import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface VerifyOtpFormProps {
  email: string;
  onSwitchToLogin: () => void;
  onOtpVerified: () => void;
}

export const VerifyOtpForm = ({ email, onSwitchToLogin, onOtpVerified }: VerifyOtpFormProps) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the OTP"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.verifyOtp(email, otp);
      toast({
        title: "Success",
        description: "OTP verified! You can now reset your password."
      });
      onOtpVerified();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "OTP Verification Failed",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-card backdrop-blur-sm border-border/50 shadow-elegant">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Verify OTP
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          An OTP has been sent to <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-foreground">
              OTP <span className="text-destructive">*</span>
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary text-center text-lg tracking-widest"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};