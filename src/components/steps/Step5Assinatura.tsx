import { useEffect, useState, useRef } from 'react';
import { ContractData } from '@/types/contract';
import SignaturePad, { SignaturePadRef } from '@/components/SignaturePad';
import { Pen, Check, RotateCcw, Smartphone, X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ScreenOrientationWithLock extends ScreenOrientation {
  lock(orientation: 'landscape'): Promise<void>;
  unlock(): void;
}

interface Step5Props {
  data: ContractData;
  updateSignature: (party: 'contratado' | 'contratante', signature: string) => void;
  signatureRefs: {
    contratante: React.RefObject<SignaturePadRef>;
  };
  errors: Record<string, string>;
  onGeneratePDF: () => void;
}

const Step5Assinatura = ({ data, updateSignature, signatureRefs, errors, onGeneratePDF }: Step5Props) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSigningMode, setIsSigningMode] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!data.assinaturas?.contratante);
  const { toast } = useToast();
  const signContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
    setHasSignature(!!data.assinaturas?.contratante);
  }, [data.assinaturas?.contratante]);

  const enterSigningMode = async () => {
    if (!signContainerRef.current) return;
    setIsSigningMode(true);
    const el = signContainerRef.current;
    try {
      await el.requestFullscreen({ navigationUI: 'hide' });
      try {
        await (screen.orientation as ScreenOrientationWithLock).lock('landscape');
      } catch (err) {
        console.warn('Could not lock orientation.');
      }
    } catch (err) {
      console.error('Could not enter fullscreen mode:', err);
      toast({
        title: "Modo Tela Cheia Indisponível",
        description: "Continue a assinatura e vire o celular manualmente.",
      });
    }
  };

  const exitSigningMode = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    try {
      (screen.orientation as ScreenOrientationWithLock).unlock();
    } catch (e) { /* Safe to ignore */ }
    setIsSigningMode(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsSigningMode(false);
        try {
          (screen.orientation as ScreenOrientationWithLock).unlock();
        } catch (e) { /* Safe to ignore */ }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSignatureChange = (sig: string) => {
    updateSignature('contratante', sig);
    setHasSignature(!!sig);
  };

  const handleClear = () => signatureRefs.contratante.current?.clear();

  const handleConfirmSignature = () => {
    if (hasSignature) {
      exitSigningMode();
    }
  };

  if (isMobile) {
    return (
      <div className="animate-fade-in">
        <div ref={signContainerRef} className={isSigningMode ? 'fixed inset-0 z-50 bg-gray-900' : ''}>
          {isSigningMode && (
            <>
              <div className="absolute inset-0 z-20 bg-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 landscape:hidden">
                <RotateCw className="w-20 h-20 text-yellow-400 animate-spin" />
                <h2 className="text-2xl font-bold mt-6 text-white">Vire o seu dispositivo</h2>
                <p className="text-lg text-gray-300 mt-2">A assinatura deve ser feita na horizontal.</p>
              </div>
              <div className="w-full h-full text-white flex-col landscape:flex-row hidden landscape:flex">
                  <div className="p-4 flex flex-col justify-between bg-gray-800 w-full landscape:w-72">
                      <div>
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3"><Pen className="w-6 h-6 text-yellow-400" /><h2 className="text-xl font-bold">Sua Assinatura</h2></div>
                            <button onClick={exitSigningMode} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"><X className="w-5 h-5" /></button>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">Assinando como: <span className="font-semibold text-white">{data.contratante.nome || 'Contratante'}</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                          <Button onClick={handleClear} variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"><RotateCcw className="w-5 h-5 mr-2" /> Limpar</Button>
                          <Button onClick={handleConfirmSignature} disabled={!hasSignature} className="w-full col-span-2 py-4 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"><Check className="w-6 h-6 mr-2" /> Confirmar Assinatura</Button>
                      </div>
                  </div>
                  <div className="flex-1 relative bg-white">
                    <SignaturePad ref={signatureRefs.contratante} label="" onSignatureChange={handleSignatureChange} fullscreen />
                    {!hasSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center"><div className="text-gray-400"><Pen className="w-12 h-12 mx-auto mb-4" /><p className="text-2xl font-medium">Assine aqui</p></div></div>
                    )}
                  </div>
              </div>
            </>
          )}
        </div>

        {!isSigningMode && (
          <div className="p-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-primary">Assinatura do Contrato</h2>
                <p className="text-muted-foreground mt-2">A assinatura é o último passo para gerar seu contrato.</p>
              </div>
              {hasSignature ? (
                <div className="form-section text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2"><Check className="w-5 h-5 text-green-500" /> Assinatura Salva</h3>
                  <div className="bg-white border rounded-lg p-2 max-w-sm mx-auto"><img src={data.assinaturas.contratante} alt="Sua assinatura" className="max-h-24 mx-auto"/></div>
                  <Button onClick={enterSigningMode} variant="outline" className="w-full mt-4 max-w-sm mx-auto">Assinar Novamente</Button>
                </div>
              ) : (
                <div className="form-section">
                  <Button onClick={enterSigningMode} className="w-full py-6 text-lg font-bold flex flex-col items-center justify-center gap-2">
                    <Smartphone className="w-6 h-6" />
                    <span>Toque para Assinar</span>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-3">Seu celular ficará na horizontal para a assinatura.</p>
                </div>
              )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8"><h2 className="text-2xl font-heading font-bold text-primary">Assinatura do Contrato</h2><p className="text-muted-foreground mt-2">Assine digitalmente para finalizar o contrato</p></div>
      <div className="form-section max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Pen className="w-5 h-5 text-primary" />Assinatura do Contratante</h3>
          <p className="text-sm text-muted-foreground mb-4">{data.contratante.nome || 'Nome não informado'}</p>
          <SignaturePad ref={signatureRefs.contratante} label="Assine aqui com o mouse" onSignatureChange={handleSignatureChange} error={errors['assinaturas.contratante']} />
      </div>
    </div>
  );
};

export default Step5Assinatura;
