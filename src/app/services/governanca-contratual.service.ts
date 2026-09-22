import { Injectable } from '@angular/core';
import {
  ContratoGovernanca,
  DocumentoGovernanca,
  FiltroAuditoria,
  RegistroAuditoria,
  ResumoGovernanca,
} from '../models/governanca-contratual';

@Injectable({ providedIn: 'root', useFactory: () => new MockDocumentStorageService() })
export abstract class DocumentStorageService {
  abstract upload(file: File): Promise<string>;
  abstract download(reference: string): Promise<Blob>;
}

@Injectable({ providedIn: 'root' })
export class MockDocumentStorageService implements DocumentStorageService {
  async upload(file: File): Promise<string> {
    return `mock://documentos/${Date.now()}-${encodeURIComponent(file.name)}`;
  }

  async download(reference: string): Promise<Blob> {
    return new Blob([`Documento demonstrativo armazenado em ${reference}`], { type: 'text/plain' });
  }
}

@Injectable({ providedIn: 'root' })
export class GovernancaContratualService {
  readonly isMock = true;
  private readonly contratosKey = 'converge-governanca-contratos';
  private readonly auditoriaKey = 'converge-governanca-auditoria';

  constructor(private storage: DocumentStorageService) {}

  listarContratos(): ContratoGovernanca[] {
    return this.read(this.contratosKey, CONTRATOS_MOCK);
  }

  obterContrato(id: number): ContratoGovernanca | undefined {
    return this.listarContratos().find(contrato => contrato.id === id);
  }

  listarDocumentos(contratoId?: number): DocumentoGovernanca[] {
    const documentos = this.listarContratos().reduce<DocumentoGovernanca[]>(
      (itens, contrato) => itens.concat(contrato.documentos),
      []
    );
    return contratoId ? documentos.filter(documento => documento.contratoId === contratoId) : documentos;
  }

  async adicionarDocumento(contratoId: number, file: File, categoria: DocumentoGovernanca['categoria'], usuario: string): Promise<DocumentoGovernanca> {
    const contratos = this.listarContratos();
    const contrato = contratos.find(item => item.id === contratoId);
    if (!contrato) throw new Error('Contrato não encontrado.');

    const storageReference = await this.storage.upload(file);
    const versoes = contrato.documentos.filter(documento => documento.nome === file.name);
    const documento: DocumentoGovernanca = {
      id: Date.now(),
      contratoId,
      nome: file.name,
      categoria,
      versao: Math.max(0, ...versoes.map(item => item.versao)) + 1,
      tamanho: this.formatarTamanho(file.size),
      responsavel: usuario || 'Usuário demonstrativo',
      enviadoEm: new Date().toISOString(),
      confidencial: false,
      storageReference,
    };
    contrato.documentos.unshift(documento);
    this.write(this.contratosKey, contratos);
    this.registrarAuditoria({
      id: Date.now() + 1,
      dataHora: new Date().toISOString(),
      usuario: documento.responsavel,
      acao: 'Upload',
      modulo: 'Documentos',
      contratoId,
      contratoNumero: contrato.numero,
      documentoId: documento.id,
      valorNovo: `${documento.nome} (v${documento.versao})`,
      descricao: `adicionou o documento ${documento.nome} ao contrato ${contrato.numero}`,
    });
    return documento;
  }

  listarAuditoria(filtro: FiltroAuditoria = {}): RegistroAuditoria[] {
    return this.read(this.auditoriaKey, AUDITORIA_MOCK)
      .filter(item => !filtro.inicio || item.dataHora.slice(0, 10) >= filtro.inicio)
      .filter(item => !filtro.fim || item.dataHora.slice(0, 10) <= filtro.fim)
      .filter(item => !filtro.usuario || item.usuario === filtro.usuario)
      .filter(item => !filtro.contrato || item.contratoNumero === filtro.contrato)
      .filter(item => !filtro.acao || item.acao === filtro.acao)
      .filter(item => !filtro.modulo || item.modulo === filtro.modulo)
      .sort((a, b) => b.dataHora.localeCompare(a.dataHora));
  }

  obterResumo(): ResumoGovernanca {
    const hoje = new Date('2026-09-11T12:00:00');
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 90);
    const contratos = this.listarContratos();
    const ativos = contratos.filter(item => item.status !== 'Encerrado');
    return {
      contratosAtivos: ativos.length,
      valorContratado: contratos.reduce((total, item) => total + item.valorContratado, 0),
      valorExecutado: contratos.reduce((total, item) => total + item.valorExecutado, 0),
      valorPago: contratos.reduce((total, item) => total + item.valorPago, 0),
      saldo: contratos.reduce((total, item) => total + item.valorContratado - item.valorExecutado, 0),
      proximosVencimento: ativos.filter(item => new Date(item.termino) >= hoje && new Date(item.termino) <= limite).length,
      vencidos: ativos.filter(item => new Date(item.termino) < hoje).length,
      comPendencias: contratos.filter(item => item.pendencias.some(pendencia => pendencia.status !== 'Concluída')).length,
      processosSei: contratos.filter(item => !!item.processoSei).length,
      documentosPendentes: contratos.reduce((total, item) => total + item.pendencias.filter(pendencia => pendencia.titulo.toLowerCase().includes('document')).length, 0),
    };
  }

  private registrarAuditoria(registro: RegistroAuditoria): void {
    this.write(this.auditoriaKey, [registro, ...this.read(this.auditoriaKey, AUDITORIA_MOCK)]);
  }

  private read<T>(key: string, fallback: T[]): T[] {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback.map(item => ({ ...item }));
  }

  private write(key: string, value: unknown[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private formatarTamanho(bytes: number): string {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}

const CONTRATOS_MOCK: ContratoGovernanca[] = [
  {
    id: 148,
    numero: 'CT-2026/0148',
    processoSei: '00040-00018472/2026-11',
    orgao: 'Secretaria de Administração',
    unidade: 'Coordenação de Tecnologia da Informação',
    contratada: 'Converge Serviços e Tecnologia Ltda.',
    cnpj: '12.345.678/0001-90',
    objeto: 'Sustentação, suporte técnico e evolução de sistemas corporativos.',
    valorContratado: 2450000,
    valorExecutado: 1519000,
    valorPago: 1374000,
    inicio: '2026-01-15',
    termino: '2027-01-14',
    status: 'Vigente',
    responsavel: 'Marina Costa',
    fiscal: 'João Silva',
    gestor: 'Ana Paula Ribeiro',
    documentos: [
      { id: 101, contratoId: 148, nome: 'Contrato-0148-assinado.pdf', categoria: 'Contrato', versao: 1, tamanho: '2,4 MB', responsavel: 'Marina Costa', enviadoEm: '2026-01-15T14:20:00', confidencial: false, storageReference: 'mock://documentos/contrato-0148' },
      { id: 102, contratoId: 148, nome: 'Parecer-juridico-0148.pdf', categoria: 'Parecer', versao: 2, tamanho: '840 KB', responsavel: 'Paulo Mendes', enviadoEm: '2026-08-28T10:05:00', confidencial: true, storageReference: 'mock://documentos/parecer-0148' },
    ],
    aditivos: [{ numero: 'TA-01/2026', tipo: 'Valor', descricao: 'Acréscimo de postos especializados', valor: 210000, assinadoEm: '2026-08-20' }],
    movimentosFinanceiros: [
      { id: 1, tipo: 'Empenho', documento: '2026NE000184', descricao: 'Empenho inicial', valor: 1600000, data: '2026-01-20', status: 'Empenhado' },
      { id: 2, tipo: 'Pagamento', documento: '2026OB004921', descricao: 'Competência agosto/2026', valor: 145000, data: '2026-09-05', status: 'Pago' },
    ],
    eventos: [
      { id: 1, tipo: 'Aditivo', titulo: 'Termo aditivo formalizado', descricao: 'Acréscimo de R$ 210.000,00 aprovado.', data: '2026-08-20T16:10:00', responsavel: 'Ana Paula Ribeiro' },
      { id: 2, tipo: 'Fiscalização', titulo: 'Relatório mensal registrado', descricao: 'Execução de agosto validada pelo fiscal.', data: '2026-09-08T09:30:00', responsavel: 'João Silva' },
    ],
    pendencias: [{ id: 1, titulo: 'Documento de regularidade fiscal', prazo: '2026-09-18', responsavel: 'João Silva', status: 'Pendente', criticidade: 'Alta' }],
  },
  {
    id: 203,
    numero: 'CT-2025/0203',
    processoSei: '00040-00009221/2025-03',
    orgao: 'Secretaria de Infraestrutura',
    unidade: 'Diretoria de Serviços Gerais',
    contratada: 'Alvorada Engenharia S.A.',
    cnpj: '45.210.987/0001-35',
    objeto: 'Manutenção preventiva e corretiva das instalações prediais.',
    valorContratado: 3900000,
    valorExecutado: 3354000,
    valorPago: 3180000,
    inicio: '2025-10-01',
    termino: '2026-09-30',
    status: 'Em renovação',
    responsavel: 'Carlos Nogueira',
    fiscal: 'Fernanda Alves',
    gestor: 'Ricardo Lima',
    documentos: [{ id: 201, contratoId: 203, nome: 'Contrato-0203.pdf', categoria: 'Contrato', versao: 1, tamanho: '3,1 MB', responsavel: 'Carlos Nogueira', enviadoEm: '2025-10-01T11:00:00', confidencial: false, storageReference: 'mock://documentos/contrato-0203' }],
    aditivos: [],
    movimentosFinanceiros: [{ id: 3, tipo: 'Pagamento', documento: '2026OB004887', descricao: 'Medição agosto/2026', valor: 325000, data: '2026-09-03', status: 'Pago' }],
    eventos: [{ id: 3, tipo: 'Vigência', titulo: 'Renovação iniciada', descricao: 'Minuta enviada para análise jurídica.', data: '2026-09-09T15:15:00', responsavel: 'Ricardo Lima' }],
    pendencias: [{ id: 2, titulo: 'Aprovação da renovação', prazo: '2026-09-16', responsavel: 'Ricardo Lima', status: 'Em análise', criticidade: 'Alta' }],
  },
  {
    id: 317,
    numero: 'CT-2026/0317',
    processoSei: '00040-00022108/2026-89',
    orgao: 'Secretaria de Planejamento',
    unidade: 'Coordenação de Gestão Documental',
    contratada: 'Arquivo Seguro Digital Ltda.',
    cnpj: '08.765.432/0001-12',
    objeto: 'Digitalização, indexação e custódia de acervo administrativo.',
    valorContratado: 1180000,
    valorExecutado: 354000,
    valorPago: 295000,
    inicio: '2026-06-01',
    termino: '2027-05-31',
    status: 'Vigente',
    responsavel: 'Luciana Prado',
    fiscal: 'Rafael Moreira',
    gestor: 'Sofia Azevedo',
    documentos: [{ id: 301, contratoId: 317, nome: 'Contrato-0317.pdf', categoria: 'Contrato', versao: 1, tamanho: '1,8 MB', responsavel: 'Luciana Prado', enviadoEm: '2026-06-01T08:45:00', confidencial: false, storageReference: 'mock://documentos/contrato-0317' }],
    aditivos: [],
    movimentosFinanceiros: [{ id: 4, tipo: 'Pagamento', documento: '2026OB004765', descricao: 'Lote documental 03', valor: 59000, data: '2026-08-29', status: 'Liquidado' }],
    eventos: [{ id: 4, tipo: 'Documento', titulo: 'Relatório de fiscalização incluído', descricao: 'Relatório referente ao lote 03.', data: '2026-09-10T11:40:00', responsavel: 'Rafael Moreira' }],
    pendencias: [],
  },
];

const AUDITORIA_MOCK: RegistroAuditoria[] = [
  { id: 1, dataHora: '2026-09-10T14:32:00', usuario: 'João Silva', acao: 'Alteração', modulo: 'Contratos', contratoId: 148, contratoNumero: 'CT-2026/0148', campo: 'Valor contratado', valorAnterior: 'R$ 2.240.000,00', valorNovo: 'R$ 2.450.000,00', descricao: 'alterou o valor contratado após a formalização do TA-01/2026' },
  { id: 2, dataHora: '2026-09-10T11:40:00', usuario: 'Rafael Moreira', acao: 'Upload', modulo: 'Documentos', contratoId: 317, contratoNumero: 'CT-2026/0317', documentoId: 301, valorNovo: 'Relatório de fiscalização - lote 03', descricao: 'adicionou um relatório de fiscalização ao contrato CT-2026/0317' },
  { id: 3, dataHora: '2026-09-09T15:15:00', usuario: 'Ricardo Lima', acao: 'Aprovação', modulo: 'Contratos', contratoId: 203, contratoNumero: 'CT-2025/0203', campo: 'Status', valorAnterior: 'Vigente', valorNovo: 'Em renovação', descricao: 'iniciou o fluxo de renovação do contrato CT-2025/0203' },
  { id: 4, dataHora: '2026-09-08T09:30:00', usuario: 'João Silva', acao: 'Alteração', modulo: 'Financeiro', contratoId: 148, contratoNumero: 'CT-2026/0148', campo: 'Valor executado', valorAnterior: 'R$ 1.374.000,00', valorNovo: 'R$ 1.519.000,00', descricao: 'registrou a execução financeira da competência agosto/2026' },
  { id: 5, dataHora: '2026-09-05T16:05:00', usuario: 'Marina Costa', acao: 'Vinculação', modulo: 'SEI', contratoId: 148, contratoNumero: 'CT-2026/0148', valorNovo: '00040-00018472/2026-11', descricao: 'vinculou o processo SEI ao contrato CT-2026/0148' },
];