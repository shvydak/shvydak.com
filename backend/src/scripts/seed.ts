// import {databaseConnection} from '@/utils/database'
// import {User} from '@/models/users.model'
// import {UserRole} from '@/types'

// const seedUsers = [
//     {
//         email: 'admin@shvydak.com',
//         password: 'admin123456',
//         firstName: 'Admin',
//         lastName: 'User',
//         role: UserRole.ADMIN,
//         isActive: true,
//     },
//     {
//         email: 'user@shvydak.com',
//         password: 'user123456',
//         firstName: 'Test',
//         lastName: 'User',
//         role: UserRole.USER,
//         isActive: true,
//     },
//     {
//         email: 'yuriy@shvydak.com',
//         password: 'yuriy123456',
//         firstName: 'Yuriy',
//         lastName: 'Shvydak',
//         role: UserRole.ADMIN,
//         isActive: true,
//     },
// ]

// async function seedDatabase() {
//     try {
//         console.log('🌱 Starting database seeding...')

//         // Connect to database
//         await databaseConnection.connect()

//         // Clear existing users
//         await User.deleteMany({})
//         console.log('🗑️ Cleared existing users')

//         // Create seed users
//         for (const userData of seedUsers) {
//             const user = new User(userData)
//             await user.save()
//             console.log(`✅ Created user: ${user.email}`)
//         }

//         console.log('🎉 Database seeding completed successfully!')
//         console.log(`📊 Created ${seedUsers.length} users`)

//         // Close database connection
//         await databaseConnection.disconnect()
//     } catch (error) {
//         console.error('❌ Error seeding database:', error)
//         process.exit(1)
//     }
// }

// // Run seeding if this file is executed directly
// if (require.main === module) {
//     seedDatabase()
// }

// export default seedDatabase
