import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "../lib/generated/prisma"

export function CustomPrismaAdapter(prisma: PrismaClient) {
  const adapter = PrismaAdapter(prisma)
  
  return {
    ...adapter,
    createUser: async (data: any) => {
      return await prisma.user.create({
        data: {
          email: data.email,
          name: data.name || "",
          image: data.image || "",
          fullName: data.name || "", // Sync with name
          avatarUrl: data.image || "", // Sync with image
          onboardingCompleted: false,
          onboardingStep: "username",
        },
      })
    },
    updateUser: async (data: any) => {
      return await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data.email,
          name: data.name || "",
          image: data.image || "",
          fullName: data.name || "", // Sync with name
          avatarUrl: data.image || "", // Sync with image
        },
      })
    },
  }
} 