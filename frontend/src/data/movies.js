if (!localStorage.getItem('movies')) {
  const movies = [
    {
      id: 16,
      preview_img: '/preview_imgs/birds2.png',
      preview_img_alt:
        'A man stands inside a giant birdcage, watched over by looming birds.',
      title: 'Birds 2: Rebird',
      description:
        "Experience the chilling legacy in 'Birds 2: Rebird,' an unearthed sequel to Alfred Hitchcock's timeless classic.",
      sessions: ['11:00', '15:30', '19:00', '20:40'],
    },
    {
      id: 1,
      preview_img: '/preview_imgs/rain_and_bokeh.png',
      preview_img_alt:
        'A figure walks away from a rain streaked camera, into a foggy neon city street.',
      title: 'Rain and Bokeh',
      description:
        'Explore the art and craft of filmmaking in this captivating documentary.',
      sessions: ['11:00', '13:00', '17:00', '21:20'],
    },
    {
      id: 2,
      preview_img: '/preview_imgs/sad_in_paris.png',
      preview_img_alt:
        'On the docks, a woman in warm cap and coat stares directly to the camera..',
      title: 'Sad in Paris',
      description:
        'Laughter and melancholy intertwine in this unusual satire set in the City of Light.',
      sessions: ['10:00', '13:10', '19:30', '20:30', '21:00'],
    },
    {
      id: 3,
      preview_img: '/preview_imgs/down.png',
      preview_img_alt:
        'A cartoon girl sits in her attic, looking up wistfully.',
      title: 'Down',
      description:
        "In this heartwarming sequel, Lucy discovers the power of resilience and the beauty in life's most challenging moments.",
      sessions: ['10:00', '11:30', '12:50', '15:00', '17:30', '19:00'],
    },
    {
      id: 4,
      preview_img: '/preview_imgs/apatosaurus.png',
      preview_img_alt:
        'A man stands in the centre of a cheerful pastel dinosaur museum.',
      title: 'The Apatosaurus Appreciation Society',
      description:
        'An idiosyncratic curator revives a forgotten museum honoring the majestic Apatosaurus.',
      sessions: ['9:50', '11:00', '13:30', '15:00', '17:30', '19:00', '20:00'],
    },
    {
      id: 5,
      preview_img: '/preview_imgs/slow_train.png',
      preview_img_alt: 'A woman leans against the inside of a train window.',
      title: 'Slow Train',
      description:
        'A solitary traveler takes a seemingly endless train ride, but not all is as it might seem.',
      sessions: ['10:40', '11:40', '21:00'],
    },
    {
      id: 6,
      preview_img: '/preview_imgs/tokyo.png',
      title: 'Tokyo Psybercycho 2043',
      description:
        'A relentless cyber-enhanced detective, Yohei Sato, is confronted with a new breed of criminal.',
      sessions: ['19:40', '20:10', '21:30'],
    },
    {
      id: 7,
      preview_img: '/preview_imgs/christmas_ham.png',
      preview_img_alt: 'A young couple wearing Christmas hats stop for a kiss.',
      title: 'Christmas Ham',
      description:
        'Hallmark Christmas Movie of the Year, starring an AI generated young Tom Hanks.',
      sessions: ['12:00', '14:00', '16:00', '18:30', '20:20'],
    },
    {
      id: 14,
      preview_img: '/preview_imgs/enigma.png',
      preview_img_alt: 'A woman wearing a dark shawl in the rain.',
      title: 'Cloaked in Destiny',
      description:
        "Step into a world of 80s-style enchantment with 'Cloaked in Destiny,' a fantasy film that harks back to the era of Excalibur.",
      sessions: ['11:15', '21:20'],
    },
    {
      id: 8,
      preview_img: '/preview_imgs/gone_potty.png',
      preview_img_alt: 'A cartoon boy is half-transformed into a toilet.',
      title: 'Gone Potty',
      description:
        'A young boy must conquer the ultimate challenge: toilet training.',
      sessions: ['10:20', '11:50', '13:10', '15:20', '17:50', '19:20'],
    },
    {
      id: 9,
      preview_img: '/preview_imgs/mr_ping.png',
      preview_img_alt:
        'In a party, a man wearing a business suit dances and balances a wine glass on his elbow.',
      title: 'Mr. Ping',
      description:
        'A high-flying executive lives for the neon-lit world of raves, precariously balancing the boardroom and the dance floor.',
      sessions: ['19:00', '20:00', '21:00'],
    },
    {
      id: 15,
      preview_img: '/preview_imgs/elegy.png',
      title: 'Elegy of the Crown',
      description:
        "'Elegy of the Crown' paints a portrait of a prince's emotional journey, exploring the cost of a crown and the pursuit of his own happiness amidst the echoes of ancient traditions.",
      sessions: ['9:50', '15:00', '20:10'],
    },
    {
      id: 10,
      preview_img: '/preview_imgs/friends_on_the_savannah.png',
      preview_img_alt: 'A group of giraffes, close up.',
      title: 'Friends on the Savannah',
      description:
        'Discover the captivating world of giraffes in this stunning documentary.',
      sessions: ['10:15', '12:15', '14:30', '17:00', '20:00'],
    },
    {
      id: 0,
      preview_img: '/preview_imgs/old_timey.png',
      preview_img_alt: 'Two old-timey types look up at the sky.',
      title: 'Skybound Shadows',
      description: 'Tensions rise under the vast expanse of the frontier sky.',
      sessions: ['14:00', '19:40'],
    },
    {
      id: 11,
      preview_img: '/preview_imgs/camel_up.png',
      preview_img_alt:
        'A chess-like board game lies on the sand, before a man on a caamel.',
      title: 'Camel Up',
      description:
        "Roll the dice and join the zany race in 'Camel Up,' a movie adaptation of the beloved board game.",
      sessions: ['14:30', '16:50', '19:50'],
    },
    {
      id: 12,
      preview_img: '/preview_imgs/full_stack_the_movie.png',
      preview_img_alt: 'A bespectacled hacker lurks over his computers.',
      title: 'Full Stack: The Movie',
      description:
        'From coding marathons to quirky office dynamics, this film offers a glimpse into the world of full stack web development.',
      sessions: ['14:40', '17:50', '19:00', '21:00'],
    },
    {
      id: 13,
      preview_img: '/preview_imgs/peas.png',
      preview_img_alt: 'A pouty British boy sits at a school dining table.',
      title: 'Peas',
      description:
        'This mischievous British film centres on a group of young schoolboys who find themselves the constant targets of pranks.',
      sessions: ['10:10', '11:40', '13:30', '16:00', '19:00'],
    },
  ];
  localStorage.setItem('movies', JSON.stringify(movies));
}
// Promise to mock an API call
const fetchAllMovies = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movies = JSON.parse(localStorage.getItem('movies'));
      resolve(movies);
    }, 100);
  });
};

export { fetchAllMovies };
