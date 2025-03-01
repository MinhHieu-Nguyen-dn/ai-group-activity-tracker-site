export interface Database {
  public: {
    Tables: {
      bounty: {
        Row: {
          id: number
          accumulated: number
        }
        Insert: {
          id?: number
          accumulated: number
        }
        Update: {
          id?: number
          accumulated?: number
        }
      }
      transactions: {
        Row: {
          id: number
          transaction_id: number
          gateway: string | null
          transaction_date: string | null
          account_number: string | null
          content: string | null
          transfer_type: string
          transfer_amount: number
          accumulated: number
          reference_code: string | null
          created_at: string
        }
        Insert: {
          transaction_id: number
          gateway?: string | null
          transaction_date?: string | null
          account_number?: string | null
          content?: string | null
          transfer_type: string
          transfer_amount: number
          accumulated: number
          reference_code?: string | null
        }
        Update: {
          transaction_id?: number
          gateway?: string | null
          transaction_date?: string | null
          account_number?: string | null
          content?: string | null
          transfer_type?: string
          transfer_amount?: number
          accumulated?: number
          reference_code?: string | null
        }
      }
    }
  }
}

