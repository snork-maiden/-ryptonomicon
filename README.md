# Cryptonomicon 

Cryptonomicon is a real-time web-based application to monitor the latest prices of various cryptocurrencies.

## Key Features

- **Real-time tracking:** Track the live courses of various cryptocurrencies. The data is obtained through WebSockets, HTTP is used as a backup method for fetching data.
- **User Preferences:** Users can select specific cryptocurrencies to track. Chosen filters will be saved in the URL,  chosen currencies will be saved to Local storage.
- **Graphical Representation**  of selected cryptocurrency cource.
- **Clickable Clues** with cryptocurrency names are available for quick reference.
- **Pagination**
- **Form Validation:** Secure and reliable data input is maintained through form validation.

## Tech Stack

- Vue 3 (Options API)
- Vite
- Tailwind CSS

## Installation

1. Install the required dependencies:

    ```bash
    npm install
    ```

2. Run the project:

    ```bash
    npm run dev
    ```

3. Compile and minify for production

    ```bash
    npm run build
    ```

Enjoy tracking your favourite cryptocurrencies with Cryptonomicon!
