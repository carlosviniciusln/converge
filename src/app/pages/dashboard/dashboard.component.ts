import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService, PerfisEnum } from 'src/app/shared/services/token-storage.service';

const HISTORICO_KEY = 'sigvc_historico_busca';
const HISTORICO_MAX = 5;

// Tipagem do SpeechRecognition (Web Speech API — não está no lib padrão do TS)
declare const webkitSpeechRecognition: any;
declare const SpeechRecognition: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  termoBusca: string = '';
  historico: string[] = [];

  // Estado do microfone
  micEscutando: boolean = false;
  private recognition: any = null;
  private _stopping: boolean = false; // evita criar nova instância enquanto a anterior ainda fecha

  constructor(private router: Router, private ngZone: NgZone, private token: TokenStorageService) {}

  ngOnInit(): void {
    this.carregarHistorico();

    // Redirecionamento automático para busca-gerencial quando o usuário for
    // Administrador ou pertencer a uma unidade que começa com 'VI' ou 'DI'.
    try {
      const perfil = this.token.getUserPerfil();
      const currentUser: any = this.token.getUser();
      const unidade = (currentUser?.coUnidade || '').toString().toUpperCase();

      const isAdmin = perfil === PerfisEnum.Administrador;
      const isViOuDi = unidade.startsWith('VI') || unidade.startsWith('DI');

      if (isAdmin || isViOuDi) {
        // Extrai o termo 'vitec' das claims quando disponível
        let vitec = '';
        const claims = currentUser?.claims;
        if (claims && Array.isArray(claims)) {
          // procura um claim cujo type contenha 'vitec' (case-insensitive)
          const found = claims.find((c: any) => c?.type && c.type.toLowerCase().includes('vitec'))
            || claims.find((c: any) => c?.type && c.type.toLowerCase().includes('upn'))
            || claims.find((c: any) => c?.type && c.type.toLowerCase().includes('name'));
          if (found) vitec = found.value || '';
        }

        // fallback: coUnidade ou nome do usuário
        if (!vitec) vitec = currentUser?.coUnidade || currentUser?.noUsuario || '';

        vitec = (vitec || '').toString().trim();
        if (vitec) {
          this.router.navigate(['/busca-gerencial'], { queryParams: { q: vitec } });
        }
      }
    } catch (e) {
      console.warn('Erro ao avaliar redirecionamento automático do dashboard', e);
    }
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      try { this.recognition.abort(); } catch (_) {}
      this.recognition = null;
    }
    this.micEscutando = false;
  }

  // ─── Busca ────────────────────────────────────────────────────────────────

  buscar(): void {
    const termo = (this.termoBusca || '').trim();
    if (!termo) return;
    this.salvarHistorico(termo);
    const lower = termo.toLowerCase();
    // Redirecionamento especial: se o termo contiver 'vitec', abrir busca-gerencial
    if (lower.includes('vitec')) {
      this.router.navigate(['/busca-gerencial'], { queryParams: { q: termo } });
      return;
    }
    this.router.navigate(['/busca-contrato'], { queryParams: { contrato: termo } });
  }

  buscarPorTermo(termo: string): void {
    if (!termo) return;
    this.termoBusca = termo;
    this.salvarHistorico(termo);
    const lower = termo.toLowerCase();
    if (lower.includes('vitec')) {
      this.router.navigate(['/busca-gerencial'], { queryParams: { q: termo } });
      return;
    }
    this.router.navigate(['/busca-contrato'], { queryParams: { contrato: termo } });
  }

  removerTermo(termo: string, event: Event): void {
    event.stopPropagation();
    const historico = this.lerHistoricoStorage().filter(h => h !== termo);
    localStorage.setItem(HISTORICO_KEY, JSON.stringify(historico));
    this.carregarHistorico();
  }

  buscarUD(): void {
    const termo = (this.termoBusca || '').trim();
    this.router.navigate(['/busca-ud'], { queryParams: { ud: termo } });
  }

  // ─── Microfone ────────────────────────────────────────────────────────────

  alternarMicrofone(): void {
    if (this.micEscutando) {
      this.pararMicrofone();
    } else if (!this._stopping) {
      // Só inicia se não há instância anterior ainda encerrando
      this.iniciarMicrofone();
    }
  }

  private iniciarMicrofone(): void {
    const Recognizer = typeof SpeechRecognition !== 'undefined'
      ? SpeechRecognition
      : typeof webkitSpeechRecognition !== 'undefined'
        ? webkitSpeechRecognition
        : null;

    if (!Recognizer) {
      alert('Seu navegador não suporta reconhecimento de voz. Use Google Chrome.');
      return;
    }

    // Garante que não haja instância anterior viva
    if (this.recognition) {
      try { this.recognition.abort(); } catch (_) {}
      this.recognition = null;
    }

    const rec = new Recognizer();
    rec.lang = 'pt-BR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    // Todos os callbacks rodam dentro da NgZone para garantir detecção de mudanças
    rec.onstart = () => {
      this.ngZone.run(() => {
        this._stopping = false;
        this.micEscutando = true;
      });
    };

    rec.onresult = (event: any) => {
      this.ngZone.run(() => {
        const transcript: string = event.results[0][0].transcript;
        this.processarFalaContrato(transcript);
      });
    };

    rec.onerror = (event: any) => {
      this.ngZone.run(() => {
        if (event.error !== 'no-speech') {
          console.warn('[Voz] Erro:', event.error);
        }
        this._stopping = false;
        this.micEscutando = false;
        this.recognition = null;
      });
    };

    rec.onend = () => {
      this.ngZone.run(() => {
        this._stopping = false;
        this.micEscutando = false;
        this.recognition = null;
      });
    };

    this.recognition = rec;
    this._stopping = false;
    try {
      rec.start();
    } catch (e) {
      console.warn('[Voz] Erro ao iniciar:', e);
      this.micEscutando = false;
      this.recognition = null;
    }
  }

  private pararMicrofone(): void {
    this._stopping = true;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (_) {}
    }
    this.micEscutando = false;
  }

  // ─── Interpretação da fala ────────────────────────────────────────────────

  /**
   * Recebe o texto falado e tenta extrair um número de contrato no formato
   * NNNNN/AAAA (ex: "525 barra 2023" → "00525/2023").
   *
   * Padrões reconhecidos:
   *   "525 barra 2023"
   *   "525 de 2023"
   *   "525/2023"            (reconhecimento já transcreveu a barra)
   *   "pesquisa o contrato 525 barra 2023"
   *   "consulta contrato 525 de 2023"
   */
  private processarFalaContrato(fala: string): void {
    const texto = this.normalizarFala(fala);

    // Regex: captura número + separador ("barra" | "de" | "/") + ano de 4 dígitos
    const regex = /(\d+)\s*(?:barra|de|\/)\s*(\d{4})/i;
    const match = texto.match(regex);

    if (match) {
      const numero = match[1].padStart(5, '0'); // preenche com zeros à esquerda até 5 dígitos
      const ano    = match[2];
      const contrato = `${numero}/${ano}`;
      this.termoBusca = contrato;
      this.buscar();
    } else {
      // Fala não reconhecida como contrato: apenas preenche o campo
      this.termoBusca = fala;
    }
  }

  /**
   * Normaliza variações de transcrição de voz:
   * Remove acentos, converte para minúsculas e substitui palavras numéricas
   * que o reconhecedor possa gerar (ex: "vinte e três" não é esperado aqui,
   * mas "barra" e "de" precisam ser preservados literalmente).
   */
  private normalizarFala(fala: string): string {
    return fala
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .toLowerCase()
      .trim();
  }

  // ─── Histórico ────────────────────────────────────────────────────────────

  private salvarHistorico(termo: string): void {
    let historico = this.lerHistoricoStorage();
    historico = historico.filter(h => h.toLowerCase() !== termo.toLowerCase());
    historico.unshift(termo);
    historico = historico.slice(0, HISTORICO_MAX);
    localStorage.setItem(HISTORICO_KEY, JSON.stringify(historico));
    this.carregarHistorico();
  }

  private carregarHistorico(): void {
    this.historico = this.lerHistoricoStorage();
  }

  private lerHistoricoStorage(): string[] {
    try {
      return JSON.parse(localStorage.getItem(HISTORICO_KEY) || '[]');
    } catch {
      return [];
    }
  }
}


