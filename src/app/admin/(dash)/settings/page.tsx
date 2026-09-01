import { connectDB } from "@/lib/mongodb";
import { Settings, STORY_TEXT_DEFAULTS } from "@/models/Settings";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await connectDB();
  let settings = await Settings.findOne().lean();
  if (!settings) {
    settings = (await Settings.create({})).toObject();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-lg font-medium">settings</h1>
      <SettingsForm
        settings={JSON.parse(JSON.stringify(settings))}
        storyText={JSON.parse(
          JSON.stringify(settings.storyText ?? STORY_TEXT_DEFAULTS)
        )}
      />
    </div>
  );
}
