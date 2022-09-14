import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  const location1 = await prisma.location.create({
    data: {
      name: 'Location 1',
      description: 'This is the first location',
    },
  })
  const location2 = await prisma.location.create({
    data: {
      name: 'Location 2',
      description: 'This is the second location',
    },
  })
  const location3 = await prisma.location.create({
    data: {
      name: 'Location 3',
      description: 'This is the third location',
    },
  })

  await prisma.game.create({
    data: {
      currentLocationId: location1.id,
    },
  })

  await prisma.destination.create({
    data: {
      name: 'To destination 2',
      description: 'You can go to this destination',
      fromLocationId: location1.id,
      toLocationId: location2.id,
    },
  })
  await prisma.destination.create({
    data: {
      name: 'To destination 3',
      description: 'You can go to this destination',
      fromLocationId: location1.id,
      toLocationId: location3.id,
    },
  })
  await prisma.destination.create({
    data: {
      name: 'To destination 3',
      description: "Let's go!",
      fromLocationId: location2.id,
      toLocationId: location3.id,
    },
  })
  await prisma.destination.create({
    data: {
      name: 'Back to destination 1',
      description: 'Back to the start...',
      fromLocationId: location3.id,
      toLocationId: location1.id,
    },
  })
}

seed()
