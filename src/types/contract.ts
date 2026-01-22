export interface ContractData {
  // Contratado (Prestador do Serviço) - Fixed data
  contratado: {
    nome: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
  };
  
  // Contratante (Responsável pelo Aluno)
  contratante: {
    nome: string;
    cpf: string;
    endereco: string;
    telefone: string;
    email: string;
  };
  
  // Dados do Aluno
  aluno: {
    nome: string;
    dataNascimento: string;
    escola: string;
    serieTurma: string;
    enderecoResidencial: string;
  };
  
  // Opções do Contrato
  opcoes: {
    regimeTransporte: 'ida-volta' | 'somente-ida' | 'somente-volta';
    autorizacaoDesembarque: 'sim' | 'nao';
    pessoaResponsavelPresente: 'sempre' | 'eventualmente';
  };
  
  // Pagamento
  pagamento: {
    valorMensal: string;
    valorPorExtenso: string;
    formaPagamento: 'pix' | 'especie';
  };
  
  // Vigência
  vigencia: {
    anoLetivo: string;
    dataContrato: string;
  };
  
  // Assinaturas
  assinaturas: {
    contratado: string; // base64 da assinatura (fixed image)
    contratante: string; // base64 da assinatura
  };
  
  // Declaração de leitura
  declaracaoLeitura: boolean;
}

// Fixed contractor data
export const CONTRATADO_FIXO = {
  nome: 'Bairon Ezequiel Ferreira',
  cnpj: '34.729.304/0001-06',
  endereco: 'Rua das Castanheiras, 40, Serrano, Caxias do Sul - RS, 95059-110',
  telefone: '(54) 98438-6496',
  email: 'baironezequielferreira@gmail.com',
};

export const initialContractData: ContractData = {
  contratado: { ...CONTRATADO_FIXO },
  contratante: {
    nome: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: '',
  },
  aluno: {
    nome: '',
    dataNascimento: '',
    escola: '',
    serieTurma: '',
    enderecoResidencial: '',
  },
  opcoes: {
    regimeTransporte: 'ida-volta',
    autorizacaoDesembarque: 'nao',
    pessoaResponsavelPresente: 'sempre',
  },
  pagamento: {
    valorMensal: '',
    valorPorExtenso: '',
    formaPagamento: 'pix',
  },
  vigencia: {
    anoLetivo: new Date().getFullYear().toString(),
    dataContrato: '',
  },
  assinaturas: {
    contratado: '',
    contratante: '',
  },
  declaracaoLeitura: false,
};
