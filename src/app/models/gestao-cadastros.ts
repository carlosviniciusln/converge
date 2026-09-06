export type CadastroTipo = 'usuarios' | 'fornecedores' | 'departamentos' | 'representantes';

export interface CadastroBase {
  id: number;
  ativo: boolean;
}

export interface UsuarioCadastro extends CadastroBase {
  matricula: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface FornecedorCadastro extends CadastroBase {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: string;
}

export interface DepartamentoCadastro extends CadastroBase {
  sigla: string;
  nome: string;
  responsavel: string;
  email: string;
}

export interface RepresentanteCadastro extends CadastroBase {
  cpf: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
}

export type CadastroRegistro = UsuarioCadastro | FornecedorCadastro | DepartamentoCadastro | RepresentanteCadastro;

export interface ValidacaoDocumento {
  arquivo: string;
  tipoDocumento: string;
  status: 'aprovado' | 'revisao' | 'reprovado';
  confianca: number;
  campos: Record<string, string>;
  inconsistencias: string[];
  analisadoEm: string;
}

export interface ConsultaFornecedor {
  cnpj: string;
  razaoSocial: string;
  situacao: 'regular' | 'irregular' | 'indisponivel';
  consultadoEm: string;
  fontes: Array<{
    nome: string;
    situacao: string;
    protocolo?: string;
  }>;
  apontamentos: string[];
}

export interface BibliotecaDocumentoItem {
  id: number;
  nome: string;
  categoria: string;
  obrigatorioPadrao: boolean;
  ativo: boolean;
  atualizadoEm: string;
}

export type StatusDocumentoContrato = 'pendente' | 'enviado' | 'validado';

export interface DocumentoContratoVinculo {
  id: number;
  coContrato: string;
  idBibliotecaDocumento: number;
  nomeDocumento: string;
  obrigatorio: boolean;
  status: StatusDocumentoContrato;
  atualizadoEm: string;
}
