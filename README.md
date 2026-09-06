# FrontGcPainelGerencial

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.14.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Cadastros e compliance

A rota `/cadastros` centraliza usuários, fornecedores, departamentos, contratos, validação documental e regularidade de fornecedores.

Em desenvolvimento, usuários, fornecedores e departamentos usam `localStorage` quando `useLocalManagementData` está habilitado. Em produção, o frontend espera os seguintes endpoints autenticados:

- `GET|POST /v1/gestao-cadastros/{usuarios|fornecedores|departamentos}`
- `PUT|DELETE /v1/gestao-cadastros/{tipo}/{id}`
- `POST /v1/documentos/validar` como `multipart/form-data`, retornando status, confiança, campos extraídos e inconsistências
- `GET /v1/fornecedores/{cnpj}/regularidade`, retornando situação, fontes, protocolos e apontamentos

A validação documental deve ocorrer no backend, com armazenamento seguro, antimalware, trilha de auditoria e revisão humana. Consultas a SICAF e outras bases federais devem passar por gateway corporativo autorizado; credenciais e resultados oficiais não devem ser processados ou simulados no navegador.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
