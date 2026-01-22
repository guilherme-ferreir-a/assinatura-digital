import { ContractData } from '@/types/contract';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertCircle } from 'lucide-react';

interface Step4Props {
  data: ContractData;
  updateData: (section: keyof ContractData, field: string, value: string | boolean) => void;
  errors: Record<string, string>;
}

const Step4Preview = ({ data, updateData, errors }: Step4Props) => {
  const regimeMap = {
    'ida-volta': 'ida e volta',
    'somente-ida': 'somente ida',
    'somente-volta': 'somente volta'
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '__/__/____';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatDateLong = (dateStr: string) => {
    if (!dateStr) return '____ de __________________ de ________';
    return new Date(dateStr).toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary">
          Prévia do Contrato
        </h2>
        <p className="text-muted-foreground mt-2">
          Leia atentamente todas as cláusulas antes de assinar
        </p>
      </div>

      <ScrollArea className="h-[500px] rounded-lg border border-border bg-card p-6">
        <div className="space-y-6 text-sm leading-relaxed">
          <h3 className="text-lg font-bold text-center text-foreground">
            CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE ESCOLAR
          </h3>

          <div className="space-y-2">
            <p><strong>CONTRATADO:</strong> {data.contratado.nome},</p>
            <p>CNPJ nº {data.contratado.cnpj},</p>
            <p>endereço {data.contratado.endereco},</p>
            <p>telefone {data.contratado.telefone}, e-mail {data.contratado.email}.</p>
          </div>

          <div className="space-y-2">
            <p><strong>CONTRATANTE:</strong> {data.contratante.nome || '___________________________'},</p>
            <p>CPF nº {data.contratante.cpf || '_______________'},</p>
            <p>endereço {data.contratante.endereco || '______________________________________'},</p>
            <p>telefone {data.contratante.telefone || '_______________'}, e-mail {data.contratante.email || '_______________'}.</p>
          </div>

          <p>As partes acima identificadas celebram o presente Contrato de Prestação de Serviços de Transporte Escolar, que será regido pelas cláusulas a seguir.</p>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 1 – DO OBJETO</h4>
            <p>1.1. O presente contrato tem por objeto a prestação de serviços de transporte escolar do aluno:</p>
            <p>Nome do aluno: {data.aluno.nome || '___________________________'}</p>
            <p>Data de nascimento: {formatDate(data.aluno.dataNascimento)}</p>
            <p>Escola: {data.aluno.escola || '___________________________'}</p>
            <p>Série/Turma: {data.aluno.serieTurma || '_______________'}</p>
            <p>1.2. O transporte será realizado entre o endereço residencial do aluno, situado à {data.aluno.enderecoResidencial || '___________________________'}, e a escola acima indicada, bem como o trajeto de retorno, conforme regime contratado ({regimeMap[data.opcoes.regimeTransporte]}).</p>
            <p>1.3. O serviço será prestado nos dias letivos, de acordo com o calendário escolar da instituição de ensino, nos horários aproximados de embarque e desembarque a serem informados pelo CONTRATADO ao CONTRATANTE.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 2 – DO VEÍCULO E DO MOTORISTA</h4>
            <p>2.1. O transporte será realizado em veículo devidamente autorizado para transporte escolar pelo órgão de trânsito competente.</p>
            <p>2.2. O CONTRATADO declara que o veículo atende aos requisitos legais para transporte escolar, inclusive faixa identificadora, cintos de segurança em todos os assentos, equipamentos obrigatórios e vistorias em dia.</p>
            <p>2.3. O serviço será realizado por motorista devidamente habilitado na categoria exigida, com curso específico para transporte escolar e demais requisitos previstos na legislação de trânsito.</p>
            <p>2.4. O CONTRATADO poderá substituir o veículo ou o motorista, temporária ou definitivamente, desde que sejam mantidas as mesmas condições de segurança e regularidade, comunicando o CONTRATANTE sempre que possível.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 3 – DAS OBRIGAÇÕES DO CONTRATADO</h4>
            <p>3.1. Cumprir os horários aproximados de embarque e desembarque informados, admitidas pequenas variações em razão de trânsito, condições climáticas, obras, acidentes ou outros fatores alheios à sua vontade, o que não caracterizará descumprimento contratual.</p>
            <p>3.2. Realizar embarque e desembarque em local que ofereça condições mínimas de segurança.</p>
            <p>3.3. Manter o veículo em boas condições de uso, conservação, limpeza e segurança, realizando revisões e manutenções periódicas.</p>
            <p>3.4. Exigir o uso do cinto de segurança e zelar pela disciplina dos alunos no interior do veículo, podendo adverti-los em caso de comportamentos inadequados.</p>
            <p>3.5. Manter vigentes os seguros obrigatórios e, se contratado, seguro de acidentes pessoais e/ou responsabilidade civil, informando ao CONTRATANTE os dados básicos da apólice quando solicitado.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 4 – DAS OBRIGAÇÕES DO CONTRATANTE</h4>
            <p>4.1. Garantir que o aluno esteja pronto no ponto de embarque, no horário combinado, sob pena de o motorista não ser obrigado a aguardar por período superior a 8 (oito) minutos, podendo seguir o trajeto normalmente sem retorno específico para aquele aluno.</p>
            <p>4.2. Informar ao CONTRATADO, com antecedência mínima de 6 (seis) horas, sobre faltas previsíveis, viagens, mudanças de endereço ou telefone.</p>
            <p>4.3. Manter atualizados os dados de contato e de saúde do aluno, informando eventuais necessidades especiais, restrições ou condições relevantes para o transporte.</p>
            <p>4.4. Indicar a pessoa responsável pelo recebimento do aluno no endereço de desembarque, assumindo a responsabilidade a partir do momento em que o aluno é entregue nesse local.</p>
            <p>4.5. Assumir integralmente a responsabilidade pelos danos causados pelo aluno ao veículo, a seus equipamentos ou a terceiros, na forma da CLÁUSULA 10.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 5 – DO RECEBIMENTO DO ALUNO</h4>
            <p>5.1. O CONTRATANTE declara que, no endereço de desembarque: {data.opcoes.pessoaResponsavelPresente === 'sempre' ? '(X) Haverá sempre pessoa responsável para receber o aluno' : '(X) Eventualmente não haverá pessoa responsável'}.</p>
            {data.opcoes.pessoaResponsavelPresente === 'eventualmente' && (
              <p>{data.opcoes.autorizacaoDesembarque === 'sim' 
                ? 'Neste caso, o CONTRATANTE AUTORIZA (X) que o aluno seja desembarcado e deixado no local indicado, sob sua exclusiva responsabilidade.'
                : 'Neste caso, o CONTRATANTE NÃO AUTORIZA (X) que o aluno seja desembarcado sem responsável.'}</p>
            )}
            <p>5.2. Caso não haja pessoa responsável no endereço indicado e não haja autorização para deixar o aluno, o CONTRATADO poderá: a) retornar com o aluno à escola, ou b) adotar outra medida razoável para garantir sua segurança, sendo eventuais custos adicionais suportados pelo CONTRATANTE.</p>
            <p>5.3. A partir do momento em que o aluno é desembarcado no endereço informado e, quando aplicável, entregue à pessoa responsável, encerra-se a responsabilidade do CONTRATADO.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 6 – DO PREÇO E FORMA DE PAGAMENTO</h4>
            <p>6.1. Pelo serviço de transporte escolar, o CONTRATANTE pagará ao CONTRATADO o valor mensal integral de R$ {data.pagamento.valorMensal || '_______'} ({data.pagamento.valorPorExtenso || '_______'}), por aluno, com vencimento todo dia 10 (dez) de cada mês.</p>
            <p>6.2. O pagamento será efetuado mediante {data.pagamento.formaPagamento === 'pix' ? 'PIX' : 'espécie'}, conforme combinado previamente entre as partes.</p>
            <p>6.3. As mensalidades são devidas integralmente durante todo o período de vigência deste contrato. O valor do mês de fevereiro será calculado proporcionalmente aos dias letivos, correspondendo ao valor da mensalidade integral dividido por 21 (vinte e um) e multiplicado pelo número de dias de serviço efetivamente prestados naquele mês. Os demais meses, inclusive dezembro, serão cobrados integralmente.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 7 – DO ATRASO NO PAGAMENTO</h4>
            <p>7.1. Em caso de atraso no pagamento de qualquer parcela, incidirá sobre o valor devido juros moratórios de 2% (dois por cento) ao dia, a partir do dia seguinte ao vencimento, até a data do efetivo pagamento.</p>
            <p>7.2. A partir do dia 15 (quinze) do mês em curso, caso o pagamento não tenha sido regularizado, será emitido boleto de cobrança com os acréscimos devidos e o serviço de transporte será suspenso até a efetiva quitação de todos os valores pendentes.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 8 – DO REAJUSTE</h4>
            <p>8.1. O valor da mensalidade poderá ser reajustado anualmente, a cada 12 (doze) meses contados da assinatura deste contrato, com base na variação do índice IPCA (ou outro que venha a substituí-lo) acumulado no período, ou por percentual compatível com o aumento de custos do serviço.</p>
            <p>8.2. O CONTRATADO comunicará ao CONTRATANTE o novo valor com antecedência mínima de 30 (trinta) dias da data em que o reajuste passar a vigorar.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 9 – DA VIGÊNCIA E RESCISÃO</h4>
            <p>9.1. O presente contrato vigorará a partir da data de sua assinatura até o último dia do ano letivo de {data.vigencia.anoLetivo || '_____'}, conforme calendário escolar. O contrato se estenderá automaticamente, apenas para fins de regularização de débitos, até a quitação integral de quaisquer valores pendentes por parte do CONTRATANTE.</p>
            <p>9.2. O CONTRATANTE poderá rescindir o contrato a qualquer tempo, mediante aviso prévio por escrito de 30 (trinta) dias.</p>
            <p>9.3. Caso o CONTRATANTE rescinda o contrato sem o aviso prévio mínimo de 30 (trinta) dias, ficará sujeito ao pagamento, a título de multa rescisória, do valor equivalente a 1 (uma) mensalidade vigente à época do cancelamento.</p>
            <p>9.4. O CONTRATADO poderá rescindir o contrato, mediante aviso prévio de 30 (trinta) dias, em caso de: a) inadimplência reiterada; b) descumprimento de obrigações contratuais pelo CONTRATANTE; c) comportamento incompatível do aluno ou de seus responsáveis que afete a segurança ou o bom andamento do serviço.</p>
            <p>9.5. Em situações graves que coloquem em risco a segurança, a integridade física ou moral de qualquer passageiro, ou em caso de ilícito grave, o CONTRATADO poderá rescindir o contrato de imediato, sem necessidade de aviso prévio, comunicando o fato ao CONTRATANTE.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 10 – DOS DANOS CAUSADOS PELO ALUNO</h4>
            <p>10.1. Todo e qualquer dano causado pelo aluno ao veículo de transporte, a seus equipamentos ou a terceiros, decorrente de uso inadequado, mau comportamento ou ato voluntário, será de inteira responsabilidade do CONTRATANTE.</p>
            <p>10.2. O CONTRATANTE se obriga a ressarcir integralmente o valor do conserto ou substituição, mediante apresentação de orçamento e/ou nota fiscal, no prazo máximo de 8 (oito) dias após a comunicação pelo CONTRATADO.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 11 – DA SEGURANÇA E RESPONSABILIDADE</h4>
            <p>11.1. O CONTRATADO compromete-se a observar as normas do Código de Trânsito Brasileiro, bem como as exigências específicas para transporte escolar.</p>
            <p>11.2. Em caso de acidente ou mal súbito com o aluno durante o transporte, o CONTRATADO adotará as providências necessárias, tais como acionar o serviço de emergência, prestar primeiros socorros dentro de suas limitações e comunicar imediatamente o CONTRATANTE.</p>
            <p>11.3. O CONTRATADO não será responsável por eventos decorrentes de caso fortuito ou força maior, desde que demonstrada a ausência de culpa e a adoção de todas as cautelas razoáveis.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 12 – DA COMUNICAÇÃO</h4>
            <p>12.1. As comunicações entre as partes poderão ser feitas por escrito, por meio físico ou eletrônico, inclusive via aplicativo de mensagens (WhatsApp) ou telefone, valendo como prova de ciência e notificação.</p>
            <p>12.2. Mensagens enviadas aos contatos fornecidos pelo CONTRATANTE serão consideradas válidas, cabendo a este manter seus dados sempre atualizados.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 13 – DA PROTEÇÃO DE DADOS</h4>
            <p>13.1. Os dados pessoais do aluno e do CONTRATANTE serão utilizados exclusivamente para execução deste contrato, comunicações relativas ao serviço e cumprimento de obrigações legais, observadas as disposições da legislação de proteção de dados aplicável.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold">CLÁUSULA 14 – DO FORO</h4>
            <p>14.1. Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da Comarca de Caxias do Sul/RS, com renúncia a qualquer outro, por mais privilegiado que seja.</p>
          </div>

          <p className="text-center mt-8">
            E, por estarem justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma.
          </p>

          <p className="text-center">
            Cidade: Caxias do Sul, RS, {formatDateLong(data.vigencia.dataContrato)}.
          </p>
        </div>
      </ScrollArea>

      <div className="form-section">
        <div className="flex items-start gap-3 p-4 bg-muted rounded-lg border-2 border-border">
          <Checkbox
            id="declaracao"
            checked={data.declaracaoLeitura}
            onCheckedChange={(checked) => updateData('declaracaoLeitura' as keyof ContractData, 'value', checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label 
              htmlFor="declaracao" 
              className="text-sm font-medium cursor-pointer leading-relaxed"
            >
              Declaro que li e compreendi todas as cláusulas deste contrato de prestação de serviços de transporte escolar, e concordo integralmente com seus termos e condições.
            </Label>
          </div>
        </div>
        
        {errors['declaracaoLeitura'] && (
          <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors['declaracaoLeitura']}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4Preview;
