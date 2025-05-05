import { db } from "./db";
import { users, aiPersonas } from "@shared/schema";

async function seed() {
  console.log("Seeding database with initial data...");
  
  try {
    // Check if demo user exists
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      // Add demo user
      const [user] = await db.insert(users).values({
        username: 'johndoe',
        password: 'password',
        displayName: 'John Doe',
        email: 'john@example.com',
        avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=John'
      }).returning();
      
      console.log(`Created demo user: ${user.displayName}`);
      
      // Add demo AI persona
      const [persona] = await db.insert(aiPersonas).values({
        userId: user.id,
        name: 'Alex',
        age: 16,
        interests: ['Science', 'Gaming'],
        communicationStyle: 'balanced',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
        active: true
      }).returning();
      
      console.log(`Created demo AI persona: ${persona.name}`);
    } else {
      console.log("Database already has seed data");
    }
    
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Execute the seed function
seed();