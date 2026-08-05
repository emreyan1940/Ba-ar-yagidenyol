@import "tailwindcss";

@layer base {
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: #f8fafc;
    color: #0f172a;
  }
  html.dark body, body.dark {
    background-color: #0a0a0a;
    color: #e0e0e0;
  }
  h1, h2, h3, .font-serif {
    font-family: 'Playfair Display', Georgia, serif;
  }
}

@layer utilities {
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
}
