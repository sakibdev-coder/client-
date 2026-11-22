export function dashboardHome(role?: string | null) {
  if (role === "Admin") return "/dashboard/admin";
  if (role === "Owner") return "/dashboard/owner";
  return "/dashboard";
}
