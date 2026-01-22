import jsPDF from 'jspdf';
import { ContractData } from '@/types/contract';
import { formatDate, formatDateLong } from './formatters';

const PAGE_MARGIN = 20;
const LINE_HEIGHT = 5;
const FONT_SIZE_NORMAL = 10;
const FONT_SIZE_SMALL = 8;

export const generateContractPDF = async (data: ContractData) => {
  const doc = new jsPDF();
  const page_width = doc.internal.pageSize.getWidth();
  let y = PAGE_MARGIN;

  const addText = (text: string, size = FONT_SIZE_NORMAL, isBold = false, align: 'left' | 'center' | 'right' = 'left', customY?: number) => {
    if (customY) y = customY;
    if (y > doc.internal.pageSize.getHeight() - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
    doc.setFontSize(size);
    doc.setFont(undefined, isBold ? 'bold' : 'normal');
    
    const options = { align };
    if (align === 'center') {
      doc.text(text, page_width / 2, y, options);
    } else if (align === 'right') {
      doc.text(text, page_width - PAGE_MARGIN, y, options);
    } else {
      doc.text(text, PAGE_MARGIN, y, options);
    }
    
    y += LINE_HEIGHT;
  };

  const addWrappedText = (text: string, size = FONT_SIZE_NORMAL, isBold = false) => {
    doc.setFontSize(size);
    doc.setFont(undefined, isBold ? 'bold' : 'normal');
    const splitText = doc.splitTextToSize(text, page_width - 2 * PAGE_MARGIN);
    splitText.forEach((line: string) => {
        addText(line);
    });
  };

  doc.setFont('helvetica', 'normal');

  addText('CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE ESCOLAR', 12, true, 'center');
  y += 5;

  // CONTRATADO
  addWrappedText(`CONTRATADO: ${data.contratado.nome}, CNPJ nº ${data.contratado.cnpj}, endereço ${data.contratado.endereco}, telefone ${data.contratado.telefone}, e-mail ${data.contratado.email}.`);
  y += 2;

  // CONTRATANTE
  addWrappedText(`CONTRATANTE: ${data.contratante.nome || '___________________________'}, CPF nº ${data.contratante.cpf || '_______________'}, endereço ${data.contratante.endereco || '______________________________________'}, telefone ${data.contratante.telefone || '_______________'}, e-mail ${data.contratante.email || '_______________'}.`);
  y += 5;

  addWrappedText('As partes acima identificadas celebram o presente Contrato de Prestação de Serviços de Transporte Escolar, que será regido pelas cláusulas a seguir.');
  y += 5;

  // Helper para cláusulas
  const addClause = (title: string, content: string[]) => {
    addText(title, 11, true);
    content.forEach(p => addWrappedText(p));
    y += 5;
  };

  // CLAUSES
  addClause('CLÁUSULA 1 – DO OBJETO', [
    `1.1. O presente contrato tem por objeto a prestação de serviços de transporte escolar do aluno: Nome do aluno: ${data.aluno.nome || '___________________________'}, Data de nascimento: ${formatDate(data.aluno.dataNascimento)}, Escola: ${data.aluno.escola || '___________________________'}, Série/Turma: ${data.aluno.serieTurma || '_______________'}.`,
    `1.2. O transporte será realizado entre o endereço residencial do aluno, situado à ${data.aluno.enderecoResidencial || '___________________________'}, e a escola acima indicada, bem como o trajeto de retorno, conforme regime contratado (${{
      'ida-volta': 'ida e volta',
      'somente-ida': 'somente ida',
      'somente-volta': 'somente volta'
    }[data.opcoes.regimeTransporte]}).`,
    '1.3. O serviço será prestado nos dias letivos, de acordo com o calendário escolar da instituição de ensino, nos horários aproximados de embarque e desembarque a serem informados pelo CONTRATADO ao CONTRATANTE.'
  ]);

  addClause('CLÁUSULA 2 – DO VEÍCULO E DO MOTORISTA', [
      '2.1. O transporte será realizado em veículo devidamente autorizado para transporte escolar pelo órgão de trânsito competente.',
      '2.2. O CONTRATADO declara que o veículo atende aos requisitos legais para transporte escolar, inclusive faixa identificadora, cintos de segurança em todos os assentos, equipamentos obrigatórios e vistorias em dia.',
      '2.3. O serviço será realizado por motorista devidamente habilitado na categoria exigida, com curso específico para transporte escolar e demais requisitos previstos na legislação de trânsito.',
      '2.4. O CONTRATADO poderá substituir o veículo ou o motorista, temporária ou definitivamente, desde que sejam mantidas as mesmas condições de segurança e regularidade, comunicando o CONTRATANTE sempre que possível.'
  ]);

  addClause('CLÁUSULA 3 – DAS OBRIGAÇÕES DO CONTRATADO', [
      '3.1. Cumprir os horários aproximados de embarque e desembarque informados, admitidas pequenas variações em razão de trânsito, condições climáticas, obras, acidentes ou outros fatores alheios à sua vontade, o que não caracterizará descumprimento contratual.',
      '3.2. Realizar embarque e desembarque em local que ofereça condições mínimas de segurança.',
      '3.3. Manter o veículo em boas condições de uso, conservação, limpeza e segurança, realizando revisões e manutenções periódicas.',
      '3.4. Exigir o uso do cinto de segurança e zelar pela disciplina dos alunos no interior do veículo, podendo adverti-los em caso de comportamentos inadequados.',
      '3.5. Manter vigentes os seguros obrigatórios e, se contratado, seguro de acidentes pessoais e/ou responsabilidade civil, informando ao CONTRATANTE os dados básicos da apólice quando solicitado.'
  ]);

  addClause('CLÁUSULA 4 – DAS OBRIGAÇÕES DO CONTRATANTE', [
      '4.1. Garantir que o aluno esteja pronto no ponto de embarque, no horário combinado, sob pena de o motorista não ser obrigado a aguardar por período superior a 8 (oito) minutos, podendo seguir o trajeto normalmente sem retorno específico para aquele aluno.',
      '4.2. Informar ao CONTRATADO, com antecedência mínima de 6 (seis) horas, sobre faltas previsíveis, viagens, mudanças de endereço ou telefone.',
      '4.3. Manter atualizados os dados de contato e de saúde do aluno, informando eventuais necessidades especiais, restrições ou condições relevantes para o transporte.',
      '4.4. Indicar a pessoa responsável pelo recebimento do aluno no endereço de desembarque, assumindo a responsabilidade a partir do momento em que o aluno é entregue nesse local.',
      '4.5. Assumir integralmente a responsabilidade pelos danos causados pelo aluno ao veículo, a seus equipamentos ou a terceiros, na forma da CLÁUSULA 10.'
  ]);

  // CLÁUSULA 5
  const clause5Content = [
    `5.1. O CONTRATANTE declara que, no endereço de desembarque: ${data.opcoes.pessoaResponsavelPresente === 'sempre' ? '(X) Haverá sempre pessoa responsável para receber o aluno' : '(X) Eventualmente não haverá pessoa responsável'}.`
  ];
  if (data.opcoes.pessoaResponsavelPresente === 'eventualmente') {
    const authText = data.opcoes.autorizacaoDesembarque === 'sim' 
      ? 'Neste caso, o CONTRATANTE AUTORIZA (X) que o aluno seja desembarcado e deixado no local indicado, sob sua exclusiva responsabilidade.'
      : 'Neste caso, o CONTRATANTE NÃO AUTORIZA (X) que o aluno seja desembarcado sem responsável.';
    clause5Content.push(authText);
  }
  clause5Content.push('5.2. Caso não haja pessoa responsável no endereço indicado e não haja autorização para deixar o aluno, o CONTRATADO poderá: a) retornar com o aluno à escola, ou b) adotar outra medida razoável para garantir sua segurança, sendo eventuais custos adicionais suportados pelo CONTRATANTE.');
  clause5Content.push('5.3. A partir do momento em que o aluno é desembarcado no endereço informado e, quando aplicável, entregue à pessoa responsável, encerra-se a responsabilidade do CONTRATADO.');
  addClause('CLÁUSULA 5 – DO RECEBIMENTO DO ALUNO', clause5Content);

  addClause('CLÁUSULA 6 – DO PREÇO E FORMA DE PAGAMENTO', [
    `6.1. Pelo serviço de transporte escolar, o CONTRATANTE pagará ao CONTRATADO o valor mensal integral de R$ ${data.pagamento.valorMensal || '_______'} (${data.pagamento.valorPorExtenso || '_______'}), por aluno, com vencimento todo dia 10 (dez) de cada mês.`,
    `6.2. O pagamento será efetuado mediante ${data.pagamento.formaPagamento === 'pix' ? 'PIX' : 'espécie'}, conforme combinado previamente entre as partes.`,
    '6.3. As mensalidades são devidas integralmente durante todo o período de vigência deste contrato. O valor do mês de fevereiro será calculado proporcionalmente aos dias letivos, correspondendo ao valor da mensalidade integral dividido por 21 (vinte e um) e multiplicado pelo número de dias de serviço efetivamente prestados naquele mês. Os demais meses, inclusive dezembro, serão cobrados integralmente.'
  ]);

  addClause('CLÁUSULA 7 – DO ATRASO NO PAGAMENTO', [
      '7.1. Em caso de atraso no pagamento de qualquer parcela, incidirá sobre o valor devido juros moratórios de 2% (dois por cento) ao dia, a partir do dia seguinte ao vencimento, até a data do efetivo pagamento.',
      '7.2. A partir do dia 15 (quinze) do mês em curso, caso o pagamento não tenha sido regularizado, será emitido boleto de cobrança com os acréscimos devidos e o serviço de transporte será suspenso até a efetiva quitação de todos os valores pendentes.'
  ]);

  addClause('CLÁUSULA 8 – DO REAJuste', [
    '8.1. O valor da mensalidade poderá ser reajustado anualmente, a cada 12 (doze) meses contados da assinatura deste contrato, com base na variação do índice IPCA (ou outro que venha a substituí-lo) acumulado no período, ou por percentual compatível com o aumento de custos do serviço.',
    '8.2. O CONTRATADO comunicará ao CONTRATANTE o novo valor com antecedência mínima de 30 (trinta) dias da data em que o reajuste passar a vigorar.'
  ]);

  addClause('CLÁUSULA 9 – DA VIGÊNCIA E RESCISÃO', [
    `9.1. O presente contrato vigorará a partir da data de sua assinatura até o último dia do ano letivo de ${data.vigencia.anoLetivo || '_____'}, conforme calendário escolar. O contrato se estenderá automaticamente, apenas para fins de regularização de débitos, até a quitação integral de quaisquer valores pendentes por parte do CONTRATANTE.`,
    '9.2. O CONTRATANTE poderá rescindir o contrato a qualquer tempo, mediante aviso prévio por escrito de 30 (trinta) dias.',
    '9.3. Caso o CONTRATANTE rescinda o contrato sem o aviso prévio mínimo de 30 (trinta) dias, ficará sujeito ao pagamento, a título de multa rescisória, do valor equivalente a 1 (uma) mensalidade vigente à época do cancelamento.',
    '9.4. O CONTRATADO poderá rescindir o contrato, mediante aviso prévio de 30 (trinta) dias, em caso de: a) inadimplência reiterada; b) descumprimento de obrigações contratuais pelo CONTRATANTE; c) comportamento incompatível do aluno ou de seus responsáveis que afete a segurança ou o bom andamento do serviço.',
    '9.5. Em situações graves que coloquem em risco a segurança, a integridade física ou moral de qualquer passageiro, ou em caso de ilícito grave, o CONTRATADO poderá rescindir o contrato de imediato, sem necessidade de aviso prévio, comunicando o fato ao CONTRATANTE.'
  ]);

  addClause('CLÁUSULA 10 – DOS DANOS CAUSADOS PELO ALUNO', [
    '10.1. Todo e qualquer dano causado pelo aluno ao veículo de transporte, a seus equipamentos ou a terceiros, decorrente de uso inadequado, mau comportamento ou ato voluntário, será de inteira responsabilidade do CONTRATANTE.',
    '10.2. O CONTRATANTE se obriga a ressarcir integralmente o valor do conserto ou substituição, mediante apresentação de orçamento e/ou nota fiscal, no prazo máximo de 8 (oito) dias após a comunicação pelo CONTRATADO.'
  ]);

  addClause('CLÁUSULA 11 – DA SEGURANÇA E RESPONSABILIDADE', [
    '11.1. O CONTRATADO compromete-se a observar as normas do Código de Trânsito Brasileiro, bem como as exigências específicas para transporte escolar.',
    '11.2. Em caso de acidente ou mal súbito com o aluno durante o transporte, o CONTRATADO adotará as providências necessárias, tais como acionar o serviço de emergência, prestar primeiros socorros dentro de suas limitações e comunicar imediatamente o CONTRATANTE.',
    '11.3. O CONTRATADO não será responsável por eventos decorrentes de caso fortuito ou força maior, desde que demonstrada a ausência de culpa e a adoção de todas as cautelas razoáveis.'
  ]);

  addClause('CLÁUSULA 12 – DA COMUNICAÇÃO', [
    '12.1. As comunicações entre as partes poderão ser feitas por escrito, por meio físico ou eletrônico, inclusive via aplicativo de mensagens (WhatsApp) ou telefone, valendo como prova de ciência e notificação.',
    '12.2. Mensagens enviadas aos contatos fornecidos pelo CONTRATANTE serão consideradas válidas, cabendo a este manter seus dados sempre atualizados.'
  ]);

  addClause('CLÁUSULA 13 – DA PROTEÇÃO DE DADOS', [
    '13.1. Os dados pessoais do aluno e do CONTRATANTE serão utilizados exclusivamente para execução deste contrato, comunicações relativas ao serviço e cumprimento de obrigações legais, observadas as disposições da legislação de proteção de dados aplicável.'
  ]);

  addClause('CLÁUSULA 14 – DO FORO', [
    '14.1. Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da Comarca de Caxias do Sul/RS, com renúncia a qualquer outro, por mais privilegiado que seja.'
  ]);
  
  y += 5;
  addText('E, por estarem justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma.', FONT_SIZE_NORMAL, false, 'center');
  y += 5;
  addText(`Cidade: Caxias do Sul, RS, ${formatDateLong(data.vigencia.dataContrato)}.`, FONT_SIZE_NORMAL, false, 'center');
  y += 20;

  const signatureX = (page_width / 2);
  const signatureWidth = 70; // Largura da assinatura
  const signatureHeight = 35; // Altura da assinatura
  const signatureYStart = y;

  // --- CORREÇÃO APLICADA AQUI ---
  // Adicionar a assinatura do CONTRATADO (imagem fixa)
  if (data.assinaturas.contratado) {
    doc.addImage(data.assinaturas.contratado, 'JPEG', signatureX - (signatureWidth / 2), signatureYStart, signatureWidth, signatureHeight);
    doc.text('_________________________', signatureX, signatureYStart + signatureHeight + 5, { align: 'center' });
    doc.text(data.contratado.nome, signatureX, signatureYStart + signatureHeight + 10, { align: 'center' });
    doc.text(`CNPJ: ${data.contratado.cnpj}`, signatureX, signatureYStart + signatureHeight + 15, { align: 'center' });
  }
  
  y = signatureYStart + signatureHeight + 30;

  // Adicionar a assinatura do CONTRATANTE (desenhada na tela)
  if (data.assinaturas.contratante) {
    doc.addImage(data.assinaturas.contratante, 'PNG', signatureX - (signatureWidth / 2), y, signatureWidth, signatureHeight);
    doc.text('_________________________', signatureX, y + signatureHeight + 5, { align: 'center' });
    doc.text(data.contratante.nome, signatureX, y + signatureHeight + 10, { align: 'center' });
    doc.text(`CPF: ${data.contratante.cpf}`, signatureX, y + signatureHeight + 15, { align: 'center' });
  }

  doc.save(`Contrato-${data.contratante.nome.replace(/ /g, '_')}.pdf`);
};
