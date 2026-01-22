import { jsPDF } from 'jspdf';
import { ContractData } from '@/types/contract';
import assinaturaContratado from '@/assets/assinatura-contratado.jpeg';

// Convert image URL to base64
const getImageBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateContractPDF = async (data: ContractData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, align: 'left' | 'center' | 'justify' = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, contentWidth);
    
    if (y + lines.length * (fontSize * 0.4) > 270) {
      doc.addPage();
      y = 20;
    }
    
    if (align === 'center') {
      lines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += fontSize * 0.4;
      });
    } else {
      doc.text(lines, margin, y, { align: align as 'left' | 'justify' });
      y += lines.length * (fontSize * 0.4);
    }
    
    y += 2;
  };

  const addSignature = (label: string, name: string, signature: string | undefined) => {
    if (y + 40 > 270) {
      doc.addPage();
      y = 20;
    }
    
    y += 5;
    doc.setDrawColor(0);
    doc.line(margin, y + 25, margin + 80, y + 25);
    
    if (signature) {
      try {
        doc.addImage(signature, 'PNG', margin, y, 80, 25);
      } catch (e) {
        console.log('Error adding signature image');
      }
    }
    
    y += 28;
    addText(label, 10, true);
    if (name) {
      addText(name, 9);
    }
    y += 5;
  };

  // Title
  addText('CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE ESCOLAR', 14, true, 'center');
  y += 10;

  // Contratado
  addText('CONTRATADO: ' + data.contratado.nome, 10, true);
  addText(`CNPJ nº ${data.contratado.cnpj},`);
  addText(`endereço ${data.contratado.endereco},`);
  addText(`telefone ${data.contratado.telefone}, e-mail ${data.contratado.email}.`);
  y += 5;

  // Contratante
  addText('CONTRATANTE: ' + (data.contratante.nome || '___________________________'), 10, true);
  addText(`CPF nº ${data.contratante.cpf || '_______________'},`);
  addText(`endereço ${data.contratante.endereco || '______________________________________'},`);
  addText(`telefone ${data.contratante.telefone || '_______________'}, e-mail ${data.contratante.email || '_______________'}.`);
  y += 5;

  addText('As partes acima identificadas celebram o presente Contrato de Prestação de Serviços de Transporte Escolar, que será regido pelas cláusulas a seguir.');
  y += 5;

  // CLÁUSULA 1
  addText('CLÁUSULA 1 – DO OBJETO', 11, true);
  addText('1.1. O presente contrato tem por objeto a prestação de serviços de transporte escolar do aluno:');
  addText(`Nome do aluno: ${data.aluno.nome || '___________________________'}`);
  addText(`Data de nascimento: ${data.aluno.dataNascimento ? new Date(data.aluno.dataNascimento).toLocaleDateString('pt-BR') : '__/__/____'}`);
  addText(`Escola: ${data.aluno.escola || '___________________________'}`);
  addText(`Série/Turma: ${data.aluno.serieTurma || '_______________'}`);
  y += 3;

  const regimeMap = {
    'ida-volta': 'ida e volta',
    'somente-ida': 'somente ida',
    'somente-volta': 'somente volta'
  };
  
  addText(`1.2. O transporte será realizado entre o endereço residencial do aluno, situado à ${data.aluno.enderecoResidencial || '___________________________'}, e a escola acima indicada, bem como o trajeto de retorno, conforme regime contratado (${regimeMap[data.opcoes.regimeTransporte]}).`);
  y += 3;

  addText('1.3. O serviço será prestado nos dias letivos, de acordo com o calendário escolar da instituição de ensino, nos horários aproximados de embarque e desembarque a serem informados pelo CONTRATADO ao CONTRATANTE.');
  y += 5;

  // CLÁUSULA 2
  addText('CLÁUSULA 2 – DO VEÍCULO E DO MOTORISTA', 11, true);
  addText('2.1. O transporte será realizado em veículo devidamente autorizado para transporte escolar pelo órgão de trânsito competente.');
  addText('2.2. O CONTRATADO declara que o veículo atende aos requisitos legais para transporte escolar, inclusive faixa identificadora, cintos de segurança em todos os assentos, equipamentos obrigatórios e vistorias em dia.');
  addText('2.3. O serviço será realizado por motorista devidamente habilitado na categoria exigida, com curso específico para transporte escolar e demais requisitos previstos na legislação de trânsito.');
  addText('2.4. O CONTRATADO poderá substituir o veículo ou o motorista, temporária ou definitivamente, desde que sejam mantidas as mesmas condições de segurança e regularidade, comunicando o CONTRATANTE sempre que possível.');
  y += 5;

  // CLÁUSULA 3
  addText('CLÁUSULA 3 – DAS OBRIGAÇÕES DO CONTRATADO', 11, true);
  addText('3.1. Cumprir os horários aproximados de embarque e desembarque informados, admitidas pequenas variações em razão de trânsito, condições climáticas, obras, acidentes ou outros fatores alheios à sua vontade, o que não caracterizará descumprimento contratual.');
  addText('3.2. Realizar embarque e desembarque em local que ofereça condições mínimas de segurança.');
  addText('3.3. Manter o veículo em boas condições de uso, conservação, limpeza e segurança, realizando revisões e manutenções periódicas.');
  addText('3.4. Exigir o uso do cinto de segurança e zelar pela disciplina dos alunos no interior do veículo, podendo adverti-los em caso de comportamentos inadequados.');
  addText('3.5. Manter vigentes os seguros obrigatórios e, se contratado, seguro de acidentes pessoais e/ou responsabilidade civil, informando ao CONTRATANTE os dados básicos da apólice quando solicitado.');
  y += 5;

  // CLÁUSULA 4
  addText('CLÁUSULA 4 – DAS OBRIGAÇÕES DO CONTRATANTE', 11, true);
  addText('4.1. Garantir que o aluno esteja pronto no ponto de embarque, no horário combinado, sob pena de o motorista não ser obrigado a aguardar por período superior a 8 (oito) minutos, podendo seguir o trajeto normalmente sem retorno específico para aquele aluno.');
  addText('4.2. Informar ao CONTRATADO, com antecedência mínima de 6 (seis) horas, sobre faltas previsíveis, viagens, mudanças de endereço ou telefone.');
  addText('4.3. Manter atualizados os dados de contato e de saúde do aluno, informando eventuais necessidades especiais, restrições ou condições relevantes para o transporte.');
  addText('4.4. Indicar a pessoa responsável pelo recebimento do aluno no endereço de desembarque, assumindo a responsabilidade a partir do momento em que o aluno é entregue nesse local.');
  addText('4.5. Assumir integralmente a responsabilidade pelos danos causados pelo aluno ao veículo, a seus equipamentos ou a terceiros, na forma da CLÁUSULA 10.');
  y += 5;

  // CLÁUSULA 5
  addText('CLÁUSULA 5 – DO RECEBIMENTO DO ALUNO', 11, true);
  const presenteText = data.opcoes.pessoaResponsavelPresente === 'sempre' 
    ? '(X) Haverá sempre pessoa responsável para receber o aluno' 
    : '(X) Eventualmente não haverá pessoa responsável';
  addText(`5.1. O CONTRATANTE declara que, no endereço de desembarque: ${presenteText}.`);
  
  if (data.opcoes.pessoaResponsavelPresente === 'eventualmente') {
    const authText = data.opcoes.autorizacaoDesembarque === 'sim' 
      ? 'Neste caso, o CONTRATANTE AUTORIZA (X) que o aluno seja desembarcado e deixado no local indicado, sob sua exclusiva responsabilidade.'
      : 'Neste caso, o CONTRATANTE NÃO AUTORIZA (X) que o aluno seja desembarcado sem responsável.';
    addText(authText);
  }
  
  addText('5.2. Caso não haja pessoa responsável no endereço indicado e não haja autorização para deixar o aluno, o CONTRATADO poderá: a) retornar com o aluno à escola, ou b) adotar outra medida razoável para garantir sua segurança, sendo eventuais custos adicionais suportados pelo CONTRATANTE.');
  addText('5.3. A partir do momento em que o aluno é desembarcado no endereço informado e, quando aplicável, entregue à pessoa responsável, encerra-se a responsabilidade do CONTRATADO.');
  y += 5;

  // CLÁUSULA 6
  addText('CLÁUSULA 6 – DO PREÇO E FORMA DE PAGAMENTO', 11, true);
  addText(`6.1. Pelo serviço de transporte escolar, o CONTRATANTE pagará ao CONTRATADO o valor mensal integral de R$ ${data.pagamento.valorMensal || '_______'} (${data.pagamento.valorPorExtenso || '_______'}), por aluno, com vencimento todo dia 10 (dez) de cada mês.`);
  addText(`6.2. O pagamento será efetuado mediante ${data.pagamento.formaPagamento === 'pix' ? 'PIX' : 'espécie'}, conforme combinado previamente entre as partes.`);
  addText('6.3. As mensalidades são devidas integralmente durante todo o período de vigência deste contrato. O valor do mês de fevereiro será calculado proporcionalmente aos dias letivos.');
  y += 5;

  // CLÁUSULA 7
  addText('CLÁUSULA 7 – DO ATRASO NO PAGAMENTO', 11, true);
  addText('7.1. Em caso de atraso no pagamento de qualquer parcela, incidirá sobre o valor devido juros moratórios de 2% (dois por cento) ao dia, a partir do dia seguinte ao vencimento, até a data do efetivo pagamento.');
  addText('7.2. A partir do dia 15 (quinze) do mês em curso, caso o pagamento não tenha sido regularizado, será emitido boleto de cobrança com os acréscimos devidos e o serviço de transporte será suspenso até a efetiva quitação.');
  y += 5;

  // CLÁUSULA 8
  addText('CLÁUSULA 8 – DO REAJUSTE', 11, true);
  addText('8.1. O valor da mensalidade poderá ser reajustado anualmente, a cada 12 (doze) meses contados da assinatura deste contrato, com base na variação do índice IPCA acumulado no período.');
  addText('8.2. O CONTRATADO comunicará ao CONTRATANTE o novo valor com antecedência mínima de 30 (trinta) dias.');
  y += 5;

  // CLÁUSULA 9
  addText('CLÁUSULA 9 – DA VIGÊNCIA E RESCISÃO', 11, true);
  addText(`9.1. O presente contrato vigorará a partir da data de sua assinatura até o último dia do ano letivo de ${data.vigencia.anoLetivo || '_____'}, conforme calendário escolar.`);
  addText('9.2. O CONTRATANTE poderá rescindir o contrato a qualquer tempo, mediante aviso prévio por escrito de 30 (trinta) dias.');
  addText('9.3. Caso o CONTRATANTE rescinda o contrato sem o aviso prévio mínimo de 30 dias, ficará sujeito ao pagamento de multa rescisória equivalente a 1 (uma) mensalidade.');
  addText('9.4. O CONTRATADO poderá rescindir o contrato, mediante aviso prévio de 30 dias, em caso de inadimplência reiterada ou comportamento incompatível.');
  y += 5;

  // CLÁUSULA 10
  addText('CLÁUSULA 10 – DOS DANOS CAUSADOS PELO ALUNO', 11, true);
  addText('10.1. Todo e qualquer dano causado pelo aluno ao veículo de transporte, a seus equipamentos ou a terceiros será de inteira responsabilidade do CONTRATANTE.');
  addText('10.2. O CONTRATANTE se obriga a ressarcir integralmente o valor do conserto ou substituição, no prazo máximo de 8 (oito) dias após a comunicação.');
  y += 5;

  // CLÁUSULA 11
  addText('CLÁUSULA 11 – DA SEGURANÇA E RESPONSABILIDADE', 11, true);
  addText('11.1. O CONTRATADO compromete-se a observar as normas do Código de Trânsito Brasileiro.');
  addText('11.2. Em caso de acidente ou mal súbito com o aluno durante o transporte, o CONTRATADO adotará as providências necessárias.');
  y += 5;

  // CLÁUSULA 12-14
  addText('CLÁUSULA 12 – DA COMUNICAÇÃO', 11, true);
  addText('12.1. As comunicações entre as partes poderão ser feitas por escrito, por meio físico ou eletrônico, inclusive via aplicativo de mensagens (WhatsApp) ou telefone.');
  y += 3;

  addText('CLÁUSULA 13 – DA PROTEÇÃO DE DADOS', 11, true);
  addText('13.1. Os dados pessoais serão utilizados exclusivamente para execução deste contrato, observadas as disposições da LGPD.');
  y += 3;

  addText('CLÁUSULA 14 – DO FORO', 11, true);
  addText('14.1. Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da Comarca de Caxias do Sul/RS.');
  y += 8;

  // Data
  const contractDate = data.vigencia.dataContrato 
    ? new Date(data.vigencia.dataContrato).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '____ de __________________ de ________';
  addText(`Caxias do Sul, RS, ${contractDate}.`, 10, false, 'center');
  y += 15;

  // Assinaturas
  doc.addPage();
  y = 30;
  
  addText('ASSINATURAS', 14, true, 'center');
  y += 15;

  // Get contratado signature as base64
  try {
    const contratadoSigBase64 = await getImageBase64(assinaturaContratado);
    addSignature('CONTRATADO', data.contratado.nome, contratadoSigBase64);
  } catch (e) {
    addSignature('CONTRATADO', data.contratado.nome, undefined);
  }
  
  y += 10;
  
  addSignature('CONTRATANTE', data.contratante.nome, data.assinaturas.contratante);

  // Save the PDF
  const fileName = `Contrato_Transporte_Escolar_${data.aluno.nome?.replace(/\s+/g, '_') || 'Aluno'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
