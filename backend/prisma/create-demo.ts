import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.findUnique({
    where: { email: 'alice@example.com' },
  });
  if (!alice) {
    console.log('Alice not found!');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({
    where: { email: 'demo@retro-tracker.com' },
  });
  if (existing) {
    console.log('Demo user already exists. Deleting...');
    await prisma.notificationPreference.deleteMany({ where: { userId: existing.id } });
    await prisma.notification.deleteMany({ where: { recipientId: existing.id } });
    await prisma.notification.deleteMany({ where: { senderId: existing.id } });
    await prisma.activityLog.deleteMany({ where: { userId: existing.id } });
    await prisma.follow.deleteMany({ where: { followerId: existing.id } });
    await prisma.follow.deleteMany({ where: { followingId: existing.id } });
    await prisma.reviewComment.deleteMany({ where: { userId: existing.id } });
    await prisma.reviewLike.deleteMany({ where: { userId: existing.id } });
    await prisma.review.deleteMany({ where: { userId: existing.id } });
    await prisma.message.deleteMany({ where: { senderId: existing.id } });
    await prisma.message.deleteMany({ where: { receiverId: existing.id } });
    await prisma.tradeRequest.deleteMany({ where: { senderId: existing.id } });
    await prisma.tradeRequest.deleteMany({ where: { receiverId: existing.id } });
    await prisma.block.deleteMany({ where: { blockerId: existing.id } });
    await prisma.block.deleteMany({ where: { blockedId: existing.id } });
    await prisma.report.deleteMany({ where: { reporterId: existing.id } });
    await prisma.report.deleteMany({ where: { reportedId: existing.id } });
    await prisma.wishlist.deleteMany({ where: { userId: existing.id } });
    await prisma.collection.deleteMany({ where: { userId: existing.id } });
    await prisma.notificationPreference.delete({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
    console.log('Old demo user deleted.');
  }

  const demoId = randomUUID();
  const passwordHash = await bcrypt.hash('demo1234', 12);

  await prisma.user.create({
    data: {
      id: demoId,
      email: 'demo@retro-tracker.com',
      username: 'demo_collector',
      displayName: 'Demo Collector',
      password: passwordHash,
      bio: alice.bio,
      avatarUrl: alice.avatarUrl,
      location: alice.location,
      role: 'USER',
      isActive: true,
      isEmailVerified: true,
      xp: alice.xp,
    },
  });
  console.log('Demo user created:', demoId);

  // Copy collections
  const collections = await prisma.collection.findMany({ where: { userId: alice.id } });
  for (const c of collections) {
    await prisma.collection.create({
      data: {
        id: randomUUID(),
        userId: demoId,
        gameId: c.gameId,
        condition: c.condition,
        region: c.region,
        notes: c.notes,
        personalRating: c.personalRating,
        estimatedValue: c.estimatedValue,
        ownershipStatus: c.ownershipStatus,
        coverImage: c.coverImage,
        acquiredAt: c.acquiredAt,
        createdAt: c.createdAt,
      },
    });
  }
  console.log(`  Copied ${collections.length} collections`);

  // Copy wishlists
  const wishlists = await prisma.wishlist.findMany({ where: { userId: alice.id } });
  for (const w of wishlists) {
    await prisma.wishlist.create({
      data: {
        id: randomUUID(),
        userId: demoId,
        gameId: w.gameId,
        priority: w.priority,
        notes: w.notes,
        estimatedValue: w.estimatedValue,
        addedAt: w.addedAt,
      },
    });
  }
  console.log(`  Copied ${wishlists.length} wishlists`);

  // Copy reviews
  const reviews = await prisma.review.findMany({ where: { userId: alice.id } });
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: randomUUID(),
        userId: demoId,
        gameId: r.gameId,
        rating: r.rating,
        title: r.title,
        body: r.body,
        likes: r.likes,
        createdAt: r.createdAt,
      },
    });
  }
  console.log(`  Copied ${reviews.length} reviews`);

  // Copy messages (sent & received)
  const sentMessages = await prisma.message.findMany({ where: { senderId: alice.id } });
  for (const m of sentMessages) {
    await prisma.message.create({
      data: {
        id: randomUUID(),
        senderId: demoId,
        receiverId: m.receiverId,
        content: m.content,
        imageUrl: m.imageUrl,
        readAt: m.readAt,
        createdAt: m.createdAt,
      },
    });
  }
  console.log(`  Copied ${sentMessages.length} sent messages`);

  const receivedMessages = await prisma.message.findMany({ where: { receiverId: alice.id } });
  for (const m of receivedMessages) {
    await prisma.message.create({
      data: {
        id: randomUUID(),
        senderId: m.senderId,
        receiverId: demoId,
        content: m.content,
        imageUrl: m.imageUrl,
        readAt: m.readAt,
        createdAt: m.createdAt,
      },
    });
  }
  console.log(`  Copied ${receivedMessages.length} received messages`);

  // Copy trades (sent & received)
  const sentTrades = await prisma.tradeRequest.findMany({ where: { senderId: alice.id } });
  for (const t of sentTrades) {
    await prisma.tradeRequest.create({
      data: {
        id: randomUUID(),
        senderId: demoId,
        receiverId: t.receiverId,
        offeredGameId: t.offeredGameId,
        wantedGameId: t.wantedGameId,
        message: t.message,
        status: t.status,
        shippingMethod: t.shippingMethod,
        senderAddress: t.senderAddress,
        receiverAddress: t.receiverAddress,
        trackingNumber: t.trackingNumber,
        shippingNotes: t.shippingNotes,
        createdAt: t.createdAt,
      },
    });
  }
  console.log(`  Copied ${sentTrades.length} sent trades`);

  const receivedTrades = await prisma.tradeRequest.findMany({ where: { receiverId: alice.id } });
  for (const t of receivedTrades) {
    await prisma.tradeRequest.create({
      data: {
        id: randomUUID(),
        senderId: t.senderId,
        receiverId: demoId,
        offeredGameId: t.offeredGameId,
        wantedGameId: t.wantedGameId,
        message: t.message,
        status: t.status,
        shippingMethod: t.shippingMethod,
        senderAddress: t.senderAddress,
        receiverAddress: t.receiverAddress,
        trackingNumber: t.trackingNumber,
        shippingNotes: t.shippingNotes,
        createdAt: t.createdAt,
      },
    });
  }
  console.log(`  Copied ${receivedTrades.length} received trades`);

  // Copy follows (as follower)
  const following = await prisma.follow.findMany({ where: { followerId: alice.id } });
  for (const f of following) {
    await prisma.follow.create({
      data: {
        id: randomUUID(),
        followerId: demoId,
        followingId: f.followingId,
        createdAt: f.createdAt,
      },
    });
  }
  console.log(`  Copied ${following.length} following`);

  // Copy follows (as followed user)
  const followers = await prisma.follow.findMany({ where: { followingId: alice.id } });
  for (const f of followers) {
    await prisma.follow.create({
      data: {
        id: randomUUID(),
        followerId: f.followerId,
        followingId: demoId,
        createdAt: f.createdAt,
      },
    });
  }
  console.log(`  Copied ${followers.length} followers`);

  // Copy activity logs
  const logs = await prisma.activityLog.findMany({ where: { userId: alice.id } });
  for (const l of logs) {
    await prisma.activityLog.create({
      data: {
        id: randomUUID(),
        userId: demoId,
        type: l.type,
        targetId: l.targetId,
        targetType: l.targetType,
        message: l.message,
        metadata: l.metadata ?? undefined,
        createdAt: l.createdAt,
      },
    });
  }
  console.log(`  Copied ${logs.length} activity logs`);

  // Copy notifications (received by Alice → now received by demo)
  const notifsReceived = await prisma.notification.findMany({ where: { recipientId: alice.id } });
  for (const n of notifsReceived) {
    await prisma.notification.create({
      data: {
        id: randomUUID(),
        recipientId: demoId,
        senderId: n.senderId,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        link: n.link,
        metadata: n.metadata ?? undefined,
        createdAt: n.createdAt,
      },
    });
  }
  console.log(`  Copied ${notifsReceived.length} received notifications`);

  // Copy notifications (sent by Alice → now sent by demo)
  const notifsSent = await prisma.notification.findMany({ where: { senderId: alice.id } });
  for (const n of notifsSent) {
    await prisma.notification.create({
      data: {
        id: randomUUID(),
        recipientId: n.recipientId,
        senderId: demoId,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        link: n.link,
        metadata: n.metadata ?? undefined,
        createdAt: n.createdAt,
      },
    });
  }
  console.log(`  Copied ${notifsSent.length} sent notifications`);

  // Copy notification preferences
  const prefs = await prisma.notificationPreference.findUnique({ where: { userId: alice.id } });
  if (prefs) {
    await prisma.notificationPreference.create({
      data: {
        id: randomUUID(),
        userId: demoId,
        email: prefs.email,
        push: prefs.push,
        follows: prefs.follows,
        reviews: prefs.reviews,
        wishlist: prefs.wishlist,
      },
    });
    console.log('  Copied notification preferences');
  }

  // Copy reports made by Alice
  const reports = await prisma.report.findMany({ where: { reporterId: alice.id } });
  for (const r of reports) {
    await prisma.report.create({
      data: {
        id: randomUUID(),
        reporterId: demoId,
        reportedId: r.reportedId,
        reason: r.reason,
        createdAt: r.createdAt,
      },
    });
  }
  console.log(`  Copied ${reports.length} reports`);

  console.log('\nDemo account created successfully!');
  console.log('  Email: demo@retro-tracker.com');
  console.log('  Password: demo1234');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
