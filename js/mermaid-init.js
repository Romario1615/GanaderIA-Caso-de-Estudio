import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#0f2b12',
    primaryBorderColor: '#4caf50',
    primaryTextColor: '#e8f5e9',
    lineColor: '#66bb6a',
    secondaryColor: '#081a09',
    tertiaryColor: '#0a200c',
    clusterBkg: '#060e07',
    clusterBorder: '#388e3c',
    titleColor: '#a5d6a7',
    edgeLabelBackground: '#060e07',
    nodeTextColor: '#e8f5e9'
  }
});
window.mermaid = mermaid;
