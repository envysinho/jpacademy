import { Trophy } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Raised3D } from '@/components/Raised3D';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import { rankingMessage, rankingWindow } from '../../data/studentSelectors';
import type { RankingEntry } from '../../mocks/studentProgress';

import { CardHeader } from './CardHeader';

const GOLD = categories.orange;
/** Alto de la cara de cada fila 3D (sin el canto). */
const ROW_HEIGHT = 30;
const ROW_DEPTH = 3;

/** Píldora «Tú» con canto (naranja de marca). */
function MePill() {
  return (
    <View style={styles.meWrap}>
      <View style={styles.meEdge} />
      <View style={styles.meFace}>
        <View style={styles.meShine} />
        <Text style={styles.meText}>Tú</Text>
      </View>
    </View>
  );
}

/** Medallón 3D con la posición: dorado en el podio (1–3), neutro en el resto. */
function PositionMedal({ position }: { position: number }) {
  const isPodium = position <= 3;
  return (
    <View style={styles.medal}>
      <View
        style={[styles.medalEdge, { backgroundColor: isPodium ? GOLD.ink : colors.trackFill }]}
      />
      <View style={[styles.medalFace, { backgroundColor: isPodium ? GOLD.base : colors.track }]}>
        <View style={styles.medalShine} />
        <Text style={[styles.medalText, isPodium && styles.medalTextPodium]}>{position}</Text>
      </View>
    </View>
  );
}

/** Fila 3D: tarjeta blanca con canto; la del alumno, dorada con escena y «Tú». */
export function RankingRow3D({ entry }: { entry: RankingEntry }) {
  return (
    <Raised3D
      depth={ROW_DEPTH}
      faceStyle={[styles.row3d, entry.isMe && styles.row3dMe]}
      palette={GOLD}
      radius={radius.chip}
      variant={entry.isMe ? 'soft' : 'white'}
    >
      <PositionMedal position={entry.position} />
      <Text numberOfLines={1} style={[styles.name, entry.isMe && styles.nameMe]}>
        {entry.name}
      </Text>
      {entry.isMe && <MePill />}
    </Raised3D>
  );
}

/**
 * Ranking compacto del Inicio (sustituye a «Cursos»). Misma fuente que Progreso. Solo
 * informativo: no abre la clasificación completa.
 */
export function RankingCard({
  entries,
  periodShort,
  position,
  scope,
  total,
}: {
  entries: RankingEntry[];
  periodShort: string;
  position?: number;
  scope: string;
  total: number;
}) {
  const visible = rankingWindow(entries, position);

  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'trophy', palette: GOLD }}
        icon={Trophy}
        right={
          <Raised3D
            depth={3}
            faceStyle={styles.positionChip}
            palette={GOLD}
            radius={radius.pill}
            variant="soft"
          >
            <Text style={styles.positionChipText}>
              {position ? `#${position}` : '—'}
              <Text style={styles.positionChipTotal}> de {total}</Text>
            </Text>
          </Raised3D>
        }
        title="Ranking"
      />
      <Text numberOfLines={1} style={styles.caption}>
        {rankingMessage(position, total)} · {scope} · {periodShort}
      </Text>

      <View
        accessibilityLabel={
          position ? `Ranking: puesto ${position} de ${total}` : 'Ranking: sin posición todavía'
        }
        style={styles.list}
      >
        {visible.map((entry) => (
          <RankingRow3D key={entry.id} entry={entry} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: 10, padding: 20 },
  caption: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  positionChip: { justifyContent: 'center', minHeight: 32, paddingHorizontal: 12 },
  positionChipText: { color: GOLD.ink, fontFamily: fontFamily.extrabold, fontSize: 16 },
  positionChipTotal: { color: GOLD.ink, fontFamily: fontFamily.medium, fontSize: 12 },
  /** Las filas se reparten el alto restante (Inicio en un solo viewport). */
  list: { flex: 1, gap: 4, justifyContent: 'space-between', minHeight: 0 },

  row3d: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: ROW_HEIGHT,
    paddingHorizontal: 6,
  },
  row3dMe: { borderColor: GOLD.base, borderWidth: 1 },

  medal: { height: 24, width: 22 },
  medalEdge: { borderRadius: radius.pill, height: 22, position: 'absolute', top: 2, width: 22 },
  medalFace: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 22,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 22,
  },
  medalShine: {
    backgroundColor: colors.surface,
    height: '50%',
    left: 0,
    opacity: 0.25,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  medalText: { color: colors.textMuted, fontFamily: fontFamily.bold, fontSize: 11 },
  medalTextPodium: { color: colors.text },

  meWrap: { height: 22, marginBottom: 2 },
  meEdge: {
    backgroundColor: brand.accentPressed,
    borderRadius: radius.pill,
    bottom: -2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 2,
  },
  meFace: {
    backgroundColor: brand.accent,
    borderRadius: radius.pill,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 9,
  },
  meShine: {
    backgroundColor: colors.surface,
    height: '50%',
    left: 0,
    opacity: 0.22,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  meText: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 11 },

  name: { color: colors.text, flex: 1, fontFamily: fontFamily.medium, fontSize: 13 },
  nameMe: { color: GOLD.ink, fontFamily: fontFamily.bold },
});
