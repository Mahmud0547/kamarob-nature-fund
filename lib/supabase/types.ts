// Database types for supabase-js. Regenerate after schema changes:
//   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Role = "member" | "editor" | "admin" | "demo_admin";
type Status = "pending" | "active" | "blocked";
type Visibility = "public" | "members";

type Table<Row, Insert, Update = Partial<Insert>> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        { id: string; full_name: string; role: Role; status: Status; locale: string; is_sample: boolean; created_at: string },
        { id: string; full_name?: string; locale?: string },
        { full_name?: string; locale?: string }
      >;
      posts: Table<
        {
          id: string;
          slug: string;
          kind: "news" | "announcement";
          title: Json;
          summary: Json;
          body: Json;
          cover_path: string | null;
          tags: string[];
          visibility: Visibility;
          status: "draft" | "published";
          is_sample: boolean;
          published_at: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          slug: string;
          kind?: "news" | "announcement";
          title: Json;
          summary?: Json;
          body?: Json;
          cover_path?: string | null;
          tags?: string[];
          visibility?: Visibility;
          status?: "draft" | "published";
        }
      >;
      documents: Table<
        {
          id: string;
          title: Json;
          description: Json;
          file_path: string;
          file_name: string;
          mime_type: string;
          size_bytes: number;
          visibility: Visibility;
          is_sample: boolean;
          uploaded_by: string | null;
          created_at: string;
        },
        { title: Json; description?: Json; file_path: string; file_name: string; mime_type: string; size_bytes: number; visibility?: Visibility }
      >;
      contact_messages: Table<
        { id: string; name: string; email: string; message: string; handled: boolean; is_sample: boolean; created_at: string },
        { name: string; email: string; message: string },
        { handled?: boolean }
      >;
      channels: Table<
        { id: string; slug: string; name: Json; description: Json; position: number; created_at: string },
        { slug: string; name: Json; description?: Json; position?: number }
      >;
      messages: Table<
        { id: number; channel_id: string; author_id: string; body: string; is_sample: boolean; created_at: string },
        { channel_id: string; body: string }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      set_member: { Args: { target: string; new_role: Role; new_status: Status }; Returns: undefined };
      admin_overview: { Args: Record<string, never>; Returns: Json };
    };
    Enums: { member_role: Role; member_status: Status; visibility: Visibility };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type ChatMessage = Database["public"]["Tables"]["messages"]["Row"];
