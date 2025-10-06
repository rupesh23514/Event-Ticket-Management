// Sample event data for the application
const eventData = [
  {
    _id: "tamilnadu1",
    title: "Chennai Music Festival 2025",
    name: "Chennai Music Festival 2025",
    description: "Experience the rich culture of Tamil Nadu with traditional and contemporary music performances in the heart of Chennai.",
    longDescription: "Experience the rich culture of Tamil Nadu with traditional and contemporary music performances in the heart of Chennai. The Chennai Music Festival brings together the finest musicians and performers to showcase the vibrant musical heritage of South India.\n\nFrom classical Carnatic music to modern Tamil film songs, this festival offers a diverse range of performances by both established masters and emerging talents. Special performances will include traditional instruments such as veena, mridangam, and flute, alongside fusion performances that blend classical traditions with contemporary sounds.\n\nSet in a beautiful open-air venue, this festival will be a celebration of Tamil culture, music, and artistry that appeals to audiences of all ages and backgrounds.",
    location: {
      address: "Marina Beach Road",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      zipCode: "600001"
    },
    venue: "Chennai Cultural Center",
    eventDate: "2025-12-10T16:00:00.000Z",
    dateTime: "2025-12-10T16:00:00.000Z",
    endDateTime: "2025-12-12T22:00:00.000Z",
    category: "Entertainment",
    language: "Tamil",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1504704911898-68304a7d2807",
    ticketPrice: 1500,
    availableSeats: 300,
    ticketsAvailable: 300,
    seatingType: "general",
    organizer: {
      name: "Tamil Arts Foundation",
      email: "info@tamilarts.org",
      since: "2010"
    },
    artists: [
      {
        name: "Anirudh Ravichander",
        role: "Headlining Artist",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
      },
      {
        name: "Sanjana Group",
        role: "Classical Ensemble",
        image: "https://images.unsplash.com/photo-1460036521480-ff49c08c2781"
      }
    ]
  },
  {
    _id: "tamilnadu2",
    title: "Coimbatore Tech Summit",
    name: "Coimbatore Tech Summit",
    description: "Join the largest technology conference in Tamil Nadu showcasing innovation, startups, and digital transformation.",
    longDescription: "Join the largest technology conference in Tamil Nadu showcasing innovation, startups, and digital transformation. The Coimbatore Tech Summit brings together industry leaders, entrepreneurs, developers, and investors to explore the latest trends and opportunities in technology.\n\nThe summit will feature keynote speeches from tech industry visionaries, panel discussions on emerging technologies, workshops for skills development, and a startup showcase highlighting the most promising new ventures from the region. Topics covered will include artificial intelligence, smart manufacturing, sustainable technology, and the future of work.\n\nNetworking opportunities will connect attendees with potential partners, mentors, and investors, making this an essential event for anyone involved in Tamil Nadu's rapidly growing tech ecosystem.",
    location: {
      address: "76 Avinashi Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      country: "India",
      zipCode: "641018"
    },
    venue: "Codissia Trade Complex",
    eventDate: "2025-09-05T09:00:00.000Z",
    dateTime: "2025-09-05T09:00:00.000Z",
    endDateTime: "2025-09-07T18:00:00.000Z",
    category: "Technology",
    language: "English",
    ageRestriction: "18+",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    ticketPrice: 2500,
    availableSeats: 500,
    ticketsAvailable: 500,
    seatingType: "general",
    organizer: {
      name: "TamilTech Association",
      email: "info@tamiltech.org",
      since: "2018"
    },
    artists: []
  },
  {
    _id: "tamilnadu3",
    title: "Madurai Food Festival",
    name: "Madurai Food Festival",
    description: "Taste the authentic flavors of Tamil Nadu cuisine featuring traditional dishes, street food, and culinary demonstrations.",
    longDescription: "Taste the authentic flavors of Tamil Nadu cuisine featuring traditional dishes, street food, and culinary demonstrations at the heart of the temple city. The Madurai Food Festival celebrates the rich and diverse culinary heritage of Tamil Nadu, with special focus on traditional Madurai specialties.\n\nVisitors can sample a wide variety of dishes including dosas, idlis, vadas, different types of biryani, and the famous Madurai Jigarthanda. The festival features over 100 food stalls representing different regions and cooking styles from across Tamil Nadu, alongside cooking demonstrations by renowned chefs and home cooks sharing family recipes passed down through generations.\n\nCultural performances and live music will complement the culinary experience, making this a comprehensive celebration of Tamil Nadu's food culture and traditions.",
    location: {
      address: "Tamukkam Ground",
      city: "Madurai",
      state: "Tamil Nadu",
      country: "India",
      zipCode: "625020"
    },
    venue: "Tamukkam Exhibition Center",
    eventDate: "2025-11-15T11:00:00.000Z",
    dateTime: "2025-11-15T11:00:00.000Z",
    endDateTime: "2025-11-17T22:00:00.000Z",
    category: "Food & Drink",
    language: "Tamil",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    ticketPrice: 300,
    availableSeats: 1000,
    ticketsAvailable: 1000,
    seatingType: "general",
    organizer: {
      name: "Tamil Cuisine Preservation Society",
      email: "tamilfood@example.com",
      since: "2015"
    },
    artists: []
  },
  {
    _id: "1",
    title: "Tech Conference 2025",
    name: "Tech Conference 2025",
    description: "Join us for a full day of tech talks, networking, and innovation showcases. This premier technology event brings together industry leaders, developers, and tech enthusiasts.",
    longDescription: "Join us for a full day of tech talks, networking, and innovation showcases. This premier technology event brings together industry leaders, developers, and tech enthusiasts for a day of learning and collaboration.\n\nFeatured speakers from leading technology companies will share insights on emerging trends and practical applications of cutting-edge technology. Topics include AI, blockchain, cloud computing, and more. Hands-on workshops will allow participants to gain new skills and connect with like-minded professionals.\n\nWhether you're a seasoned developer, a tech entrepreneur, or simply curious about the future of technology, Tech Conference 2025 offers something for everyone.",
    location: {
      address: "123 Tech Avenue",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zipCode: "94105"
    },
    venue: "Tech Center",
    eventDate: "2025-12-15T09:00:00.000Z",
    dateTime: "2025-12-15T09:00:00.000Z",
    endDateTime: "2025-12-15T18:00:00.000Z",
    category: "Technology",
    language: "English",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    ticketPrice: 99.99,
    availableSeats: 150,
    ticketsAvailable: 150,
    seatingType: "general",
    organizer: {
      name: "Tech Events Inc",
      email: "info@techevents.com",
      since: "2020"
    },
    artists: [
      {
        name: "Sarah Johnson",
        role: "Keynote Speaker",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
      },
      {
        name: "David Chen",
        role: "Tech Lead",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      }
    ]
  },
  {
    _id: "2",
    title: "Music Festival 2025",
    name: "Music Festival 2025",
    description: "A weekend of amazing live performances across multiple stages featuring top artists from around the world.",
    longDescription: "A weekend of amazing live performances across multiple stages featuring top artists from around the world. Experience unforgettable performances, great food, and an incredible atmosphere.\n\nWith five stages hosting over 40 artists across multiple genres, Music Festival 2025 promises something for every music lover. From rock and pop to electronic and hip-hop, the festival showcases established headliners alongside emerging talent.\n\nBeyond the music, enjoy gourmet food stalls, craft beverages, art installations, and interactive experiences throughout the festival grounds.",
    location: {
      address: "456 Music Blvd",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      zipCode: "90001"
    },
    venue: "City Amphitheater",
    eventDate: "2025-11-20T10:00:00.000Z",
    dateTime: "2025-11-20T10:00:00.000Z",
    endDateTime: "2025-11-22T23:00:00.000Z",
    category: "Entertainment",
    language: "English",
    ageRestriction: "18+",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    ticketPrice: 149.99,
    availableSeats: 500,
    ticketsAvailable: 500,
    seatingType: "general",
    organizer: {
      name: "Festival Productions",
      email: "info@festivalprods.com",
      since: "2015"
    },
    artists: [
      {
        name: "The Soundwaves",
        role: "Headliner",
        image: "https://images.unsplash.com/photo-1501612780327-45045538702b"
      },
      {
        name: "Luna Park",
        role: "Featured Artist",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
      }
    ]
  },
  {
    _id: "3",
    title: "Food & Wine Expo",
    name: "Food & Wine Expo",
    description: "Taste the best cuisines and wines from around the world. Meet celebrity chefs, attend cooking demonstrations, and sample exquisite dishes.",
    longDescription: "Taste the best cuisines and wines from around the world. Meet celebrity chefs, attend cooking demonstrations, and sample exquisite dishes and beverages.\n\nThe Food & Wine Expo brings together over 100 exhibitors showcasing culinary delights from across the globe. From fine wines and craft spirits to artisanal cheeses and gourmet desserts, discover new flavors and meet the passionate people behind them.\n\nDon't miss the live cooking demonstrations from award-winning chefs, wine tasting masterclasses, and food pairing workshops throughout the weekend.",
    location: {
      address: "789 Gourmet Street",
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60007"
    },
    venue: "Convention Center",
    eventDate: "2025-10-05T11:00:00.000Z",
    dateTime: "2025-10-05T11:00:00.000Z",
    endDateTime: "2025-10-05T20:00:00.000Z",
    category: "Food",
    language: "English",
    ageRestriction: "21+",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    ticketPrice: 75.00,
    availableSeats: 300,
    ticketsAvailable: 300,
    seatingType: "general",
    organizer: {
      name: "Gourmet Events",
      email: "info@gourmetevents.com",
      since: "2018"
    },
    artists: [
      {
        name: "Chef Maria Rodriguez",
        role: "Celebrity Chef",
        image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548"
      },
      {
        name: "Sommelier Jean Pierre",
        role: "Wine Expert",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c"
      }
    ]
  },
  {
    _id: "4",
    title: "Business Summit 2025",
    name: "Business Summit 2025",
    description: "Connect with industry leaders and innovators at this premier business networking event.",
    longDescription: "Connect with industry leaders and innovators at this premier business networking event. Business Summit 2025 brings together executives, entrepreneurs, and thought leaders for two days of insightful discussions, workshops, and networking opportunities.\n\nAttendees will gain valuable insights into emerging market trends, innovative business strategies, and leadership principles from those at the forefront of their industries. Panel discussions will cover topics such as digital transformation, sustainable business practices, and the future of work.\n\nTake advantage of structured networking sessions designed to foster meaningful connections and potential partnerships with fellow professionals and industry leaders.",
    location: {
      address: "101 Business Park",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001"
    },
    venue: "Grand Conference Hall",
    eventDate: "2025-09-18T08:00:00.000Z",
    dateTime: "2025-09-18T08:00:00.000Z",
    endDateTime: "2025-09-19T17:00:00.000Z",
    category: "Business",
    language: "English",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    ticketPrice: 129.99,
    availableSeats: 200,
    ticketsAvailable: 200,
    seatingType: "general",
    organizer: {
      name: "Business Leaders Network",
      email: "info@businessleaders.net",
      since: "2010"
    },
    artists: [
      {
        name: "Michael Robertson",
        role: "CEO, TechGlobal",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
      },
      {
        name: "Jennifer Adams",
        role: "Entrepreneur & Author",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
      }
    ]
  },
  {
    _id: "5",
    title: "Art Exhibition 2025",
    name: "Art Exhibition 2025",
    description: "Discover the work of emerging artists from around the world at this annual exhibition.",
    longDescription: "Discover the work of emerging artists from around the world at this annual exhibition. Art Exhibition 2025 showcases diverse perspectives and mediums, from painting and sculpture to digital art and installations.\n\nThis year's exhibition features over 100 artists from 30 countries, offering visitors a unique opportunity to explore contemporary art trends and purchase original works directly from creators. Themed galleries explore concepts such as 'Nature Reimagined', 'Urban Perspectives', and 'Digital Futures'.\n\nSpecial events throughout the exhibition include artist talks, hands-on workshops, and curator-led tours that provide deeper insights into the creative process and artistic vision behind the works.",
    location: {
      address: "505 Gallery Way",
      city: "Miami",
      state: "FL",
      country: "USA",
      zipCode: "33130"
    },
    venue: "Metropolitan Museum",
    eventDate: "2025-08-10T10:00:00.000Z",
    dateTime: "2025-08-10T10:00:00.000Z",
    endDateTime: "2025-08-20T19:00:00.000Z",
    category: "Arts",
    language: "Multiple",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1531243269054-5ebfd6ede5d7",
    ticketPrice: 25.00,
    availableSeats: 500,
    ticketsAvailable: 500,
    seatingType: "general",
    organizer: {
      name: "Global Arts Foundation",
      email: "exhibits@globalarts.org",
      since: "2005"
    },
    artists: [
      {
        name: "Maya Lin",
        role: "Featured Artist",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      },
      {
        name: "Carlos Medina",
        role: "Sculptor",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      }
    ]
  },
  {
    _id: "6",
    title: "Comedy Night Live",
    name: "Comedy Night Live",
    description: "Laugh the night away with performances from the country's top stand-up comedians.",
    longDescription: "Laugh the night away with performances from the country's top stand-up comedians. Comedy Night Live brings together a diverse lineup of established comics and rising stars for an unforgettable evening of humor and entertainment.\n\nFeaturing different comedy styles from observational and storytelling to improv and sketch, the show offers something for every sense of humor. The intimate venue creates an electric atmosphere where audiences can enjoy premium entertainment in a relaxed setting.\n\nArriving early is recommended to enjoy pre-show drinks and secure the best seats. The venue offers a full bar and light food options.",
    location: {
      address: "202 Laughter Lane",
      city: "Boston",
      state: "MA",
      country: "USA",
      zipCode: "02108"
    },
    venue: "City Theater",
    eventDate: "2025-07-25T19:00:00.000Z",
    dateTime: "2025-07-25T19:00:00.000Z",
    endDateTime: "2025-07-25T22:00:00.000Z",
    category: "Entertainment",
    language: "English",
    ageRestriction: "18+",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260",
    ticketPrice: 49.99,
    availableSeats: 250,
    ticketsAvailable: 250,
    seatingType: "reserved",
    organizer: {
      name: "Laugh Productions",
      email: "shows@laughproductions.com",
      since: "2012"
    },
    artists: [
      {
        name: "Jessica Miller",
        role: "Headliner",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e"
      },
      {
        name: "Tony Williams",
        role: "Featured Comedian",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      }
    ]
  },
  {
    _id: "7",
    title: "Health & Wellness Expo",
    name: "Health & Wellness Expo",
    description: "Discover the latest in health trends, fitness equipment, and wellness practices.",
    longDescription: "Discover the latest in health trends, fitness equipment, and wellness practices at the Health & Wellness Expo. This comprehensive event brings together experts and vendors from across the health and wellness industry to share knowledge, demonstrate products, and offer services to attendees.\n\nExplore exhibits featuring fitness innovations, nutrition supplements, mental health resources, alternative medicine practices, and sustainable wellness products. Throughout the day, attend workshops and demonstrations covering topics such as yoga and meditation, healthy cooking, stress management, and fitness routines for all ability levels.\n\nConsultations with health professionals will be available, including nutritionists, personal trainers, and wellness coaches, offering personalized advice and recommendations.",
    location: {
      address: "303 Wellness Way",
      city: "Denver",
      state: "CO",
      country: "USA",
      zipCode: "80202"
    },
    venue: "Community Center",
    eventDate: "2025-06-12T09:00:00.000Z",
    dateTime: "2025-06-12T09:00:00.000Z",
    endDateTime: "2025-06-12T17:00:00.000Z",
    category: "Health",
    language: "English",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    ticketPrice: 15.00,
    availableSeats: 400,
    ticketsAvailable: 400,
    seatingType: "general",
    organizer: {
      name: "Wellness Network",
      email: "expo@wellnessnetwork.org",
      since: "2017"
    },
    artists: [
      {
        name: "Dr. Lisa Chen",
        role: "Nutritionist",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
      },
      {
        name: "Marcus Johnson",
        role: "Fitness Expert",
        image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f"
      }
    ]
  },
  {
    _id: "8",
    title: "Film Festival 2025",
    name: "Film Festival 2025",
    description: "A celebration of cinema featuring international films, director talks, and premieres.",
    longDescription: "A celebration of cinema featuring international films, director talks, and premieres. Film Festival 2025 showcases over 100 feature films, documentaries, and short films from more than 40 countries, highlighting both established and emerging filmmakers.\n\nThe festival program includes world premieres, award-winning international selections, and thought-provoking documentaries across multiple venues throughout the city. Special sections focus on independent cinema, animation, documentary filmmaking, and emerging technologies in visual storytelling.\n\nEnhance your festival experience with exclusive Q&A sessions with directors and cast members, panel discussions on industry trends, and networking events connecting film enthusiasts, creators, and industry professionals.",
    location: {
      address: "404 Cinema Street",
      city: "Austin",
      state: "TX",
      country: "USA",
      zipCode: "78701"
    },
    venue: "Downtown Theater",
    eventDate: "2025-05-20T10:00:00.000Z",
    dateTime: "2025-05-20T10:00:00.000Z",
    endDateTime: "2025-05-25T23:00:00.000Z",
    category: "Entertainment",
    language: "Multiple",
    ageRestriction: "Varies by film",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    ticketPrice: 35.00,
    availableSeats: 200,
    ticketsAvailable: 200,
    seatingType: "reserved",
    organizer: {
      name: "Independent Cinema Association",
      email: "festival@indiecinema.org",
      since: "2008"
    },
    artists: [
      {
        name: "Isabella Martinez",
        role: "Festival Director",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
      },
      {
        name: "Robert Lee",
        role: "Featured Director",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
      }
    ]
  },
  {
    _id: "9",
    title: "Home & Garden Show",
    name: "Home & Garden Show",
    description: "Get inspired with the latest home decor trends, gardening tips, and renovation ideas.",
    longDescription: "Get inspired with the latest home decor trends, gardening tips, and renovation ideas at the Home & Garden Show. This comprehensive event brings together experts, retailers, and service providers from the home improvement and landscaping industries.\n\nExplore hundreds of exhibits showcasing the newest products and services for home renovation, interior design, outdoor living, and sustainable home solutions. Dedicated areas feature kitchen and bathroom designs, smart home technology, outdoor living spaces, and eco-friendly home innovations.\n\nThroughout the weekend, attend workshops and demonstrations led by industry experts covering topics such as DIY home projects, container gardening, interior design principles, and energy-efficient home improvements. One-on-one consultations with designers, contractors, and gardening specialists will be available to help you plan your next project.",
    location: {
      address: "505 Green Thumb Road",
      city: "Seattle",
      state: "WA",
      country: "USA",
      zipCode: "98101"
    },
    venue: "Exhibition Hall",
    eventDate: "2025-04-15T10:00:00.000Z",
    dateTime: "2025-04-15T10:00:00.000Z",
    endDateTime: "2025-04-17T18:00:00.000Z",
    category: "Lifestyle",
    language: "English",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8",
    ticketPrice: 12.50,
    availableSeats: 1000,
    ticketsAvailable: 1000,
    seatingType: "general",
    organizer: {
      name: "Home & Garden Association",
      email: "show@homegardenassoc.org",
      since: "2000"
    },
    artists: [
      {
        name: "Emma Wilson",
        role: "Interior Designer",
        image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604"
      },
      {
        name: "Thomas Green",
        role: "Landscape Architect",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      }
    ]
  },
  {
    _id: "10",
    title: "Science Fair 2025",
    name: "Science Fair 2025",
    description: "An interactive exhibition showcasing innovations in science and technology.",
    longDescription: "An interactive exhibition showcasing innovations in science and technology. Science Fair 2025 brings together researchers, inventors, and science enthusiasts of all ages for a day of discovery, learning, and hands-on experiences.\n\nExplore exhibits covering various scientific disciplines including physics, chemistry, biology, astronomy, robotics, and environmental science. Interactive displays allow visitors to engage with scientific concepts through experiments and demonstrations designed to make complex ideas accessible and engaging.\n\nSpecial features include a technology showcase highlighting recent innovations, a student project competition, and a series of short talks by scientists and researchers about their work and discoveries. Science Fair 2025 is designed to inspire curiosity and foster interest in STEM fields among visitors of all ages.",
    location: {
      address: "606 Discovery Blvd",
      city: "San Jose",
      state: "CA",
      country: "USA",
      zipCode: "95110"
    },
    venue: "Science Center",
    eventDate: "2025-03-10T09:00:00.000Z",
    dateTime: "2025-03-10T09:00:00.000Z",
    endDateTime: "2025-03-10T17:00:00.000Z",
    category: "Education",
    language: "English",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1564982648655-b9f3fdc4a245",
    ticketPrice: 10.00,
    availableSeats: 300,
    ticketsAvailable: 300,
    seatingType: "general",
    organizer: {
      name: "Science Education Initiative",
      email: "fair@scienceedu.org",
      since: "2015"
    },
    artists: [
      {
        name: "Dr. James Wong",
        role: "Physicist",
        image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4"
      },
      {
        name: "Dr. Aisha Patel",
        role: "Robotics Engineer",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
      }
    ]
  },
  {
    _id: "11",
    title: "Book Festival",
    name: "Book Festival",
    description: "Meet your favorite authors, discover new books, and enjoy readings and signings.",
    longDescription: "Meet your favorite authors, discover new books, and enjoy readings and signings at the Book Festival. This literary celebration brings together writers, publishers, and readers for a day dedicated to the love of books and storytelling.\n\nThe festival features author panels and discussions covering various genres including fiction, non-fiction, poetry, children's literature, and graphic novels. Author readings provide insights into their work and creative process, followed by book signings where attendees can meet writers and have their books personalized.\n\nBrowse the festival marketplace where publishers and independent bookstores showcase new releases, bestsellers, and hidden gems across all genres. Special activities for young readers include storytelling sessions, character meet-and-greets, and creative writing workshops designed to inspire a love of reading and writing.",
    location: {
      address: "707 Literary Lane",
      city: "Portland",
      state: "OR",
      country: "USA",
      zipCode: "97205"
    },
    venue: "Central Library",
    eventDate: "2025-02-05T10:00:00.000Z",
    dateTime: "2025-02-05T10:00:00.000Z",
    endDateTime: "2025-02-05T18:00:00.000Z",
    category: "Education",
    language: "English",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
    ticketPrice: 5.00,
    availableSeats: 250,
    ticketsAvailable: 250,
    seatingType: "general",
    organizer: {
      name: "Literary Arts Society",
      email: "festival@literaryarts.org",
      since: "2005"
    },
    artists: [
      {
        name: "Eleanor Thompson",
        role: "Bestselling Author",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
      },
      {
        name: "Richard Harris",
        role: "Children's Book Author",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
      }
    ]
  },
  {
    _id: "12",
    title: "Auto Show 2025",
    name: "Auto Show 2025",
    description: "See the latest models and concept cars from the world's top automobile manufacturers.",
    longDescription: "See the latest models and concept cars from the world's top automobile manufacturers at Auto Show 2025. This premier automotive event showcases the newest vehicles, innovative technologies, and future concepts from domestic and international car makers.\n\nExplore hundreds of vehicles across all categories including sedans, SUVs, trucks, luxury vehicles, sports cars, and electric vehicles. Special exhibits highlight automotive innovations such as autonomous driving technology, advanced safety features, and sustainable mobility solutions.\n\nUnique experiences include virtual reality test drives, interactive technology demonstrations, and opportunities to sit inside the newest models and concept cars. Industry representatives will be available to answer questions and provide detailed information about the vehicles on display.",
    location: {
      address: "808 Motor Way",
      city: "Detroit",
      state: "MI",
      country: "USA",
      zipCode: "48226"
    },
    venue: "Auto Convention Center",
    eventDate: "2025-01-15T10:00:00.000Z",
    dateTime: "2025-01-15T10:00:00.000Z",
    endDateTime: "2025-01-19T19:00:00.000Z",
    category: "Automotive",
    language: "English",
    ageRestriction: "All ages",
    image: "https://images.unsplash.com/photo-1517672651691-24622a91b550",
    ticketPrice: 20.00,
    availableSeats: 5000,
    ticketsAvailable: 5000,
    seatingType: "general",
    organizer: {
      name: "Automotive Industry Association",
      email: "show@autoindustry.org",
      since: "1990"
    },
    artists: [
      {
        name: "Mark Stevens",
        role: "Automotive Designer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
      },
      {
        name: "Laura Chen",
        role: "EV Technology Expert",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
      }
    ]
  }
];

export default eventData;