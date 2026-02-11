import { SHAPES } from '@/lib/shapes';
import ColoringScreen from '@/components/ColoringScreen';

export async function generateStaticParams() {
  return SHAPES.map((shape) => ({
    category: shape.categoryId,
    id: shape.id,
  }));
}

export default async function ColorPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params;
  return <ColoringScreen categoryId={category} shapeId={id} />;
}
