import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const FormInput = ({ label, error, icon, className, ...props }: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label className="input-label flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input
        className={cn(
          "h-11 bg-card border-border focus:ring-2 focus:ring-primary/20 transition-all",
          error && "border-destructive focus:ring-destructive/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
