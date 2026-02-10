import "./App.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Pretendard",
      "-apple-system",
      "BlinkMacSystemFont",
      "system-ui",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* MUI의 기본 스타일을 초기화 */}
      <div>
        <h1>portfolio</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
