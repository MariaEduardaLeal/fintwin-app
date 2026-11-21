# fintwin-app

Aplicativo mobile nativo do **FinTwin (Gêmeo Digital Financeiro)** construído com **React Native CLI**, **TypeScript**, **NativeWind v4 (Dark Mode)**, **React Navigation**, **Zustand**, **Axios (Sanctum)** e **Google Sign-In**.

> Este repositório faz parte da arquitetura **Polyrepo** do FinTwin e consome a API Laravel hospedada em `https://fintwin.freedevs.tech/api/v1` ([fintwin-api](https://github.com/MariaEduardaLeal/fintwin-api)).

## Requisitos locais (Windows)
- Node.js `>= 22`
- JDK 17
- Android SDK (`ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk`)

## Instalação e Configuração
```powershell
npm install
```

Edite `src/config/env.ts` caso queira configurar o **Web Client ID** do Google Cloud (`googleWebClientId`) correspondente ao `GOOGLE_CLIENT_IDS` da API.

## Como rodar e testar
```powershell
# 1. Terminal 1 — Iniciar o Metro Bundler (limpando cache na primeira execução)
npm start -- --reset-cache

# 2. Terminal 2 — Compilar e instalar no Android (emulador ou Motorola via USB)
npm run android

# 3. Verificações de qualidade
npm run typecheck
npm run lint
npm test -- --watchAll=false
```
