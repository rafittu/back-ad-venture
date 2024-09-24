# ♨️ Back-end da aplicação AdVenture

###

<br>

O projeto AdVenture consiste em uma API desenvolvida para simplificar a gestão de campanhas com recursos que permitem criar, visualizar, atualizar e deletar campanhas.

<br>

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Node.js** com framework **NestJS** e **TypeScript**;
- **Prisma ORM** para comunicação e manipulação do banco de dados **PostgreSQL**;
- **Helmet** para configuração segura dos cabeçalhos HTTP;
- **Docker** como uma ferramenta de containerização;
- **Jest** para execução e automação dos testes unitários;
- **Swagger** para documentação da API;

<br>

## Funcionalidades
### Gerenciamento de Campanhas:
- Cadastro, listagem, visualização, edição e exclusão de campanhas.
- Atualização automatica de status com `node-scheduler`.
- Filtros avançados para busca de campanhas por nome, categoria, status, data inicial, data termino.

<br>

### 🚧 Futuras implementações:
- Ampliação de endpoints para painel administrativo;
    - criação de usuários;
    - login e autenticação;
    - rotas privadas;

 - Integração microserviço:
    - campanha válida até a data termino ou limite de usos;

<br>

## Configuração do Projeto

### Requisitos para rodar a aplicação

- NodeJs (versão 18.x ou superior);
- Docker e Docker Compose;

### Instalação

1. Clonando o repositório:

```bash
$ git clone git@github.com:rafittu/back-ad-venture.git
$ cd back-ad-venture
```

2. Crie um arquivo `.env` na raiz do projeto e preencha as informações de acordo com o arquivo `.env.example` disponível.

3. Inicie o ambiente de desenvolvimento:

```bash
$ docker-compose up --build
```

<br>

## Testes

<br>

A API possui uma cobertura de testes unitários abrangente, com 100% de cobertura em cada parte essencial do código, garantindo a qualidade e o correto funcionamento do sistema.

Para executar os testes unitários, utilize o seguinte comando:

```bash
$ npm run test
```

Você também pode gerar um relatório de cobertura dos testes para verificar quais partes do código foram testadas. Para gerar esse relatório, utilize o seguinte comando:

```bash
$ npm run test:cov
```

<br>

## Documentação

<br>

A documentação completa da API está disponível através do Swagger. Para acessá-la, siga as etapas abaixo:

- Certifique-se de ter a API em execução localmente ou em um ambiente acessível;
- Abra um navegador da web e acesse a seguinte URL: `http://localhost:3000/v1/api-doc` (substitua `3000` pelo número da porta inserida no arquivo `.env`);
- A documentação interativa da API será exibida no Swagger UI, onde você poderá explorar todos os endpoints, seus parâmetros e exemplos de solicitação/resposta.

<br>

##

<p align="right">
  <a href="https://www.linkedin.com/in/rafittu/">Rafael Ribeiro 🚀</a>
</p>
