import ManifestGenerator from '../../components/ManifestGenerator';

export const metadata = {
  title: "ScriptLabs | Manifest Generator",
  description: "Generate manifests for your Minecraft add-ons.",
  keywords: "manifest, generator, Minecraft"
};

export default function ManifestGeneratorPage() {
  return (
    <div>
      <ManifestGenerator />
    </div>
  );
}