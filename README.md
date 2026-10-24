# Financeiro Inteligente — Dashboard HTML Offline

Painel financeiro em **HTML, CSS e JavaScript puro**, sem bibliotecas externas, banco de dados ou login. Interface dark inspirada no wireframe aprovado.

## Abrir no computador do comprador

1. Extraia o ZIP para uma pasta (não abra os arquivos diretamente dentro do ZIP).
2. Abra `index.html` com **Google Chrome** ou **Microsoft Edge**.
3. Em **Lançamentos financeiros**, registre receitas e despesas. O painel atualiza automaticamente.
4. Use **Configurações → Carregar demonstração** se quiser testar com dados **fictícios**.
5. Clique em **Salvar backup** regularmente. Use **Restaurar backup** ao trocar de computador/navegador.

> Os lançamentos são salvos no `localStorage` do navegador, vinculados à origem do arquivo. Alguns navegadores podem restringir ou isolar o armazenamento quando aberto via `file://`. Teste a persistência no navegador escolhido antes de cadastrar dados importantes. Se o navegador bloquear o armazenamento local em arquivos, use uma versão instalável ou um servidor local. Limpar os dados do site, mudar de navegador ou mover o arquivo pode impedir o acesso aos dados anteriores. Backups JSON são essenciais.

## Criar repositório no GitHub e abrir no Codespaces

1. Entre em **github.com/new**, escolha o nome `financeiro-inteligente-offline` e crie o repositório (privado, se for comercializar).
2. Extraia este ZIP no computador. No repositório, clique em **Add file → Upload files** e envie `index.html`, `style.css`, `script.js`, `README.md` e a pasta `.devcontainer` (se a interface não aceitar pastas ocultas, crie `.devcontainer/devcontainer.json` pelo editor web).
3. Clique em **Code → Codespaces → Create codespace on main**.
4. No terminal do Codespaces, execute:

   ```bash
   python3 -m http.server 5500
   ```

5. Na aba **Ports/Portas**, abra a porta `5500` no navegador. O projeto funciona sem instalação de pacotes.
6. Para salvar alterações no GitHub:

   ```bash
   git add .
   git commit -m "Atualiza dashboard financeiro offline"
   git push origin main
   ```

## Testes antes de vender

- Criar receita e despesa; conferir KPIs, gráfico mensal, mapa anual e lista.
- Filtrar por data, tipo e categoria; ordenar por data e valor.
- Editar e excluir lançamentos.
- Criar categoria personalizada.
- Fechar e reabrir a página no mesmo navegador; confirmar persistência.
- Exportar backup JSON, apagar dados e restaurar; conferir integridade.
- Exportar CSV e abrir no Excel.
- Testar no Chrome e Edge **abrindo o arquivo extraído**, sem servidor, como o comprador fará.

## Entrega ao cliente via Hotmart

Disponibilize um ZIP com `index.html`, `style.css`, `script.js` e este `README.md` (a pasta `.devcontainer` não é necessária para o cliente). A Hotmart processa a venda e entrega o arquivo. Não existe cobrança, login nem sincronização dentro do painel.

**Privacidade:** os dados permanecem localmente no navegador; o aplicativo não envia informações à internet. O armazenamento não é criptografado e não é apropriado para guardar senhas, números de cartão ou dados financeiros extremamente sensíveis. Pessoas com acesso ao mesmo perfil do navegador podem acessar os lançamentos. O backup também não é criptografado.

**Licenciamento:** confirme as regras de uso e distribuição da sua oferta na Hotmart. Não prometa sincronização entre dispositivos ou proteção criptográfica.
