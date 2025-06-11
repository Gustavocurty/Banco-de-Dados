## Instalação das Dependências

Antes de qualquer configuração, é importante instalar as dependências do projeto. Execute o comando abaixo na raiz do projeto:

    npm install

## Instruções para Configuração do Banco de Dados

1. **Crie a string de conexão do banco de dados** no formato:

    ```
    mysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
    ```

    - Substitua `USUARIO` pelo usuário do banco (ex: `root`).
    - Substitua `SENHA` pela senha do usuário.
    - Substitua `HOST` pelo endereço do servidor (ex: `localhost`).
    - Substitua `PORTA` pela porta do MySQL (ex: `3306`).
    - Substitua `NOME_DO_BANCO` pelo nome do seu banco de dados.

    Exemplo:
    ```
    mysql://root:minhasenha@localhost:3306/meubanco
    ```

2. **Crie o arquivo `.env`** e adicione a seguinte linha, usando a string criada acima:

    ```
    DATABASE_URL="mysql://root:minhasenha@localhost:3306/meubanco"
    ```

    O nome da variável deve ser exatamente `DATABASE_URL`.

3. **Execute as migrações do Prisma** com o comando:

    ```
    npx prisma migrate dev
    ```

    Isso criará as tabelas no banco de dados conforme o schema definido.
