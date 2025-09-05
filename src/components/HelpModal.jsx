import React from 'react';
import { X } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gradient-to-b from-purple-900 to-blue-900 rounded-2xl p-8 max-w-2xl mx-4 border-4 border-yellow-400 max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Przycisk zamknięcia */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Tytuł */}
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🎮 Jak grać w Rogue Clicker RPG?
          </h2>

          {/* Instrukcja */}
          <div className="text-white space-y-4">
            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">1. 🎯 Podstawy gry</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Wybierz klasę postaci (Wojownik, Mag, Łucznik)</li>
                <li>Kliknij na potwora, aby go zaatakować</li>
                <li>Pokonuj przeciwników, aby zdobywać złoto i doświadczenie</li>
                <li>Awansuj na wyższe piętra, aby spotkać silniejszych przeciwników</li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">2. ⚔️ Walka</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Normalny atak:</strong> Kliknij na potwora</li>
                <li><strong>Umiejętności specjalne:</strong> Używaj zaklęć (wymaga many)</li>
                <li><strong>Krytyczne trafienia:</strong> Szansa na podwójne obrażenia</li>
                <li><strong>Auto-klik:</strong> Automatyczne atakowanie (poziom 21+)</li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">3. 📈 Postęp</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Poziomy:</strong> Zyskujesz statystyki za doświadczenie</li>
                <li><strong>Prestige:</strong> Zacznij od nowa z bonusami (poziom 50+)</li>
                <li><strong>Ekwipunek:</strong> Zbieraj i craftuj broń, zbroję, akcesoria</li>
                <li><strong>Umiejętności:</strong> Rozwijaj specjalne zdolności</li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">4. 🏪 Sklep i Craft</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Sklep:</strong> Kupuj mikstury za złoto</li>
                <li><strong>Craft:</strong> Twórz broń z materiałów</li>
                <li><strong>Materiały:</strong> Zbieraj drewno, żelazo, stal, mithril, adamant</li>
                <li><strong>Bonusy:</strong> Przedmioty mogą mieć losowe bonusy</li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">5. 💾 Zapisywanie</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Zapisz i wyjdź:</strong> Bezpiecznie zapisz postęp</li>
                <li><strong>Wczytaj grę:</strong> Kontynuuj od ostatniego zapisu</li>
                <li><strong>Reset:</strong> Zacznij grę od nowa</li>
                <li><strong>Lokalne zapisy:</strong> Dane są przechowywane w przeglądarce</li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">6. 🎯 Wskazówki</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Zawsze miej zapas mikstur zdrowia i many</li>
                <li>Inwestuj w umiejętności odpowiednie dla swojej klasy</li>
                <li>Zbieraj materiały do craftowania lepszej broni</li>
                <li>Używaj Prestige, gdy osiągniesz wysoki poziom</li>
                <li>Eksperymentuj z różnymi klasami postaci</li>
              </ul>
            </div>
          </div>

          {/* Przycisk zamknięcia */}
          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold"
            >
              Rozumiem!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
