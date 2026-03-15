/**
 * ShopPanel — Pure presentational component
 * Renders the grid of purchasable shop items.
 */

import React, { memo } from 'react';

import { formatNumber } from '../helpers';
import { styles } from '../styles';
import { ShopItem } from '../types';

interface ShopPanelProps {
  connected: boolean;
  items: ShopItem[];
  onPurchase: (slug: string) => void;
}

export const ShopPanel: React.FC<ShopPanelProps> = memo(function ShopPanel({
  connected,
  items,
  onPurchase,
}) {
  return (
    <div style={styles.shopGrid}>
      {items.map((item) => (
        <div
          key={item.slug}
          style={{
            ...styles.shopItem,
            ...(item.canAfford ? styles.affordable : styles.locked),
          }}
        >
          <div style={styles.itemIcon}>{item.icon}</div>
          <div style={styles.itemInfo}>
            <h3 style={styles.itemName}>{item.name}</h3>
            <p style={styles.itemEffect}>{item.effect}</p>
            <p style={styles.itemOwned}>Possede: {item.owned}</p>
          </div>
          <button
            style={{
              ...styles.buyButton,
              ...(item.canAfford ? {} : styles.buyButtonDisabled),
            }}
            disabled={!item.canAfford || !connected}
            onClick={() => {
              onPurchase(item.slug);
            }}
          >
            {formatNumber(item.nextCost)} LoC
          </button>
        </div>
      ))}
    </div>
  );
});
