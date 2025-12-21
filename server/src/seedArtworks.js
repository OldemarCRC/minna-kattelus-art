import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artwork from './src/models/Artwork.js';
import User from './src/models/User.js';

dotenv.config();

const sampleArtworks = [
  {
    title: {
      en: "River Journey",
      es: "Viaje por el Río",
      fi: "Jokimatka",
      sv: "Flodresa"
    },
    description: {
      en: "A serene landscape capturing the gentle flow of a Nordic river through lush forests, reflecting the changing seasons.",
      es: "Un paisaje sereno que captura el flujo suave de un río nórdico a través de frondosos bosques, reflejando las estaciones cambiantes.",
      fi: "Rauhallinen maisema, joka vangitsee pohjoismaisen joen hiljaisen virtauksen rehevien metsien halki, heijastellen vuodenaikojen muutosta.",
      sv: "Ett fridfullt landskap som fångar det mjuka flödet av en nordisk flod genom frodiga skogar, som speglar årstidernas skiftningar."
    },
    technique: {
      en: "Acrylic on canvas",
      es: "Acrílico sobre lienzo",
      fi: "Akryyli kankaalle",
      sv: "Akryl på duk"
    },
    category: "PAISAJES",
    image: "joki.jpg",
    year: 2024,
    dimensions: {
      width: 80,
      height: 60,
      unit: "cm"
    },
    price: 850,
    currency: "EUR",
    available: true,
    featured: true,
    displayOrder: 1
  },
  {
    title: {
      en: "Summer Tree",
      es: "Árbol de Verano",
      fi: "Kesäpuu",
      sv: "Sommarträd"
    },
    description: {
      en: "A vibrant celebration of Nordic summer, with sunlight filtering through leaves in golden hues.",
      es: "Una vibrante celebración del verano nórdico, con luz solar filtrándose a través de las hojas en tonos dorados.",
      fi: "Elävä juhla pohjoismaisen kesän kunniaksi, auringonvalon suodattuessa lehtien läpi kultaisina sävyinä.",
      sv: "En livfull hyllning till den nordiska sommaren, med solljus som filtrerar genom löv i gyllene nyanser."
    },
    technique: {
      en: "Acrylic on canvas",
      es: "Acrílico sobre lienzo",
      fi: "Akryyli kankaalle",
      sv: "Akryl på duk"
    },
    category: "NATURALEZA",
    image: "kesa-puu.jpg",
    year: 2024,
    dimensions: {
      width: 70,
      height: 50,
      unit: "cm"
    },
    price: 720,
    currency: "EUR",
    available: true,
    featured: true,
    displayOrder: 2
  },
  {
    title: {
      en: "Lakeside Path",
      es: "Camino junto al Lago",
      fi: "Järvenrantapolku",
      sv: "Sjöstrandsstig"
    },
    description: {
      en: "A tranquil path along a Finnish lake, where nature and water meet in perfect harmony.",
      es: "Un camino tranquilo junto a un lago finlandés, donde la naturaleza y el agua se encuentran en perfecta armonía.",
      fi: "Rauhallinen polku suomalaisen järven rannalla, missä luonto ja vesi kohtaavat täydellisessä sopusoinnussa.",
      sv: "En fridfull stig längs en finsk sjö, där natur och vatten möts i perfekt harmoni."
    },
    technique: {
      en: "Acrylic on canvas",
      es: "Acrílico sobre lienzo",
      fi: "Akryyli kankaalle",
      sv: "Akryl på duk"
    },
    category: "PAISAJES",
    image: "jarvenranta.jpg",
    year: 2023,
    dimensions: {
      width: 90,
      height: 70,
      unit: "cm"
    },
    price: 950,
    currency: "EUR",
    available: true,
    featured: false,
    displayOrder: 3
  },
  {
    title: {
      en: "Forest Silhouette",
      es: "Silueta del Bosque",
      fi: "Metsän Siluetti",
      sv: "Skogssiluett"
    },
    description: {
      en: "The mysterious beauty of Nordic forests at twilight, where shadows dance among ancient trees.",
      es: "La misteriosa belleza de los bosques nórdicos al crepúsculo, donde las sombras danzan entre árboles antiguos.",
      fi: "Pohjoismaisten metsien salaperäinen kauneus hämärässä, missä varjot tanssivat muinaisten puiden keskellä.",
      sv: "Den mystiska skönheten hos nordiska skogar i skymningen, där skuggor dansar bland uråldriga träd."
    },
    technique: {
      en: "Acrylic on canvas",
      es: "Acrílico sobre lienzo",
      fi: "Akryyli kankaalle",
      sv: "Akryl på duk"
    },
    category: "ABSTRACTO",
    image: "metsa.jpg",
    year: 2023,
    dimensions: {
      width: 75,
      height: 60,
      unit: "cm"
    },
    price: 800,
    currency: "EUR",
    available: false,
    featured: false,
    displayOrder: 4
  },
  {
    title: {
      en: "Autumn Reflections",
      es: "Reflejos de Otoño",
      fi: "Syksyn Heijastukset",
      sv: "Höstreflektioner"
    },
    description: {
      en: "The rich colors of Finnish autumn captured in their full glory, with water mirroring the transformation of nature.",
      es: "Los ricos colores del otoño finlandés capturados en todo su esplendor, con agua reflejando la transformación de la naturaleza.",
      fi: "Suomalaisen syksyn rikkaat värit vangittuna täydessä loistossaan, veden heijastaessa luonnon muodonmuutosta.",
      sv: "De rika färgerna från den finska hösten fångade i sin fulla prakt, med vatten som speglar naturens förvandling."
    },
    technique: {
      en: "Acrylic on canvas",
      es: "Acrílico sobre lienzo",
      fi: "Akryyli kankaalle",
      sv: "Akryl på duk"
    },
    category: "PAISAJES",
    image: "syksy.jpg",
    year: 2024,
    dimensions: {
      width: 85,
      height: 65,
      unit: "cm"
    },
    price: 920,
    currency: "EUR",
    available: true,
    featured: true,
    displayOrder: 5
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Encontrar un usuario admin para asignar como creador
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${adminUser.email}`);

    // Limpiar artworks existentes
    await Artwork.deleteMany({});
    console.log('🗑️  Cleared existing artworks');

    // Agregar createdBy a cada artwork
    const artworksWithCreator = sampleArtworks.map(artwork => ({
      ...artwork,
      createdBy: adminUser._id
    }));

    // Insertar nuevos artworks
    const createdArtworks = await Artwork.insertMany(artworksWithCreator);
    console.log(`✅ Created ${createdArtworks.length} sample artworks`);

    console.log('\n📊 Summary:');
    console.log(`Total artworks: ${createdArtworks.length}`);
    console.log(`Featured: ${createdArtworks.filter(a => a.featured).length}`);
    console.log(`Available: ${createdArtworks.filter(a => a.available).length}`);
    
    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();