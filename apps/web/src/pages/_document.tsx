import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />

          <meta
            name="description"
            content="A home inventory app to keep track of items in your home (food items, tech, medical supplies, etc.)."
          />
          <meta
            property="og:description"
            content="A home inventory app to keep track of items in your home (food items, tech, medical supplies, etc.)."
          />
          <meta
            name="twitter:description"
            content="A home inventory app to keep track of items in your home (food items, tech, medical supplies, etc.)."
          />
        </Head>

        <body>
          {/* "fix" FOUC */}
          <script>0</script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
