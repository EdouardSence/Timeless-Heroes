/**
 * NotificationBanner — Pure presentational component
 * Displays a notification toast when present.
 */

import React, { memo } from 'react';

import { styles } from '../styles';

interface NotificationBannerProps {
  message: string | null;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = memo(
  function NotificationBanner({ message }) {
    if (!message) return null;
    return <div style={styles.notification}>{message}</div>;
  },
);
