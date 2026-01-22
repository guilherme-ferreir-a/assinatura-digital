import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Eraser, Pen, AlertCircle } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  onSignatureChange?: (signature: string) => void;
  error?: string;
  fullscreen?: boolean;
}

export interface SignaturePadRef {
  clear: () => void;
  getSignature: () => string;
  isEmpty: () => boolean;
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ label, onSignatureChange, error, fullscreen = false }, ref) => {
    const signatureRef = useRef<SignatureCanvas>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 150 });

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          // The canvas data is lost on resize, so we have to re-draw it.
          const signatureData = signatureRef.current?.toData();
          
          setDimensions({
            width: rect.width,
            height: rect.height,
          });

          if (signatureData) {
            // Use a timeout to ensure the canvas element has been updated in the DOM
            setTimeout(() => signatureRef.current?.fromData(signatureData), 0);
          }
        }
      };

      // Debounce resize events to avoid performance issues
      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateDimensions, 100);
      };
      
      updateDimensions(); // Initial size

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
        clearTimeout(resizeTimeout);
      };
    }, [fullscreen]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        signatureRef.current?.clear();
        onSignatureChange?.('');
      },
      getSignature: () => {
        if (signatureRef.current?.isEmpty()) return '';
        return signatureRef.current?.toDataURL('image/png') || '';
      },
      isEmpty: () => signatureRef.current?.isEmpty() ?? true,
    }));

    const handleEnd = () => {
      if (signatureRef.current && !signatureRef.current.isEmpty()) {
        const signature = signatureRef.current.toDataURL('image/png');
        onSignatureChange?.(signature);
      } else {
        onSignatureChange?.('');
      }
    };

    const handleClear = () => {
      signatureRef.current?.clear();
      onSignatureChange?.('');
    };

    if (fullscreen) {
      return (
        <div ref={containerRef} className="w-full h-full bg-white touch-none">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: dimensions.width,
              height: dimensions.height,
              className: 'w-full h-full'
            }}
            penColor="#1e3a5f"
            backgroundColor="white"
            onEnd={handleEnd}
            minWidth={2.5}
            maxWidth={5}
          />
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <label className="input-label flex items-center gap-2">
              <Pen className="w-4 h-4 text-primary" />
              {label}
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <Eraser className="w-4 h-4" />
              Limpar
            </Button>
          </div>
        <div 
          ref={containerRef}
          className={`relative border-2 border-dashed rounded-lg overflow-hidden bg-card ${error ? 'border-destructive' : 'border-border'}`}
          style={{ height: '150px' }}
        >
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: dimensions.width,
              height: 150,
              className: 'w-full h-[150px]',
            }}
            penColor="#1e3a5f"
            backgroundColor="transparent"
            onEnd={handleEnd}
          />
          <div className="absolute bottom-2 left-3 right-3 border-t border-muted-foreground/30" />
          <span className="absolute bottom-4 left-4 text-xs text-muted-foreground">
            Assine acima da linha
          </span>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;
