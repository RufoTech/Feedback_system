import type React from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

/**
 * Renders children into document.body using a React portal.
 * This ensures modals/overlays are outside any overflow/scroll containers,
 * so fixed positioning and z-index work correctly across the full viewport.
 */
export const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
  return createPortal(children, document.body);
};
