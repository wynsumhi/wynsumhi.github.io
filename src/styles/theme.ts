import { createTheme } from '@mui/material/styles';

// 전체 앱의 디자인 규칙을 정의
export const theme = createTheme({
  // 색상 팔레트
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', 
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
    },
    text: {
      primary: '#1f2937', 
      secondary: '#6b7280',
    },
  },
  
  // 글꼴 설정
  typography: {
    fontFamily: [
      'Pretendard',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(','),
    
    // 각 텍스트 크기별 스타일
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
  },
  
  // 컴포넌트별 기본 스타일 오버라이드
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 버튼 텍스트 대문자 변환 끄기
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
  },
});