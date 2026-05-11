import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Router } from '@angular/router';

// Speech API types
declare const webkitSpeechRecognition: any;
declare const SpeechRecognition: any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  public sidebarColor: string = "red";
columns=[
  {label:'Dúvidas? Acesse o manual do usuário', text:'Menu > Manual do Usuário'},
  {label:'Encontrou algum erro ou tem sugestões?', text:'Menu > Comentários e Sugestões'},
  {label:'HomeOffice - Escritório de Projetos', text:'home@office.com.br'}]
  // Floating search state
  public floatingVisible: boolean = true; // whether the floating control is shown
  public floatingOpen: boolean = false; // whether the input panel is open
  public floatingSearchTerm: string = '';
  public micListening: boolean = false;
  private recognition: any = null;

  constructor(public sidenav: SidenavService, private router: Router) {}

  ngAfterViewInit(): void {
    // inject footer logo into dsc-footer anchor
    setTimeout(() => {
      try {
        const footer = document.querySelector('dsc-footer');
        if (footer) {
          const footerAnchor = (footer.shadowRoot && footer.shadowRoot.querySelector('.footer__logo a'))
            || footer.querySelector('.footer__logo a');
          if (footerAnchor) {
            // remove existing svg
            const existing = footerAnchor.querySelector ? footerAnchor.querySelector('svg') : null;
            if (existing && existing.remove) existing.remove();
            // append image
            if (!footerAnchor.querySelector || !footerAnchor.querySelector('img')) {
              const img = document.createElement('img');
              img.setAttribute('src', '/assets/img/logo.png');
              img.setAttribute('alt', 'CONVERGE');
              img.style.height = '24px';
              img.style.width = 'auto';
              img.style.display = 'inline-block';
              try { footerAnchor.innerHTML = ''; } catch (e) {}
              footerAnchor.appendChild(img);
            }
          }
        }
      } catch (e) {
        console.warn('Footer logo injection failed', e);
      }
    });
  }
  changeSidebarColor(color: string){
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var mainPanel = document.getElementsByClassName('main-panel')[0];

    this.sidebarColor = color;

    if(sidebar != undefined){
        sidebar.setAttribute('data',color);
    }
    if(mainPanel != undefined){
        mainPanel.setAttribute('data',color);
    }
  }
  changeDashboardColor(color: string){
    var body = document.getElementsByTagName('body')[0];
    if (body && color === 'white-content') {
        body.classList.add(color);
    }
    else if(body.classList.contains('white-content')) {
      body.classList.remove('white-content');
    }
  }
  ngOnInit() {}

  // Floating search controls
  toggleFloating(): void {
    if (!this.floatingVisible) return;
    this.floatingOpen = !this.floatingOpen;
    if (!this.floatingOpen) {
      this.stopMic();
    }
  }

  hideFloating(): void {
    // permanently hide the floating control for this session
    this.floatingVisible = false;
    this.floatingOpen = false;
    this.stopMic();
  }

  submitFloatingSearch(): void {
    const termo = (this.floatingSearchTerm || '').trim();
    if (!termo) return;
    const lower = termo.toLowerCase();
    if (lower.includes('vitec')) {
      this.router.navigate(['/busca-gerencial'], { queryParams: { q: termo } });
      return;
    }
    this.router.navigate(['/busca-contrato'], { queryParams: { contrato: termo } });
  }

  // Microphone helpers (lightweight reuse of dashboard logic)
  startMic(): void {
    const Recognizer = typeof SpeechRecognition !== 'undefined'
      ? SpeechRecognition
      : typeof webkitSpeechRecognition !== 'undefined'
        ? webkitSpeechRecognition
        : null;
    if (!Recognizer) {
      alert('Seu navegador não suporta reconhecimento de voz. Use Google Chrome.');
      return;
    }

    if (this.recognition) {
      try { this.recognition.abort(); } catch (_) {}
      this.recognition = null;
    }
    const rec = new Recognizer();
    rec.lang = 'pt-BR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => { this.micListening = true; };
    rec.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      this.floatingSearchTerm = transcript;
      this.micListening = false;
      try { rec.stop(); } catch (_) {}
      this.submitFloatingSearch();
    };
    rec.onerror = (e: any) => {
      console.warn('Mic error', e);
      this.micListening = false;
      this.recognition = null;
    };
    rec.onend = () => { this.micListening = false; this.recognition = null; };

    this.recognition = rec;
    try { rec.start(); } catch (e) { console.warn('Erro ao iniciar microfone', e); }
  }

  stopMic(): void {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (_) {}
    }
    this.micListening = false;
    this.recognition = null;
  }
}
