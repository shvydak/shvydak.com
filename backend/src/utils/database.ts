import mongoose from 'mongoose';
import { databaseConfig } from '@/config';

/**
 * Database connection utility class
 * Handles MongoDB connection with proper error handling and reconnection logic
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  /**
   * Get singleton instance of DatabaseConnection
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Connect to MongoDB with proper error handling
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      // Set mongoose options
      mongoose.set('strictQuery', false);
      
      // Connect to MongoDB
      await mongoose.connect(databaseConfig.uri, databaseConfig.options);
      
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
        this.isConnected = true;
      });

      // Graceful shutdown
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('✅ MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Graceful shutdown handler
   */
  private async gracefulShutdown(): Promise<void> {
    console.log('🛑 Received shutdown signal, closing database connection...');
    await this.disconnect();
    process.exit(0);
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get connection info
   */
  public getConnectionInfo(): mongoose.ConnectionStates {
    return mongoose.connection.readyState;
  }
}

// Export singleton instance
export const databaseConnection = DatabaseConnection.getInstance();
