import { useMediaQuery } from "@/hooks/useResponsive";
import React from "react";

interface ResponsiveProps {
  children: React.ReactNode;
}

// Component for mobile-only content
export const Mobile: React.FC<ResponsiveProps> = ({ children }) => {
  const { showOnMobile } = useMediaQuery();
  return showOnMobile ? <>{children}</> : null;
};

// Component for tablet-only content
export const Tablet: React.FC<ResponsiveProps> = ({ children }) => {
  const { showOnTablet } = useMediaQuery();
  return showOnTablet ? <>{children}</> : null;
};

// Component for desktop-only content
export const Desktop: React.FC<ResponsiveProps> = ({ children }) => {
  const { showOnDesktop } = useMediaQuery();
  return showOnDesktop ? <>{children}</> : null;
};

// Component for web-only content (any screen size on web)
export const Web: React.FC<ResponsiveProps> = ({ children }) => {
  const { showOnWebOnly } = useMediaQuery();
  return showOnWebOnly ? <>{children}</> : null;
};

// Component for native-only content (iOS/Android)
export const Native: React.FC<ResponsiveProps> = ({ children }) => {
  const { showOnNativeOnly } = useMediaQuery();
  return showOnNativeOnly ? <>{children}</> : null;
};

// Main responsive component that can show/hide based on breakpoints
interface ResponsiveComponentProps {
  children: React.ReactNode;
  show?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
    web?: boolean;
    native?: boolean;
  };
  hide?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
    web?: boolean;
    native?: boolean;
  };
}

export const Responsive: React.FC<ResponsiveComponentProps> = ({
  children,
  show,
  hide,
}) => {
  const {
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
    showOnMobile,
    showOnTablet,
    showOnDesktop,
    showOnWebOnly,
    showOnNativeOnly,
  } = useMediaQuery();

  // If show prop is provided, only show on specified breakpoints
  if (show) {
    const shouldShow =
      (show.mobile && showOnMobile) ||
      (show.tablet && showOnTablet) ||
      (show.desktop && showOnDesktop) ||
      (show.web && showOnWebOnly) ||
      (show.native && showOnNativeOnly);

    return shouldShow ? <>{children}</> : null;
  }

  // If hide prop is provided, hide on specified breakpoints
  if (hide) {
    const shouldHide =
      (hide.mobile && isMobile) ||
      (hide.tablet && isTablet) ||
      (hide.desktop && isDesktop) ||
      (hide.web && isWeb) ||
      (hide.native && !isWeb);

    return shouldHide ? null : <>{children}</>;
  }

  // Default: show on all breakpoints
  return <>{children}</>;
};

export default {
  Mobile,
  Tablet,
  Desktop,
  Web,
  Native,
  Responsive,
};
