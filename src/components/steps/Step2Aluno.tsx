import { ContractData } from '@/types/contract';
import FormInput from '@/components/FormInput';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Calendar, GraduationCap, MapPin, Bus } from 'lucide-react';

interface Step2Props {
  data: ContractData;
  updateData: (section: keyof ContractData, field: string, value: string) => void;
  errors: Record<string, string>;
}

const Step2Aluno = ({ data, updateData, errors }: Step2Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary">
          Dados do Aluno
        </h2>
        <p className="text-muted-foreground mt-2">
          Informações do estudante e opções de transporte
        </p>
      </div>

      <div className="form-section">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Informações do Aluno
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormInput
              label="Nome Completo do Aluno"
              placeholder="Digite o nome completo do aluno"
              value={data.aluno.nome}
              onChange={(e) => updateData('aluno', 'nome', e.target.value)}
              icon={<User className="w-4 h-4 text-primary" />}
              error={errors['aluno.nome']}
              required
            />
          </div>

          <FormInput
            label="Data de Nascimento"
            type="date"
            value={data.aluno.dataNascimento}
            onChange={(e) => updateData('aluno', 'dataNascimento', e.target.value)}
            icon={<Calendar className="w-4 h-4 text-primary" />}
            error={errors['aluno.dataNascimento']}
            required
          />

          <FormInput
            label="Série / Turma"
            placeholder="Ex: 5º Ano B"
            value={data.aluno.serieTurma}
            onChange={(e) => updateData('aluno', 'serieTurma', e.target.value)}
            icon={<GraduationCap className="w-4 h-4 text-primary" />}
            error={errors['aluno.serieTurma']}
            required
          />

          <div className="md:col-span-2">
            <FormInput
              label="Escola"
              placeholder="Nome completo da escola"
              value={data.aluno.escola}
              onChange={(e) => updateData('aluno', 'escola', e.target.value)}
              icon={<GraduationCap className="w-4 h-4 text-primary" />}
              error={errors['aluno.escola']}
              required
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="Endereço Residencial (Ponto de Embarque)"
              placeholder="Endereço completo onde o aluno será embarcado"
              value={data.aluno.enderecoResidencial}
              onChange={(e) => updateData('aluno', 'enderecoResidencial', e.target.value)}
              icon={<MapPin className="w-4 h-4 text-primary" />}
              error={errors['aluno.enderecoResidencial']}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bus className="w-5 h-5 text-primary" />
          Regime de Transporte
        </h3>
        
        <RadioGroup
          value={data.opcoes.regimeTransporte}
          onValueChange={(value) => updateData('opcoes', 'regimeTransporte', value)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Label
            htmlFor="ida-volta"
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.opcoes.regimeTransporte === 'ida-volta'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <RadioGroupItem value="ida-volta" id="ida-volta" />
            <div>
              <p className="font-medium">Ida e Volta</p>
              <p className="text-xs text-muted-foreground">Transporte completo</p>
            </div>
          </Label>

          <Label
            htmlFor="somente-ida"
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.opcoes.regimeTransporte === 'somente-ida'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <RadioGroupItem value="somente-ida" id="somente-ida" />
            <div>
              <p className="font-medium">Somente Ida</p>
              <p className="text-xs text-muted-foreground">Casa → Escola</p>
            </div>
          </Label>

          <Label
            htmlFor="somente-volta"
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.opcoes.regimeTransporte === 'somente-volta'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <RadioGroupItem value="somente-volta" id="somente-volta" />
            <div>
              <p className="font-medium">Somente Volta</p>
              <p className="text-xs text-muted-foreground">Escola → Casa</p>
            </div>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step2Aluno;
