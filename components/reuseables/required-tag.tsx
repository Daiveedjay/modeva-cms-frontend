export default function RequiredTag({ tag = "*" }: { tag?: string }) {
  return <span className="text-destructive">{tag}</span>;
}
