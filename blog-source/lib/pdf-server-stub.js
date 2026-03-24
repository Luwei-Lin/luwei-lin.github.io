// Server-side stub for @react-pdf/renderer.
// The real package runs React-context code at module init, which crashes
// during Next.js static prerendering. All actual PDF usage is behind
// ssr:false dynamic imports and never executes server-side.
export const StyleSheet = { create: (s) => s };
export const Document = () => null;
export const Page = () => null;
export const View = () => null;
export const Text = () => null;
export const Link = () => null;
export const Image = () => null;
export const PDFViewer = () => null;
export const PDFDownloadLink = () => null;
export const BlobProvider = () => null;
export const Font = { register: () => {}, registerHyphenationCallback: () => {} };
export const pdf = () => ({ toBlob: () => Promise.resolve(null) });
export default {};
