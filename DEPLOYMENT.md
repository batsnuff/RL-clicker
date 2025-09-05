# Wdrażanie na GitHub Pages

## Konfiguracja GitHub Pages

1. **Włącz GitHub Pages w ustawieniach repozytorium:**
   - Przejdź do Settings → Pages
   - W sekcji "Source" wybierz "GitHub Actions"

2. **Automatyczne wdrażanie:**
   - Projekt jest skonfigurowany do automatycznego wdrażania przy każdym push do brancha `main` lub `master`
   - Workflow znajduje się w `.github/workflows/deploy.yml`

3. **Lokalne testowanie:**
   ```bash
   npm run build
   npm run preview
   ```

## Struktura plików

- `vite.config.js` - skonfigurowany z `base: '/RL-clicker/'` dla GitHub Pages
- `.github/workflows/deploy.yml` - automatyczne wdrażanie
- `dist/` - zbudowane pliki (generowane automatycznie)

## URL strony

Po włączeniu GitHub Pages, strona będzie dostępna pod adresem:
`https://batsnuff.github.io/RL-clicker/`
