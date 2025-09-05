# Wdrażanie na GitHub Pages

## Konfiguracja GitHub Pages

1. **Włącz GitHub Pages w ustawieniach repozytorium:**
   - Przejdź do Settings → Pages
   - W sekcji "Source" wybierz "GitHub Actions"
   - Wybierz workflow "Deploy to GitHub Pages"

2. **Automatyczne wdrażanie:**
   - Projekt jest skonfigurowany do automatycznego wdrażania przy każdym push do brancha `main` lub `master`
   - Workflow znajduje się w `.github/workflows/deploy.yml`
   - Używa oficjalnych akcji GitHub Pages (actions/deploy-pages@v4)

3. **Lokalne testowanie:**
   ```bash
   npm run build
   npm run preview
   ```

## Rozwiązywanie problemów

### Błąd "exit code 128"
- Zaktualizowano workflow do używania oficjalnych akcji GitHub Pages
- Dodano odpowiednie uprawnienia (pages: write, id-token: write)
- Workflow jest teraz podzielony na dwa joby: build i deploy

### Sprawdzanie statusu wdrażania
- Przejdź do Actions w repozytorium
- Sprawdź logi workflow "Deploy to GitHub Pages"
- Jeśli nadal występują błędy, sprawdź czy GitHub Pages jest włączone w Settings → Pages

## Struktura plików

- `vite.config.js` - skonfigurowany z `base: '/RL-clicker/'` dla GitHub Pages
- `.github/workflows/deploy.yml` - automatyczne wdrażanie z oficjalnymi akcjami
- `dist/` - zbudowane pliki (generowane automatycznie)

## URL strony

Po włączeniu GitHub Pages, strona będzie dostępna pod adresem:
`https://batsnuff.github.io/RL-clicker/`
