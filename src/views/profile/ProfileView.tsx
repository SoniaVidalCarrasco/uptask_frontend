import { useAuth } from "@/hooks/useAuth";
import ProfileForm from "../../components/profile/ProfileForms";

export default function ProfileView() {
  const { data, isLoading } = useAuth();

  if (isLoading) return "Cargando...";

  if (data) return <ProfileForm data={data} />;
}
