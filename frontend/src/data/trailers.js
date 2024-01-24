const trailers = [
  {
    src: 'https://www.youtube.com/embed/pBk4NYhWNMM?autoplay=1&mute=1&autohide=1&showinfo=0&controls=0',
    title: 'The Barbie movie trailer',
    length: 161,
  },
  {
    src: 'https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1&mute=1&autohide=1&showinfo=0&controls=0',
    title: 'The Oppenheimer movie trailer',
    length: 186,
  },
];
// Mock database
export function fetchTrailers() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100, trailers);
  });
}
