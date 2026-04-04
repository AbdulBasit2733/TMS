
export const LogoIcon = ({width = 28, height = 28}: {width?: number, height?: number}) => (
  <svg width={width} height={height} viewBox="0 0 28 28" fill="none" aria-label="TaskFlow">
    <rect width="28" height="28" rx="7" fill="oklch(0.70 0.19 43)"/>
    <path d="M8 14.5l4 4 8-9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="8" y="7" width="5" height="1.5" rx="0.75" fill="white" opacity="0.5"/>
    <rect x="8" y="10" width="7" height="1.5" rx="0.75" fill="white" opacity="0.35"/>
  </svg>
)
export const ArrowRightIcon = ({width = 16, height = 16}: {width?: number, height?: number}) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
export const TaskIcon = ({width = 22, height = 22}: {width?: number, height?: number}) => (
  <svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <path d="M4 11.5l4.5 4.5L18 6" stroke="oklch(0.70 0.19 43)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="1.5" y="1.5" width="19" height="19" rx="4" stroke="oklch(0.70 0.19 43)" strokeWidth="1.5" opacity="0.4"/>
  </svg>
)
export const LockIcon = ({width = 22, height = 22}: {width?: number, height?: number}) => (
  <svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <rect x="3" y="9.5" width="16" height="11" rx="3" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75"/>
    <path d="M7.5 9.5V7a3.5 3.5 0 017 0v2.5" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75" strokeLinecap="round"/>
    <circle cx="11" cy="15" r="1.5" fill="oklch(0.70 0.19 43)"/>
  </svg>
)
export const SearchIcon = ({width = 22, height = 22}: {width?: number, height?: number}) => (
  <svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <circle cx="10" cy="10" r="6.5" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75"/>
    <path d="M14.5 14.5L19 19" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
)
export const CalendarIcon = ({width = 22, height = 22}: {width?: number, height?: number}) => (
  <svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <rect x="2" y="4" width="18" height="16" rx="3" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75"/>
    <path d="M2 9h18" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75"/>
    <path d="M7 2v4M15 2v4" stroke="oklch(0.70 0.19 43)" strokeWidth="1.75" strokeLinecap="round"/>
    <rect x="6" y="12" width="3.5" height="3.5" rx="0.75" fill="oklch(0.70 0.19 43)" opacity="0.7"/>
  </svg>
)
export const ChartIcon = ({width = 22, height = 22}: {width?: number, height?: number}) => (
  <svg width={width} height={height} viewBox="0 0 22 22" fill="none">
    <rect x="2" y="12" width="4" height="8" rx="1.5" fill="oklch(0.70 0.19 43)" opacity="0.4"/>
    <rect x="9" y="7" width="4" height="13" rx="1.5" fill="oklch(0.70 0.19 43)" opacity="0.7"/>
    <rect x="16" y="2" width="4" height="18" rx="1.5" fill="oklch(0.70 0.19 43)"/>
  </svg>
)