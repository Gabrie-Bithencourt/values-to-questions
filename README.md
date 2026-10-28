# Values To Questions

Quero criar o layout para uma funcionalidade que cria roteiros de entrevista com sugestões de IA

Deve ter dois modos de roteiro: Roteiro Livre e Fit cultural
Roteiro livre baseando na primeira  imagem anexada, onde tem os campos de texto perguntando o que você quer avaliar com alguns exemplos no placeholder e outra caixa com informações adicionais. O reteiro gerado pela ia ao lado com opções de edição em tempo real

Fit cultural deve seguir um padrão parecido mas se baseando mais na segunda imagem anexada onde tem campos de texto para ser inserido valores importantes para empresa, comportamentos do dia a dia e pontos de atenção.  A ideia é que tenha esses campos para preenchimento que servira de contexto para IA criar o esquelo do roteiro, usuário pode editar de acordo com sua preferencias e pedir por melhorias em perguntas especificas. Quero que o layout seja simples e fácil de utilizar

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0c915c32-d5a4-4cd0-99ef-9c2ad551defe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

> Requer **Node.js 22.12+** (ou 20.19+). Se o `npm i` falhar com erro de módulo nativo
> (`@rolldown/binding-*` / `@oxc-parser/binding-*`), apague `node_modules` e `package-lock.json`
> e rode `npm install --legacy-peer-deps`. Se ainda faltar o módulo nativo no Windows, instale-os à mão:
> `npm install --no-save --legacy-peer-deps @rolldown/binding-win32-x64-msvc@1.2.1 @oxc-parser/binding-win32-x64-msvc@0.120.0`

## Publicar no GitHub Pages

1. Suba o código para o GitHub (branch `main` ou `master`).
2. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. O workflow [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) roda a cada push e publica em
   `https://<usuario>.github.io/<repositorio>/`.

Para testar o build estático localmente: `npm run build:pages` (saída em `dist/client`).
O build normal (`npm run build`) continua igual, usado pelo Lovable.
