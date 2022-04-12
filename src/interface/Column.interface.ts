export type SqlType = 'INTEGER' | 'BOOLEAN' | 'TEXT';

export interface Column {
  name: string;
  width: number;
  type: SqlType;
}
