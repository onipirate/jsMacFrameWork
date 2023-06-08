/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql, { Connection, FieldPacket } from 'mysql2/promise';
import Allure from '../../resources/utils/Allure';

/**
 * A class that provides methods for connecting to and executing queries on a MySQL database
 * using the `mysql2/promise` library.
 *
 * @class MySQL
 */
class MySQL {
  private config: mysql.ConnectionOptions;
  private connection: Connection | null;

  constructor(config: mysql.ConnectionOptions) {
    this.config = config;
    this.connection = null;
  }

  public connect = async (): Promise<this> => {
    try {
      this.connection = await mysql.createConnection(this.config);
      return this;
    } catch (error) {
      Allure.logStep('Failed to connect to MySQL server');
      throw error;
    }
  };

  public executeQuery = async (query: string): Promise<{ rows: any[]; fields: string[] }> => {
    try {
      const [rows, fields]: [any[], FieldPacket[]] = await this.connection!.execute(query);
      const fieldNames = fields.map((field) => field.name);
      Allure.attachment(`${query}`, JSON.stringify(rows, null, 2));

      return { rows, fields: fieldNames };
    } catch (error) {
      Allure.logStep('Failed to execute query');
      throw error;
    }
  };

  public disconnect = async (): Promise<void> => {
    if (this.connection) {
      try {
        await this.connection.end();
      } catch (error) {
        Allure.logStep('Failed to disconnect from MySQL server');
        throw error;
      }
    }
  };
}

export default MySQL;
