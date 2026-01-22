import { useEffect } from 'react';
import { ContractData } from '@/types/contract';
import FormInput from '@/components/FormInput';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DollarSign, Calendar, CreditCard, Banknote, UserCheck } from 'lucide-react';
import { formatCurrency, currencyToExtenso, validateCurrency } from '@/utils/formatters';

interface Step3Props {
  data: ContractData;
  updateData: (section: keyof ContractData, field: string, value: string) => void;
  errors: Record<string, string>;
}

const Step3Pagamento = ({ data, updateData, errors }: Step3Props) => {
  const handleValueChange = (value: string) => {
    const formatted = formatCurrency(value);
    updateData('pagamento', 'valorMensal', formatted);
    
    // Auto-generate extenso
    const extenso = currencyToExtenso(value);
    updateData('pagamento', 'valorPorExtenso', extenso);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary">
          Pagamento e Opções
        </h2>
        <p className="text-muted-foreground mt-2">
          Defina os valores e condições do contrato
        </p>
      </div>

      <div className="form-section">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Valor do Serviço
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Valor Mensal (R$)"
            type="text"
            placeholder="Ex: 350,00"
            value={data.pagamento.valorMensal}
            onChange={(e) => handleValueChange(e.target.value)}
            icon={<DollarSign className="w-4 h-4 text-primary" />}
            error={errors['pagamento.valorMensal']}
            required
          />

          <div className="space-y-2">
            <Label className="input-label flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Valor por Extenso
            </Label>
            <div className="p-3 bg-muted rounded-lg border border-border min-h-[42px]">
              <span className="text-sm text-foreground capitalize">
                {data.pagamento.valorPorExtenso || 'Digite o valor para ver por extenso'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Label className="input-label flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-primary" />
            Forma de Pagamento
          </Label>
          
          <RadioGroup
            value={data.pagamento.formaPagamento}
            onValueChange={(value) => updateData('pagamento', 'formaPagamento', value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Label
              htmlFor="pix"
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.pagamento.formaPagamento === 'pix'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="pix" id="pix" />
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">PIX</p>
                <p className="text-xs text-muted-foreground">Transferência instantânea</p>
              </div>
            </Label>

            <Label
              htmlFor="especie"
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.pagamento.formaPagamento === 'especie'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="especie" id="especie" />
              <Banknote className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Em Espécie</p>
                <p className="text-xs text-muted-foreground">Pagamento em dinheiro</p>
              </div>
            </Label>
          </RadioGroup>
        </div>
      </div>

      <div className="form-section">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Vigência do Contrato
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Ano Letivo"
            type="text"
            placeholder="Ex: 2025"
            value={data.vigencia.anoLetivo}
            onChange={(e) => updateData('vigencia', 'anoLetivo', e.target.value)}
            icon={<Calendar className="w-4 h-4 text-primary" />}
            error={errors['vigencia.anoLetivo']}
            required
          />

          <FormInput
            label="Data do Contrato"
            type="date"
            value={data.vigencia.dataContrato}
            onChange={(e) => updateData('vigencia', 'dataContrato', e.target.value)}
            icon={<Calendar className="w-4 h-4 text-primary" />}
            error={errors['vigencia.dataContrato']}
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-primary" />
          Recebimento do Aluno
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label className="input-label mb-4 block">
              Haverá pessoa responsável no endereço de desembarque?
            </Label>
            <RadioGroup
              value={data.opcoes.pessoaResponsavelPresente}
              onValueChange={(value) => updateData('opcoes', 'pessoaResponsavelPresente', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Label
                htmlFor="sempre"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  data.opcoes.pessoaResponsavelPresente === 'sempre'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="sempre" id="sempre" />
                <div>
                  <p className="font-medium">Sempre haverá</p>
                  <p className="text-xs text-muted-foreground">Pessoa responsável sempre presente</p>
                </div>
              </Label>

              <Label
                htmlFor="eventualmente"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  data.opcoes.pessoaResponsavelPresente === 'eventualmente'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="eventualmente" id="eventualmente" />
                <div>
                  <p className="font-medium">Eventualmente não haverá</p>
                  <p className="text-xs text-muted-foreground">Pode não haver responsável</p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {data.opcoes.pessoaResponsavelPresente === 'eventualmente' && (
            <div className="animate-fade-in">
              <Label className="input-label mb-4 block">
                Autoriza desembarcar o aluno mesmo sem responsável?
              </Label>
              <RadioGroup
                value={data.opcoes.autorizacaoDesembarque}
                onValueChange={(value) => updateData('opcoes', 'autorizacaoDesembarque', value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="sim"
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    data.opcoes.autorizacaoDesembarque === 'sim'
                      ? 'border-success bg-success/5'
                      : 'border-border hover:border-success/50'
                  }`}
                >
                  <RadioGroupItem value="sim" id="sim" />
                  <div>
                    <p className="font-medium text-success">AUTORIZO</p>
                    <p className="text-xs text-muted-foreground">Sob minha responsabilidade</p>
                  </div>
                </Label>

                <Label
                  htmlFor="nao"
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    data.opcoes.autorizacaoDesembarque === 'nao'
                      ? 'border-destructive bg-destructive/5'
                      : 'border-border hover:border-destructive/50'
                  }`}
                >
                  <RadioGroupItem value="nao" id="nao" />
                  <div>
                    <p className="font-medium text-destructive">NÃO AUTORIZO</p>
                    <p className="text-xs text-muted-foreground">Deve haver responsável</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Pagamento;
