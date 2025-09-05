import React from 'react';
import { Heart, Zap, TrendingUp, Sword, Shield } from 'lucide-react';

export default function PlayerStats({ gameState, onToggleAutoClick, classes }) {
  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-6 mb-6">
      {/* Nazwa postaci i klasa */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">{gameState.playerName}</h3>
        <p className="text-sm text-gray-300">{gameState.playerClass && classes[gameState.playerClass]?.name}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-white text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-yellow-400" size={16} />
          <span>Lv.{gameState.level} {gameState.prestigeLevel > 0 && <span className="text-yellow-400">★</span>}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="text-red-400" size={16} />
          <span>{gameState.health}/{gameState.maxHealth}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="text-blue-400" size={16} />
          <span>{gameState.mana}/{gameState.maxMana}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">💰</span>
          <span>{gameState.gold}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sword className="text-orange-400" size={16} />
          <span>{gameState.clickDamage}{gameState.prestigeBonus > 0 && <span className="text-green-400">+{gameState.prestigeBonus}%</span>}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-gray-400" size={16} />
          <span>{gameState.defense}</span>
        </div>
      </div>
      
      {/* Auto-click status */}
      {gameState.skills.autoClick > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <div className="text-white text-sm">
            🤖 Auto-klik: {gameState.autoClick ? 'WŁĄCZONY' : 'WYŁĄCZONY'}
          </div>
          <button
            onClick={onToggleAutoClick}
            className={`px-3 py-1 rounded text-xs ${
              gameState.autoClick 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {gameState.autoClick ? '⏸️' : '▶️'}
          </button>
        </div>
      )}
      
      {/* Pasek doświadczenia */}
      <div className="mt-4">
        <div className="flex justify-between text-white text-xs mb-1">
          <span>Doświadczenie</span>
          <span>{gameState.experience}/{Math.min(gameState.experienceToNext, 10000)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((gameState.experience / gameState.experienceToNext) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Materiały */}
      <div className="mt-4">
        <div className="text-white text-sm mb-2">Materiały:</div>
        <div className="grid grid-cols-7 gap-2 text-white text-xs">
          <div>🪵 {gameState.materials.wood || 0}</div>
          <div>⚙️ {gameState.materials.iron || 0}</div>
          <div>🔩 {gameState.materials.steel || 0}</div>
          <div>🌟 {gameState.materials.mithril || 0}</div>
          <div>💠 {gameState.materials.adamant || 0}</div>
          <div>💎 {gameState.materials.gems || 0}</div>
          <div>✨ {gameState.materials.essence || 0}</div>
        </div>
      </div>
    </div>
  );
}
