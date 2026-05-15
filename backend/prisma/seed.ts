import { PrismaClient, UserRole, Condition, Region, OwnershipStatus, ActivityType, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { gameData } from './games-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Retro Collection Tracker database...\n');

  // ─── PLATFORMS ───────────────────────────────────
  const platformData = [
    { name: 'NES', slug: 'nes', manufacturer: 'Nintendo', releaseYear: 1985 },
    { name: 'SNES', slug: 'snes', manufacturer: 'Nintendo', releaseYear: 1991 },
    { name: 'Nintendo 64', slug: 'nintendo-64', manufacturer: 'Nintendo', releaseYear: 1996 },
    { name: 'Game Boy', slug: 'game-boy', manufacturer: 'Nintendo', releaseYear: 1989 },
    { name: 'Game Boy Advance', slug: 'gba', manufacturer: 'Nintendo', releaseYear: 2001 },
    { name: 'Sega Genesis', slug: 'sega-genesis', manufacturer: 'Sega', releaseYear: 1989 },
    { name: 'Sega Saturn', slug: 'sega-saturn', manufacturer: 'Sega', releaseYear: 1995 },
    { name: 'Sega Dreamcast', slug: 'sega-dreamcast', manufacturer: 'Sega', releaseYear: 1999 },
    { name: 'PlayStation', slug: 'playstation', manufacturer: 'Sony', releaseYear: 1994 },
    { name: 'PlayStation 2', slug: 'playstation-2', manufacturer: 'Sony', releaseYear: 2000 },
    { name: 'Atari 2600', slug: 'atari-2600', manufacturer: 'Atari', releaseYear: 1977 },
    { name: 'PC Engine', slug: 'pc-engine', manufacturer: 'NEC', releaseYear: 1987 },
  ];

  const platforms: Record<string, string> = {};
  for (const p of platformData) {
    const platform = await prisma.platform.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    platforms[p.slug] = platform.id;
  }
  console.log(`✓ Created ${Object.keys(platforms).length} platforms`);

  // ─── GENRES ──────────────────────────────────────
  const genreData = [
    { name: 'Action', slug: 'action' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'RPG', slug: 'rpg' },
    { name: 'Platformer', slug: 'platformer' },
    { name: 'Shooter', slug: 'shooter' },
    { name: 'Fighting', slug: 'fighting' },
    { name: 'Racing', slug: 'racing' },
    { name: 'Puzzle', slug: 'puzzle' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Strategy', slug: 'strategy' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Beat \'em Up', slug: 'beat-em-up' },
  ];

  const genres: Record<string, string> = {};
  for (const g of genreData) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genres[g.slug] = genre.id;
  }
  console.log(`✓ Created ${Object.keys(genres).length} genres`);

  // ─── GAMES ───────────────────────────────────────
  // Expanded game data imported from games-data.ts

  const games: Record<string, string> = {};
  for (const g of gameData) {
    const slug = g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await prisma.game.findFirst({
      where: { title: g.title, platformId: platforms[g.platform] },
    });
    if (existing) {
      games[slug] = existing.id;
      continue;
    }
    const game = await prisma.game.create({
      data: {
        title: g.title,
        platformId: platforms[g.platform],
        genreId: genres[g.genre],
        releaseYear: g.releaseYear,
        developer: g.developer,
        publisher: g.publisher,
        description: g.description,
        coverImageUrl: `https://placehold.co/400x300/1a1f35/8b5cf6?text=${encodeURIComponent(g.title.slice(0, 12))}`,
      },
    });
    games[slug] = game.id;
  }
  console.log(`✓ Created ${Object.keys(games).length} games`);

  // ─── USERS ───────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);

  const userData = [
    { email: 'alice@example.com', username: 'retro_alice', displayName: 'Alice', bio: 'SNES collector since 1995. Love RPGs and platformers.', role: UserRole.USER },
    { email: 'bob@example.com', username: 'bob_collector', displayName: 'Bob', bio: 'Genesis fanatic. Always hunting for CIB games.', role: UserRole.USER },
    { email: 'charlie@example.com', username: 'retro_charlie', displayName: 'Charlie', bio: 'PlayStation retro enthusiast. Specializing in JRPGs.', role: UserRole.USER },
    { email: 'admin@example.com', username: 'admin', displayName: 'Admin', bio: 'Platform administrator', role: UserRole.ADMIN },
    { email: 'diana@example.com', username: 'diana_gamer', displayName: 'Diana', bio: 'N64 and Game Boy collector. Pokemon master.', role: UserRole.USER },
  ];

  const users: Record<string, string> = {};
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        displayName: u.displayName,
        password: passwordHash,
        bio: u.bio,
        role: u.role,
      },
    });
    users[u.username] = user.id;
  }
  console.log(`✓ Created ${Object.keys(users).length} users (all passwords: "password123")`);

  // ─── COLLECTIONS ─────────────────────────────────
  const collectionData = [
    { username: 'retro_alice', gameTitle: 'Super Metroid', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 250.00 },
    { username: 'retro_alice', gameTitle: 'Chrono Trigger', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 200.00 },
    { username: 'retro_alice', gameTitle: 'Final Fantasy VI', condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 180.00 },
    { username: 'retro_alice', gameTitle: 'Super Mario World', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 90.00 },
    { username: 'retro_alice', gameTitle: 'Donkey Kong Country', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 85.00 },
    { username: 'retro_alice', gameTitle: 'Mega Man X', condition: Condition.GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 120.00 },
    { username: 'retro_alice', gameTitle: 'EarthBound', condition: Condition.GOOD, region: Region.NTSC, personalRating: 5, estimatedValue: 400.00 },
    { username: 'retro_alice', gameTitle: 'The Legend of Zelda', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 150.00 },
    { username: 'retro_alice', gameTitle: 'Metroid', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 95.00 },
    { username: 'retro_alice', gameTitle: 'Super Mario 64', condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 130.00 },
    { username: 'retro_alice', gameTitle: 'Castlevania: Aria of Sorrow', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 110.00 },
    { username: 'retro_alice', gameTitle: 'Tetris', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 3, estimatedValue: 15.00 },
    { username: 'retro_alice', gameTitle: 'Panzer Dragoon Saga', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 800.00 },
    { username: 'retro_alice', gameTitle: 'Gran Turismo', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 30.00 },
    { username: 'retro_alice', gameTitle: 'Adventure', condition: Condition.GOOD, region: Region.NTSC, personalRating: 3, estimatedValue: 120.00 },
    { username: 'retro_alice', gameTitle: "Bonk's Adventure", condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 4, estimatedValue: 90.00 },
    { username: 'retro_alice', gameTitle: 'Shenmue', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 120.00 },
    { username: 'retro_alice', gameTitle: 'Shadow of the Colossus', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 45.00 },
    { username: 'retro_alice', gameTitle: 'Sonic the Hedgehog 2', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 45.00 },

    { username: 'bob_collector', gameTitle: 'Sonic the Hedgehog 2', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 45.00 },
    { username: 'bob_collector', gameTitle: 'Snatcher', condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 500.00 },
    { username: 'bob_collector', gameTitle: 'MUSHA', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 300.00 },
    { username: 'bob_collector', gameTitle: 'Street Fighter II', condition: Condition.GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 40.00 },
    { username: 'bob_collector', gameTitle: 'Contra', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 60.00 },
    { username: 'bob_collector', gameTitle: 'Adventure', condition: Condition.GOOD, region: Region.NTSC, personalRating: 3, estimatedValue: 120.00 },
    { username: 'bob_collector', gameTitle: 'Panzer Dragoon Saga', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 800.00 },
    { username: 'bob_collector', gameTitle: "Bonk's Adventure", condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 90.00 },

    { username: 'retro_charlie', gameTitle: 'Castlevania: Symphony of the Night', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 180.00 },
    { username: 'retro_charlie', gameTitle: 'Final Fantasy VII', condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 80.00 },
    { username: 'retro_charlie', gameTitle: 'Suikoden II', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 5, estimatedValue: 280.00 },
    { username: 'retro_charlie', gameTitle: 'Metal Gear Solid', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 50.00 },
    { username: 'retro_charlie', gameTitle: 'Resident Evil 2', condition: Condition.GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 60.00 },
    { username: 'retro_charlie', gameTitle: 'Radiant Silvergun', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 350.00 },
    { username: 'retro_charlie', gameTitle: 'Street Fighter II', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 40.00 },
    { username: 'retro_charlie', gameTitle: 'Pokemon Red', condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 100.00 },

    { username: 'diana_gamer', gameTitle: 'Super Mario 64', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 80.00 },
    { username: 'diana_gamer', gameTitle: 'The Legend of Zelda: Ocarina of Time', condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 120.00 },
    { username: 'diana_gamer', gameTitle: 'Pokemon Red', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 5, estimatedValue: 100.00 },
    { username: 'diana_gamer', gameTitle: 'Tetris', condition: Condition.GOOD, region: Region.NTSC, personalRating: 3, estimatedValue: 15.00 },
    { username: 'diana_gamer', gameTitle: 'Shining Force III', condition: Condition.MINT, region: Region.NTSC, personalRating: 5, estimatedValue: 350.00 },
    { username: 'diana_gamer', gameTitle: 'Gran Turismo', condition: Condition.VERY_GOOD, region: Region.NTSC, personalRating: 4, estimatedValue: 30.00 },
    { username: 'diana_gamer', gameTitle: "Bonk's Adventure", condition: Condition.NEAR_MINT, region: Region.NTSC, personalRating: 4, estimatedValue: 90.00 },
  ];

  let collectionCount = 0;
  for (const c of collectionData) {
    const gameSlug = c.gameTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const gameId = games[gameSlug];
    const userId = users[c.username];
    if (!gameId || !userId) continue;

    await prisma.collection.upsert({
      where: { userId_gameId: { userId, gameId } },
      update: {},
      create: {
        userId,
        gameId,
        condition: c.condition,
        region: c.region,
        personalRating: c.personalRating,
        estimatedValue: c.estimatedValue,
        ownershipStatus: OwnershipStatus.OWNED,
      },
    });
    collectionCount++;
  }
  console.log(`✓ Created ${collectionCount} collection entries`);

  // ─── WISHLISTS ───────────────────────────────────
  const wishlistData = [
    { username: 'retro_alice', gameTitle: 'EarthBound', priority: 1, notes: 'Must have for the collection' },
    { username: 'retro_alice', gameTitle: 'Panzer Dragoon Saga', priority: 2 },
    { username: 'retro_alice', gameTitle: 'Snatcher', priority: 2, notes: 'Love Hideo Kojima' },
    { username: 'retro_alice', gameTitle: 'Shenmue', priority: 3 },
    { username: 'retro_alice', gameTitle: 'Final Fantasy X', priority: 3 },
    { username: 'retro_alice', gameTitle: 'Jet Set Radio', priority: 4 },
    { username: 'bob_collector', gameTitle: 'Radiant Silvergun', priority: 1 },
    { username: 'bob_collector', gameTitle: 'Shining Force III', priority: 2 },
    { username: 'bob_collector', gameTitle: 'Chrono Trigger', priority: 3 },
    { username: 'retro_charlie', gameTitle: 'Castlevania: Aria of Sorrow', priority: 1 },
    { username: 'retro_charlie', gameTitle: 'MUSHA', priority: 2 },
    { username: 'diana_gamer', gameTitle: 'The Legend of Zelda', priority: 1 },
    { username: 'diana_gamer', gameTitle: 'EarthBound', priority: 2 },
  ];

  let wishlistCount = 0;
  for (const w of wishlistData) {
    const gameSlug = w.gameTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const gameId = games[gameSlug];
    const userId = users[w.username];
    if (!gameId || !userId) continue;

    await prisma.wishlist.upsert({
      where: { userId_gameId: { userId, gameId } },
      update: {},
      create: {
        userId,
        gameId,
        priority: w.priority,
        notes: w.notes,
      },
    });
    wishlistCount++;
  }
  console.log(`✓ Created ${wishlistCount} wishlist entries`);

  // ─── REVIEWS ─────────────────────────────────────
  const reviewData = [
    { username: 'retro_alice', gameTitle: 'Super Metroid', rating: 5, title: 'Perfect game', body: 'Flawless level design, atmosphere, and gameplay. The pinnacle of 16-bit gaming.' },
    { username: 'retro_alice', gameTitle: 'Chrono Trigger', rating: 5, title: 'Timeless classic', body: 'The best RPG ever made. Incredible story, soundtrack, and battle system.' },
    { username: 'bob_collector', gameTitle: 'Sonic the Hedgehog 2', rating: 5, title: 'Genesis does what Nintendont', body: 'Fast-paced platforming perfection. The best Sonic game ever made.' },
    { username: 'bob_collector', gameTitle: 'Snatcher', rating: 5, title: 'Kojima\'s hidden gem', body: 'An incredible cyberpunk visual novel. The atmosphere is unmatched.' },
    { username: 'retro_charlie', gameTitle: 'Castlevania: Symphony of the Night', rating: 5, title: 'Masterpiece', body: 'Defined an entire genre. The music, art direction, and gameplay are sublime.' },
    { username: 'retro_charlie', gameTitle: 'Final Fantasy VII', rating: 5, title: 'Changed everything', body: 'This game redefined what RPGs could be. The story still holds up.' },
    { username: 'diana_gamer', gameTitle: 'Super Mario 64', rating: 5, title: 'Revolutionary', body: 'Set the standard for 3D platformers. Still plays beautifully today.' },
    { username: 'diana_gamer', gameTitle: 'The Legend of Zelda: Ocarina of Time', rating: 5, title: 'The GOAT', body: 'The greatest game of all time. Every dungeon, every moment is iconic.' },
  ];

  let reviewCount = 0;
  for (const r of reviewData) {
    const gameSlug = r.gameTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const gameId = games[gameSlug];
    const userId = users[r.username];
    if (!gameId || !userId) continue;

    await prisma.review.upsert({
      where: { userId_gameId: { userId, gameId } },
      update: {},
      create: {
        userId,
        gameId,
        rating: r.rating,
        title: r.title,
        body: r.body,
      },
    });
    reviewCount++;
  }
  console.log(`✓ Created ${reviewCount} reviews`);

  // ─── FOLLOWS ─────────────────────────────────────
  const followData = [
    { follower: 'retro_alice', following: 'bob_collector' },
    { follower: 'retro_alice', following: 'retro_charlie' },
    { follower: 'bob_collector', following: 'retro_alice' },
    { follower: 'bob_collector', following: 'diana_gamer' },
    { follower: 'retro_charlie', following: 'retro_alice' },
    { follower: 'retro_charlie', following: 'bob_collector' },
    { follower: 'diana_gamer', following: 'retro_alice' },
    { follower: 'diana_gamer', following: 'retro_charlie' },
  ];

  let followCount = 0;
  for (const f of followData) {
    const followerId = users[f.follower];
    const followingId = users[f.following];
    if (!followerId || !followingId) continue;

    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      update: {},
      create: { followerId, followingId },
    });
    followCount++;
  }
  console.log(`✓ Created ${followCount} follows`);

  // ─── ACTIVITY LOGS ───────────────────────────────
  const userList = Object.entries(users);
  const activityLogs = [
    { username: 'retro_alice', type: ActivityType.ADDED_GAME, message: 'Added Super Metroid to collection' },
    { username: 'retro_alice', type: ActivityType.ADDED_REVIEW, message: 'Reviewed Super Metroid — 5 stars' },
    { username: 'retro_alice', type: ActivityType.FOLLOWED_USER, message: 'bob_collector started following you' },
    { username: 'bob_collector', type: ActivityType.ADDED_GAME, message: 'Added Sonic the Hedgehog 2 to collection' },
    { username: 'bob_collector', type: ActivityType.FOLLOWED_USER, message: 'retro_charlie started following you' },
    { username: 'retro_charlie', type: ActivityType.CREATED_ACCOUNT, message: 'Joined Retro Collection Tracker' },
  ];

  let logCount = 0;
  for (const log of activityLogs) {
    await prisma.activityLog.create({
      data: {
        userId: users[log.username],
        type: log.type,
        message: log.message,
      },
    });
    logCount++;
  }
  console.log(`✓ Created ${logCount} activity logs`);

  console.log('\n✅ Seeding complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo accounts (password: password123):');
  console.log('  alice@example.com');
  console.log('  bob@example.com');
  console.log('  charlie@example.com');
  console.log('  diana_gamer@example.com');
  console.log('  admin@example.com (admin)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
