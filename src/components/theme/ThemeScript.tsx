export function ThemeScript() {
  const code = `
    try {
      var theme = window.localStorage.getItem('auraconvert-theme');
      if (theme && theme !== 'light') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
