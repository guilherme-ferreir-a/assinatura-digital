import { useState, useRef, useCallback, useEffect } from 'react';
import { ContractData, initialContractData, CONTRATADO_FIXO } from '@/types/contract';
import { generateContractPDF } from '@/utils/pdfGenerator';
import StepIndicator from '@/components/StepIndicator';
import { SignaturePadRef } from '@/components/SignaturePad';
import Step1Contratante from '@/components/steps/Step1Contratante';
import Step2Aluno from '@/components/steps/Step2Aluno';
import Step3Pagamento from '@/components/steps/Step3Pagamento';
import Step4Preview from '@/components/steps/Step4Preview';
import Step5Assinatura from '@/components/steps/Step5Assinatura';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, FileDown, Bus, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { validateCPF, validateEmail, validatePhone, validateCurrency } from '@/utils/formatters';
import assinaturaContratado from '@/assets/assinatura-contratado.jpeg';

const steps = [
  { id: 1, title: 'Contratante', description: 'Dados do responsável' },
  { id: 2, title: 'Aluno', description: 'Informações do estudante' },
  { id: 3, title: 'Pagamento', description: 'Valores e opções' },
  { id: 4, title: 'Prévia', description: 'Leitura do contrato' },
  { id: 5, title: 'Assinatura', description: 'Assinatura digital' },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [contractData, setContractData] = useState<ContractData>(initialContractData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const signatureRefs = {
    contratante: useRef<SignaturePadRef>(null),
  };

  // Load contractor signature on mount
  useEffect(() => {
    const loadContractorSignature = async () => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/jpeg');
          setContractData(prev => ({
            ...prev,
            assinaturas: {
              ...prev.assinaturas,
              contratado: base64,
            },
          }));
        };
        img.src = assinaturaContratado;
      } catch (e) {
        console.log('Error loading contractor signature');
      }
    };
    loadContractorSignature();
  }, []);

  const updateData = useCallback((section: keyof ContractData, field: string, value: string | boolean) => {
    if (section === 'declaracaoLeitura') {
      setContractData(prev => ({
        ...prev,
        declaracaoLeitura: value as boolean,
      }));
    } else {
      setContractData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as Record<string, unknown>),
          [field]: value,
        },
      }));
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${section}.${field}`];
      return newErrors;
    });
  }, []);

  const updateSignature = useCallback((party: 'contratado' | 'contratante', signature: string) => {
    setContractData(prev => ({
      ...prev,
      assinaturas: {
        ...prev.assinaturas,
        [party]: signature,
      },
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`assinaturas.${party}`];
      return newErrors;
    });
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Contratante
        if (!contractData.contratante.nome.trim()) newErrors['contratante.nome'] = 'Nome é obrigatório';
        if (!contractData.contratante.cpf.trim()) newErrors['contratante.cpf'] = 'CPF é obrigatório';
        else if (!validateCPF(contractData.contratante.cpf)) newErrors['contratante.cpf'] = 'CPF inválido';
        if (!contractData.contratante.telefone.trim()) newErrors['contratante.telefone'] = 'Telefone é obrigatório';
        else if (!validatePhone(contractData.contratante.telefone)) newErrors['contratante.telefone'] = 'Telefone inválido';
        if (!contractData.contratante.endereco.trim()) newErrors['contratante.endereco'] = 'Endereço é obrigatório';
        if (!contractData.contratante.email.trim()) newErrors['contratante.email'] = 'E-mail é obrigatório';
        else if (!validateEmail(contractData.contratante.email)) newErrors['contratante.email'] = 'E-mail inválido';
        break;

      case 2: // Aluno
        if (!contractData.aluno.nome.trim()) newErrors['aluno.nome'] = 'Nome do aluno é obrigatório';
        if (!contractData.aluno.dataNascimento) newErrors['aluno.dataNascimento'] = 'Data de nascimento é obrigatória';
        if (!contractData.aluno.escola.trim()) newErrors['aluno.escola'] = 'Escola é obrigatória';
        if (!contractData.aluno.serieTurma.trim()) newErrors['aluno.serieTurma'] = 'Série/Turma é obrigatória';
        if (!contractData.aluno.enderecoResidencial.trim()) newErrors['aluno.enderecoResidencial'] = 'Endereço residencial é obrigatório';
        break;

      case 3: // Pagamento
        if (!contractData.pagamento.valorMensal.trim()) newErrors['pagamento.valorMensal'] = 'Valor mensal é obrigatório';
        else if (!validateCurrency(contractData.pagamento.valorMensal)) newErrors['pagamento.valorMensal'] = 'Valor inválido';
        if (!contractData.vigencia.anoLetivo.trim()) newErrors['vigencia.anoLetivo'] = 'Ano letivo é obrigatório';
        if (!contractData.vigencia.dataContrato) newErrors['vigencia.dataContrato'] = 'Data do contrato é obrigatória';
        break;

      case 4: // Preview
        if (!contractData.declaracaoLeitura) newErrors['declaracaoLeitura'] = 'Você precisa declarar que leu o contrato';
        break;

      case 5: // Assinatura
        // CORRECT VALIDATION: Check the state (the source of truth), not the ref.
        if (!contractData.assinaturas.contratante) {
          newErrors['assinaturas.contratante'] = 'Assinatura do contratante é obrigatória';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps(prev => [...prev, currentStep]);
        }
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast.error('Preencha todos os campos obrigatórios corretamente');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGeneratePDF = async () => {
    // The validation now correctly checks the state, so we can proceed.
    if (!validateStep(5)) {
      toast.error('Assinatura do contratante é obrigatória');
      return;
    }

    // The `contractData` state is already up-to-date thanks to the `updateSignature` callback.
    // No need to recapture the signature from the ref.

    try {
      // Pass the final, correct data directly to the PDF generator.
      await generateContractPDF(contractData);
      toast.success('Contrato gerado com sucesso!', {
        description: 'O PDF foi baixado automaticamente.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erro ao gerar o contrato', {
        description: 'Por favor, tente novamente.',
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Contratante data={contractData} updateData={updateData} errors={errors} />;
      case 2:
        return <Step2Aluno data={contractData} updateData={updateData} errors={errors} />;
      case 3:
        return <Step3Pagamento data={contractData} updateData={updateData} errors={errors} />;
      case 4:
        return <Step4Preview data={contractData} updateData={updateData} errors={errors} />;
      case 5:
        return (
          <Step5Assinatura
            data={contractData}
            updateSignature={updateSignature}
            signatureRefs={signatureRefs}
            errors={errors}
            onGeneratePDF={handleGeneratePDF}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-header text-primary-foreground py-6 px-4 shadow-medium">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-3">
            <Bus className="w-8 h-8" />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-heading font-bold">
                Contrato de Transporte Escolar
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Assinatura Digital Segura
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-muted border-b border-border py-3 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-success" /><span>Assinatura Digital</span></div>
            <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><span>PDF Completo</span></div>
            <div className="flex items-center gap-2"><Bus className="w-4 h-4 text-accent" /><span>Contrato Oficial</span></div>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="contract-paper p-6 mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        <div className="contract-paper p-6 md:p-8 mb-8">
          {renderStep()}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep < 5 ? (
            <Button onClick={handleNext} className="w-full sm:w-auto btn-primary-gradient flex items-center gap-2">
              Próximo
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGeneratePDF}
              className="w-full sm:w-auto btn-accent-gradient flex items-center gap-2 text-lg py-6"
            >
              <FileDown className="w-5 h-5" />
              Gerar Contrato em PDF
            </Button>
          )}
        </div>
      </main>

      <footer className="bg-muted border-t border-border py-6 px-4 mt-auto">
        <div className="container mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sistema de Contratos de Transporte Escolar</p>
          <p className="mt-1">Caxias do Sul, RS - Brasil</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
