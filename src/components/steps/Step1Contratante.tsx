import { ContractData } from '@/types/contract';
import FormInput from '@/components/FormInput';
import { User, FileText, MapPin, Phone, Mail } from 'lucide-react';
import { formatCPF, formatPhone, validateCPF, validateEmail, validateName, validatePhone } from '@/utils/formatters';

interface Step1Props {
  data: ContractData;
  updateData: (section: keyof ContractData, field: string, value: string) => void;
  errors: Record<string, string>;
}

const Step1Contratante = ({ data, updateData, errors }: Step1Props) => {
  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    updateData('contratante', 'cpf', formatted);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    updateData('contratante', 'telefone', formatted);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary">
          Dados do Contratante
        </h2>
        <p className="text-muted-foreground mt-2">
          Informações do responsável pelo aluno
        </p>
      </div>

      <div className="form-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormInput
              label="Nome Completo"
              placeholder="Digite o nome completo"
              value={data.contratante.nome}
              onChange={(e) => updateData('contratante', 'nome', e.target.value)}
              icon={<User className="w-4 h-4 text-primary" />}
              error={errors['contratante.nome']}
              required
            />
          </div>

          <FormInput
            label="CPF"
            placeholder="000.000.000-00"
            value={data.contratante.cpf}
            onChange={(e) => handleCPFChange(e.target.value)}
            icon={<FileText className="w-4 h-4 text-primary" />}
            error={errors['contratante.cpf']}
            required
          />

          <FormInput
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={data.contratante.telefone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            icon={<Phone className="w-4 h-4 text-primary" />}
            error={errors['contratante.telefone']}
            required
          />

          <div className="md:col-span-2">
            <FormInput
              label="Endereço Completo"
              placeholder="Rua, número, bairro, cidade, estado"
              value={data.contratante.endereco}
              onChange={(e) => updateData('contratante', 'endereco', e.target.value)}
              icon={<MapPin className="w-4 h-4 text-primary" />}
              error={errors['contratante.endereco']}
              required
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="E-mail"
              type="email"
              placeholder="exemplo@email.com"
              value={data.contratante.email}
              onChange={(e) => updateData('contratante', 'email', e.target.value)}
              icon={<Mail className="w-4 h-4 text-primary" />}
              error={errors['contratante.email']}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Contratante;
