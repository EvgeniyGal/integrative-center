type JsonLdValue =
  | Record<string, unknown>
  | Record<string, unknown>[]
  | string
  | number
  | boolean
  | null;

export function JsonLdScript({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
