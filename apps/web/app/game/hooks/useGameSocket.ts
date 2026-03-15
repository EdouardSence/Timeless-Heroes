/**
 * useGameSocket — Custom hook for Socket.IO game connection
 *
 * Encapsulates ALL side effects:
 * - Socket.IO connection/disconnection lifecycle
 * - Keyboard event listeners
 * - Leaderboard polling
 * - Shop item derivation from game state
 *
 * Returns a pure data object consumed by presentational components.
 */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IShopItem, SHOP_ITEMS, WebSocketEvent } from '@repo/shared-types';

import { calculateCost, formatNumber } from '../helpers';
import { GameState, LeaderboardEntry, ShopItem, TabId } from '../types';

const INITIAL_GAME_STATE: GameState = {
  experience: 0,
  experienceToNext: 100,
  items: {},
  level: 1,
  linesOfCode: 0,
  multiplier: 1,
  passiveRate: 0,
  totalKeyPresses: 0,
};

export interface UseGameSocketReturn {
  activeTab: TabId;
  connected: boolean;
  gameState: GameState;
  items: ShopItem[];
  leaderboard: LeaderboardEntry[];
  notification: string | null;
  expProgress: number;
  setActiveTab: (tab: TabId) => void;
  purchaseItem: (slug: string) => void;
  sendKeyPress: () => void;
}

export function useGameSocket(): UseGameSocketReturn {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('shop');
  const [notification, setNotification] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // ── Notification helper ──────────────────────────────────────────────
  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // ── Socket.IO lifecycle ──────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    const socket = io('http://localhost:3000/game', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to game server via Socket.IO');
      // Request leaderboard immediately on connect
      socket.emit('GET_LEADERBOARD', { type: 'GLOBAL', count: 50 });
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from game server');
    });

    socket.on('connect_error', (err: Error) => {
      setConnected(false);
      console.error('Socket.IO connection error:', err.message);
    });

    socket.on(
      WebSocketEvent.BALANCE_UPDATE,
      (data: {
        linesOfCode?: string;
        level?: number;
        clickMultiplier?: number;
        passiveMultiplier?: number;
      }) => {
        setGameState((prev) => ({
          ...prev,
          linesOfCode: parseFloat(data.linesOfCode || '0') || prev.linesOfCode,
          level: data.level ?? prev.level,
          multiplier: data.clickMultiplier ?? prev.multiplier,
          passiveRate: data.passiveMultiplier ?? prev.passiveRate,
        }));
      },
    );

    socket.on(
      WebSocketEvent.CLICK_PROCESSED,
      (result: {
        newBalance?: string;
        multipliers?: { totalMultiplier?: number };
      }) => {
        setGameState((prev) => ({
          ...prev,
          linesOfCode: parseFloat(result.newBalance || '0') || prev.linesOfCode,
          totalKeyPresses: prev.totalKeyPresses + 1,
          multiplier: result.multipliers?.totalMultiplier ?? prev.multiplier,
        }));
      },
    );

    socket.on(
      WebSocketEvent.ITEM_PURCHASED,
      (result: {
        success: boolean;
        newBalance?: string;
        itemSlug?: string;
        newQuantityOwned?: number;
        error?: string;
      }) => {
        if (result.success) {
          setGameState((prev) => ({
            ...prev,
            linesOfCode:
              parseFloat(result.newBalance || '0') || prev.linesOfCode,
            items: {
              ...prev.items,
              [result.itemSlug || '']: result.newQuantityOwned || 0,
            },
          }));
          showNotification('Achat effectue !');
        } else {
          showNotification(
            `Echec de l'achat: ${result.error || 'Erreur inconnue'}`,
          );
        }
      },
    );

    socket.on(
      WebSocketEvent.LEADERBOARD_UPDATE,
      (data: { entries?: LeaderboardEntry[] }) => {
        if (data.entries) {
          setLeaderboard(data.entries);
        }
      },
    );

    socket.on(
      WebSocketEvent.OFFLINE_REWARDS,
      (data: { earnedLoc?: string }) => {
        const earnedLoc = parseFloat(data.earnedLoc || '0') || 0;
        if (earnedLoc > 0) {
          showNotification(
            `Recompenses hors-ligne : +${formatNumber(earnedLoc)} LoC !`,
          );
          setGameState((prev) => ({
            ...prev,
            linesOfCode: prev.linesOfCode + earnedLoc,
          }));
        }
      },
    );

    socket.on(WebSocketEvent.SHOP_CATALOG, (data: unknown) => {
      console.log('Shop catalog received:', data);
    });

    socket.on(
      WebSocketEvent.ERROR,
      (err: { code?: string; message?: string }) => {
        console.error('Server error:', err);
        if (err.code === 'AUTH_REQUIRED' || err.code === 'AUTH_FAILED') {
          showNotification(
            'Authentification requise. Veuillez vous connecter.',
          );
        }
      },
    );

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [showNotification]);

  // ── Derive shop items from game state (memoized) ────────────────────
  const items = useMemo<ShopItem[]>(() => {
    return SHOP_ITEMS.map((item: IShopItem) => {
      const owned = gameState.items[item.id] || 0;
      const nextCost = calculateCost(item.baseCost, item.costMultiplier, owned);
      return {
        slug: item.id,
        name: item.name,
        baseCost: item.baseCost,
        owned,
        nextCost,
        canAfford: gameState.linesOfCode >= nextCost,
        icon: item.icon,
        effect: item.description,
      };
    });
  }, [gameState]);

  // ── Key press handler ────────────────────────────────────────────────
  const sendKeyPress = useCallback(() => {
    if (!socketRef.current?.connected) {
      showNotification('Non connecte au serveur');
      return;
    }
    socketRef.current.emit(WebSocketEvent.KEY_PRESS, {
      keyType: 'NORMAL',
      timestamp: Date.now(),
    });
  }, [showNotification]);

  // ── Keyboard listener ────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
      sendKeyPress();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendKeyPress]);

  // ── Purchase handler ─────────────────────────────────────────────────
  const purchaseItem = useCallback(
    (slug: string) => {
      if (!socketRef.current?.connected) {
        showNotification('Non connecte au serveur');
        return;
      }
      socketRef.current.emit(WebSocketEvent.PURCHASE_ITEM, {
        itemSlug: slug,
        quantity: 1,
      });
      showNotification('Achat en cours...');
    },
    [showNotification],
  );

  // ── Leaderboard polling ──────────────────────────────────────────────
  const requestLeaderboard = useCallback(() => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('GET_LEADERBOARD', { type: 'GLOBAL', count: 50 });
  }, []);

  useEffect(() => {
    if (activeTab !== 'leaderboard') return;
    requestLeaderboard();
    const interval = setInterval(requestLeaderboard, 15_000);
    return () => clearInterval(interval);
  }, [activeTab, requestLeaderboard]);

  // ── Derived values ───────────────────────────────────────────────────
  const expProgress =
    gameState.experienceToNext > 0
      ? (gameState.experience / gameState.experienceToNext) * 100
      : 0;

  return {
    activeTab,
    connected,
    gameState,
    items,
    leaderboard,
    notification,
    expProgress,
    setActiveTab,
    purchaseItem,
    sendKeyPress,
  };
}
