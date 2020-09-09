# Central Mobile API - Assistência Técnica
Projeto designado para gerenciar a solução de negócio baseado no sistema de franquia de uma assistência técnica. 
Todo o projeto foi baseado em boas práticas, utilizando as novidades atuais do momento onde as tecnologias restify com navegação 100% restiful com hypermidia e autenticação Jason Web Token, mantendo a segurança contra ataques ou scripts malicioso que venham comprometer a integridade dos dados , entre outras que complementarão o projeto. 

### Regras
- Boas práticas com padrão de projeto;
- Versionamento com [Git-Flow](http://danielkummer.github.io/git-flow-cheatsheet/index.pt_BR.html "Git-flow");
- Código limpo e abstraído;
- Dinâmica de aplicação para manutenção fácil;
- Última tecnologia de desenvolvimento no mercado;
###

<p align="center">
  <br><br>
  <a>
  <img width="250" height="238" src="/doc/cm_small.png">
  </a>

  <h3 align="center">Nosso foco é Assistência Tecnica!</h3>
</p>


## Getting Started

### Instalação

* Clone o repositório
```
yarn test
```
* Rode o yarn
```
yarn install
```

* Ou se prefirir o npm
```
npm install
```

### Dependências

* Restify
* Mongoose
* Bcrypt
* JWT
* Jest/Supertest

### Restify e MongoDB

A estrutura basica da api é definir a rota e o modelo que a rota irá receber, e com isso fazer um restiful com hipermidia pelos dados do mongodb
* Modelo de Usuário
```
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: regex,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Female', 'Male']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: CPF,
            message: 'mensagem customizar '
        }
    },
    profiles: {
        type: [String],
        required: false
    }
})
```
* Rotas do Usuário
```
server.get('/users', [callbacks])
server.get('/users/:id', [callbacks])
server.post('/users',  [callbacks])
server.put('/users/:id',  [callbacks])
server.patch('/users/:id',  [callbacks])
server.del('/users/:id',  [callbacks])
server.post('/users/authenticate', callback)
```

### Autenticando

Esta API possui 2 niveis implementados(admin e user). O nivel de admin tem o acesso a todas as rotas, enquanto o user, possui acesso apenas a algumas rotas.

O controle é feito através da propriedade "profiles", onde vc poderá adicionar a cada novo cadastro qual o nível de acesso aquele cadastro pertencerá, sendo assim um array do tipo profiles.

Com um admin autenticado, pode-se fazer um patch em um usuário previamente cadastrado, e criar um usuário do tipo admin ou user:
```
PATCH: http://localhost:3000/users/5f58787e1e65d1243cadfb44

//Alterando os dados do usuário com id 5f58787e1e65d1243cadfb44
{
  "profiles": "["admin", "user"]" //adicionando privilégio admin
}
```

Agora com o usuário cujo id é 5f58787e1e65d1243cadfb44, possui privilegios de admin. basta se authenticar e gerar o token para poder consumir todas as rotas da api sem que seja barrado.
```
POST: http://localhost:3000/users/authenticate

//Alterando os dados do usuário com id 5f58787e1e65d1243cadfb44
{
  "email": "miskecysss@gmail.com",
  "password": "123456"
}

Retorno:

{
  "name": "kecy jones",
  "email": "miskecysss@gmail.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaXNrZWN5LnNwa0BnbWFpbC5jb20iLCJpc3MiOiJjZW50cmFsLW1vYmlsZS1hcGkiLCJpYXQiOjE1OTk2ODMzNDh9.kpl4N2kQs3PjCxI6t-iwrYU0-Xg3hAG1LrAe_n1MAaw"
}
```
### Executando testes com Jest

* Para rodar os testes basta rodar o comando do script:
```
yarn test
```
<p align="center">
  <img width="600" height="533" src="doc/yarn-test.gif">
</p>

### Segurança com PM2 e JWT

Quando se trata de ambiente de produção, é muito importante escolher uma técnologia recomendada pela comunidade e que atenda aos padrões de segurança para a aplicação, pois uma ferramenta mal utilizada pode fazer com que quebre nossa aplicação.

PM2 contém a forma de clusters, otimizando o desempenho single do node, fazendo com que seja mais produtivo na hora de gerenciar requisições. a segurança na integração dos logs para eventuais auditoria e a praticidade da configuração do ecosystem.config do pm2, nos auxilia na automação de rotinas flexível.

<p align="center">
  <img width="600" height="533" src="doc/yarn-prod-start.gif">
</p>
* PM2 sendo executado no modo produção e mostrando um log de authenticação com JWT:
```
yarn pm2 prod-start
```

## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info

ex. Kecy Jones 
ex. [@Kecy Jones Spk](https://facebook.com/chikyuujin)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)

#### Licença
 ><p>2018, &copy; Central Mobile todos os direitos reservados.</p>
 ><p>2018, &copy; Projetado Spruko - Ren todos os direitos reservados.</p>
 ><p>2020, &copy; Desenvolvedor Kecy todos os direitos reservados.</p>
