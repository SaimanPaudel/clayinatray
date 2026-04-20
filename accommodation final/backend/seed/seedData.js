require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config({ path: '../.env' });

const properties = [
  {
    title: 'South Golden Beach House - Upstairs Retreat',
    description:
      'An original Byron Bay Aussie Beach House seconds from the sand. Family & Pet Friendly. Sleeps 6',
    subtitleDetail: 'Entire first floor apartment hosted by Jolene',
    type: 'double tray',
    price: 180,
    guests: 6,
    bedrooms: 2,
    beds: 3,
    baths: 1,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400',
    ],
    location: 'South Golden Beach, Byron Bay, NSW',
    isAvailable: true,
    petFriendly: true,
    amenities: [
      'WiFi',
      'Pet Friendly',
      'Beach access',
      'Family friendly',
      'Free cancellation',
    ],
    rating: 4.96,
    reviews: 189,
    hostName: 'Jolene',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    hostTagline: 'Hosted by a trusted local owner',
    airbnbUrl: 'https://www.airbnb.com',
    features: [
      {
        icon: 'home',
        title: 'Entire first floor apartment',
        description:
          "You'll have the entire space to yourself with private entrance",
      },
      {
        icon: 'map',
        title: 'Steps from the beach',
        description: 'Beautiful South Golden Beach is just a short walk away',
      },
      {
        icon: 'pet',
        title: 'Pet friendly',
        description: 'Pets are welcome with outdoor space available',
      },
      {
        icon: 'family',
        title: 'Family friendly',
        description: 'Suitable for families with children',
      },
      {
        icon: 'cancel',
        title: 'Free cancellation before check-in',
        description:
          'Cancel up to 48 hours before check-in for a full refund',
      },
    ],
    guestReviews: [
      {
        name: 'Sophie',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        date: 'January 2026',
        rating: 5,
        comment:
          "Absolutely loved staying at Jolene's place! The house is exactly as described - full of character and just steps from the beach. Jolene was an amazing host, super responsive and gave us great local tips. We borrowed the surfboards every day and loved the fire pit at night. Can't wait to come back!",
      },
      {
        name: 'Marcus & Family',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        date: 'December 2025',
        rating: 5,
        comment:
          "Perfect family getaway! Our kids (and dog!) loved having so much space and being so close to the beach. The house had everything we needed and more - the Weber BBQ got a workout! Jolene was wonderful, checking in to make sure we had everything. South Golden Beach is magic - quiet, beautiful, and the perfect escape from busy life.",
      },
      {
        name: 'Rachel',
        avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
        date: 'September 2025',
        rating: 5,
        comment:
          'Stayed here for a creative retreat and it was exactly what I needed. The natural light, original art on the walls, and ocean breezes were so inspiring. Jolene even offered art supplies when she heard I was painting! The area is super chill and has amazing cafes. Highly recommend Bayroots next door!',
      },
      {
        name: 'Tom & Sarah',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        date: 'August 2025',
        rating: 5,
        comment:
          "Best beach house we've ever stayed in! Everything was spotless and the beds were so comfortable. We loved the fire pit evenings and borrowing the bikes to explore. Jolene's local recommendations were spot on - especially Billinudgel Pub! Will definitely be back.",
      },
      {
        name: 'The Johnsons',
        avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
        date: 'June 2025',
        rating: 5,
        comment:
          "Our second time staying with Jolene and it just keeps getting better! The house is always immaculate and Jolene adds little touches that make you feel at home. Our teenagers loved having their own space and the sofa bed was actually comfortable! Can't recommend enough.",
      },
    ],
  },

  {
    title: 'South Golden Sea Shack - Ground Floor Apartment',
    description:
      'Just steps from beautiful South Golden Beach. Entire Sea Shack Apartment with industrial-Moroccan charm',
    subtitleDetail: 'Entire ground floor apartment hosted by Jolene',
    type: 'studio',
    price: 165,
    guests: 5,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    image:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
    ],
    location: 'South Golden Beach, Byron Bay, NSW',
    isAvailable: true,
    petFriendly: true,
    amenities: [
      'WiFi',
      'Pet Friendly',
      'Beach access',
      'Industrial design',
      'Free cancellation',
    ],
    rating: 4.94,
    reviews: 167,
    hostName: 'Jolene',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    hostTagline: 'Hosted by a trusted local owner',
    airbnbUrl: 'https://www.airbnb.com',
    features: [
      {
        icon: 'home',
        title: 'Entire ground floor apartment',
        description:
          "You'll have the entire space to yourself with private entrance",
      },
      {
        icon: 'map',
        title: 'Steps from the beach',
        description: 'Beautiful South Golden Beach is just a short walk away',
      },
      {
        icon: 'pet',
        title: 'Pet friendly',
        description: 'Pets are welcome with outdoor space available',
      },
      {
        icon: 'family',
        title: 'Family friendly',
        description: 'Suitable for families with children',
      },
      {
        icon: 'cancel',
        title: 'Free cancellation before check-in',
        description:
          'Cancel up to 48 hours before check-in for a full refund',
      },
    ],
    guestReviews: [
      {
        name: 'Emma & Pete',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        date: 'January 2026',
        rating: 5,
        comment:
          "Stunning apartment with such unique style. The Moroccan touches mixed with industrial design makes it feel like nowhere else. We loved waking up and walking to the beach in 2 minutes. Jolene was a fantastic host and left us local restaurant recommendations that were spot on.",
      },
      {
        name: 'David',
        avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
        date: 'November 2025',
        rating: 5,
        comment:
          "Exactly what the photos show - cosy, stylish, and perfectly located. The ground floor made it easy to come and go and we loved the outdoor area. Very quiet neighbourhood and the beach is incredible. Will be back for sure.",
      },
      {
        name: 'Claire & James',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        date: 'October 2025',
        rating: 5,
        comment:
          "We came for a long weekend and wished we had booked longer. The apartment has everything you need and the style is just gorgeous. South Golden Beach itself is a hidden gem - much less crowded than Byron town. Jolene was super helpful and quick to respond.",
      },
    ],
  },
];

async function seed() {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Property.deleteMany({});
    console.log('Cleared existing properties');

    const inserted = await Property.insertMany(properties);
    console.log(`Successfully seeded ${inserted.length} properties`);

    mongoose.disconnect();
    console.log('Done! Disconnected from MongoDB');
  } catch (err) {
    console.error('Seed error:', err);
    mongoose.disconnect();
  }
}

seed();