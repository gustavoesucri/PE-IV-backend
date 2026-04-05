# PE-IV-backend
Back-end do Projeto de Extensão IV

### Instruções para rodar o projeto:

- Em um terminal, rodar 'npm run start' no projeto /PE-IV-backend .

- (Se quiser front-end) Em outro, rodar 'npm run start' na pasta do projeto /PE-IV-frontend .

- No login utilizar: usuário: 'Diretor' e senha 'admin'.

- Armazenar o token para uso.

- O back-end possui seed. Rodar usando "npm run seed".

- Também foram criados 4 arquivos JavaScript que também alimentam o backend e no futuro irão incorporar o seed. Eles têm o prefixo "envia_". 

    Ordem de execução dos scripts:

        - envia_100_alunos.js
        - envia_100_CNPJs.js
        - envia_100.encaminhamentos.js
        - envia_100.avaliacoes.js (não são 100, são menos)

    Antes de executá-los, substitua o token recebido no login na variável "TOKEN", no início de cada um dos arquivos.

    Para executar eles, chame cada um deles num terminal separado do que está rodando o back-end e execute:
    
        node [nome_do_arquivo]

    A ordem é necessária por causa das FKs.
