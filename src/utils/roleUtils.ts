import { supabase } from "@/integrations/supabase/client.ts";

export type RolePermission =
  | "view_reports"
  | "export_reports"
  | "manage_students"
  | "manage_teachers"
  | "manage_schedules"
  | "manage_roles"
  | "bulk_actions"
  | "manage_classes";

/**
 * Check if the current user has a specific permission
 *
 * Note: The backend function has been updated to use a fixed search path
 * for improved security.
 */
export const hasPermission = async (
  requiredPermission: RolePermission,
): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return false;

    // Call the Supabase RPC function to check permissions
    const { data, error } = await supabase.rpc("has_permission", {
      p_user_id: session.user.id,
      required_permission: requiredPermission,
    });

    if (error) {
      console.error("Permission check error:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Unexpected error checking permission:", error);
    return false;
  }
};

/**
 * Get all permissions for the current user
 */
export const getUserPermissions = async (
  userId?: string,
): Promise<RolePermission[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return [];

    // Use provided userId or get from session
    const userIdToUse = userId || session.user.id;

    // First get the user's role ID
    const { data: roleIdData, error: roleIdError } = await supabase.rpc(
      "get_user_role_id",
      { p_user_id: userIdToUse },
    );

    if (roleIdError) {
      console.error("Error getting user role ID:", roleIdError);
      return [];
    }

    // If no role ID found, return empty permissions array
    if (!roleIdData) {
      console.log("No role assigned for user");
      return [];
    }

    // Then use the role ID to get permissions
    const { data, error } = await supabase
      .from("roles")
      .select(`
        id, 
        name,
        role_permissions (
          permission
        )
      `)
      .eq("id", roleIdData);

    if (error) {
      console.error("Error fetching user permissions:", error);
      return [];
    }

    // Extract the permissions from the data
    if (!data || data.length === 0) return [];

    // Extract permissions from the nested query result
    const permissions: RolePermission[] = [];
    data.forEach((role) => {
      if (role.role_permissions && Array.isArray(role.role_permissions)) {
        role.role_permissions.forEach(
          (rp: { permission: RolePermission | null }) => {
            if (rp.permission) {
              permissions.push(rp.permission);
            }
          },
        );
      }
    });

    return permissions;
  } catch (error) {
    console.error("Unexpected error fetching permissions:", error);
    return [];
  }
};
