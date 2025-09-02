import React from "react";

const Footer = () => {
  return (
    <footer className="bottom-0 border-t bg-gray-50 py-10 flex justify-center text-center items-center">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl border bg-white shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="text-muted-foreground text-sm">
            Made with <span className="text-red-500">❤️</span> by Lakshit Jain
          </span>
          <div className="flex gap-2 text-center justify-center items-center">
            <a
              href="https://www.linkedin.com/in/lakshitjain/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <button
                type="button"
                className="rounded-full bg-blue-100 hover:bg-blue-200 p-2 transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#0A66C2" />
                  <path
                    d="M7.75 9.5V16.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <ellipse
                    cx="7.75"
                    cy="7.75"
                    rx="1.25"
                    ry="1.25"
                    fill="white"
                  />
                  <path
                    d="M11.25 12.25V16.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.25 13.75C11.25 12.6454 12.1454 11.75 13.25 11.75C14.3546 11.75 15.25 12.6454 15.25 13.75V16.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </a>
            <a
              href="https://github.com/lakshitcodes/smart-split"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <button
                type="button"
                className="rounded-full bg-gray-100 hover:bg-gray-200 p-2 transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#181717" />
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 16.418 5.065 20.064 9.026 21.25C9.526 21.337 9.726 21.037 9.726 20.772C9.726 20.537 9.717 19.887 9.712 19.037C6.73 19.637 6.14 17.637 6.14 17.637C5.682 16.437 5.047 16.137 5.047 16.137C4.147 15.537 5.117 15.55 5.117 15.55C6.117 15.625 6.647 16.587 6.647 16.587C7.527 18.087 8.977 17.637 9.547 17.387C9.637 16.662 9.926 16.162 10.247 15.912C7.997 15.662 5.617 14.762 5.617 10.537C5.617 9.337 6.047 8.387 6.747 7.637C6.637 7.387 6.267 6.237 6.857 4.737C6.857 4.737 7.777 4.462 9.707 5.75C10.587 5.487 11.527 5.362 12.467 5.357C13.407 5.362 14.347 5.487 15.227 5.75C17.157 4.462 18.077 4.737 18.077 4.737C18.667 6.237 18.297 7.387 18.187 7.637C18.887 8.387 19.317 9.337 19.317 10.537C19.317 14.777 16.927 15.662 14.667 15.912C15.087 16.262 15.467 16.962 15.467 18.012C15.467 19.462 15.457 20.487 15.457 20.772C15.457 21.037 15.657 21.342 16.167 21.25C20.127 20.064 23.192 16.418 23.192 12C23.192 6.477 18.523 2 12 2Z"
                    fill="white"
                  />
                </svg>
              </button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
