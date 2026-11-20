"use client";
import DashboardShell from "../../../components/DashboardShell";
import { useAuth } from "../../../lib/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  return <DashboardShell title="My profile" subtitle="Keep your rental and account information up to date."><form className="profile-form" onSubmit={(event) => event.preventDefault()}><div className="profile-avatar">{user?.photo ? <img src={user.photo} alt="" /> : user?.name?.[0] || "U"}</div><div className="profile-grid"><label>Name<input defaultValue={user?.name || ""} /></label><label>Email<input type="email" defaultValue={user?.email || ""} readOnly /></label><label>Phone number<input type="tel" placeholder="+880..." /></label><label>Address<textarea rows={3} placeholder="Your address" /></label></div><button className="button button-dark" type="submit">Update profile</button></form></DashboardShell>;
}
