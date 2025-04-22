// Utilidad global para mostrar el nombre amigable del usuario/perfil
export function getDisplayName(user, profile) {
  if (profile?.apodo?.trim()) return profile.apodo;
  if (profile?.nombres?.trim()) return profile.nombres.split(' ')[0];
  if (user?.user_metadata?.apodo?.trim()) return user.user_metadata.apodo;
  if (user?.user_metadata?.name) return user.user_metadata.name.split(' ')[0];
  if (user?.email) return user.email.split('@')[0];
  return null;
}
