import { LinearGradient } from 'expo-linear-gradient';
import { BarChart3, TrendingDown, TrendingUp, Trophy } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient as SvgGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { ProgressBar } from '@/components/ProgressBar';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { formatGrade, rankingMessage, rankingWindow } from '../../data/studentSelectors';
import type { StudentCourse } from '../../mocks/studentCourses';
import type { RankingEntry } from '../../mocks/studentProgress';
import { CourseBanner } from '../courses/CourseBanner';
import { CardHeader } from '../home/CardHeader';
import { RankingRow3D } from '../home/RankingCard';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
const GOLD = categories.orange;
const WHITE = colors.surface;

/** Escalones crecientes en arcilla blanca con flecha y estrella doradas (ilustración de avance). */
function ProgressIllustration() {
  const bars = [
    { h: 34, x: 14 },
    { h: 56, x: 52 },
    { h: 80, x: 90 },
    { h: 106, x: 128 },
  ];
  return (
    <Svg height="100%" preserveAspectRatio="xMidYMax meet" viewBox="0 0 180 150" width="100%">
      <Defs>
        <SvgGradient id="hero-shine" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor={WHITE} stopOpacity="0.9" />
          <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
        </SvgGradient>
      </Defs>
      {bars.map(({ h, x }) => (
        <G key={x}>
          <Rect fill={brand.blueSoft} height={h} rx={7} width={30} x={x + 3} y={142 - h + 5} />
          <Rect fill={WHITE} height={h} rx={7} width={30} x={x} y={142 - h} />
          <Rect
            fill="url(#hero-shine)"
            height={h / 2}
            opacity={0.5}
            rx={7}
            width={30}
            x={x}
            y={142 - h}
          />
        </G>
      ))}
      <Path
        d="M18 92 Q60 70 82 58 T150 18"
        fill="none"
        stroke={GOLD.ink}
        strokeLinecap="round"
        strokeWidth={6}
        transform="translate(2 3)"
      />
      <Path
        d="M18 92 Q60 70 82 58 T150 18"
        fill="none"
        stroke={GOLD.base}
        strokeLinecap="round"
        strokeWidth={6}
      />
      <Path
        d="M136 12 L158 12 L152 34 Z"
        fill={GOLD.base}
        stroke={GOLD.base}
        strokeLinejoin="round"
        strokeWidth={3}
      />
      <Circle cx={30} cy={30} fill={GOLD.base} r={5} />
      <Circle cx={30} cy={30} fill={WHITE} opacity={0.6} r={2} />
    </Svg>
  );
}

/** Mensaje del hero según el avance real (sin exagerar). */
function heroMessage(percent: number) {
  if (percent >= 100) return '¡Completaste todos tus cursos!';
  if (percent >= 50) return '¡Vas por buen camino!';
  if (percent > 0) return 'Ya diste los primeros pasos';
  return 'Tu recorrido empieza hoy';
}

/** Hero «Tu progreso académico»: avance real por lecciones, no promedio de notas. */
export function ProgressHero({
  done,
  percent,
  total,
}: {
  done: number;
  percent: number;
  total: number;
}) {
  return (
    <LinearGradient
      colors={[brand.blue, brand.blueDeep, brand.blueNight]}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      style={styles.hero}
    >
      <View pointerEvents="none" style={styles.heroGlow} />
      <View pointerEvents="none" style={styles.heroArt}>
        <ProgressIllustration />
      </View>
      <View style={styles.heroText}>
        <Text style={styles.heroEyebrow}>Tu progreso académico</Text>
        <Text numberOfLines={1} style={styles.heroTitle}>
          {heroMessage(percent)}
        </Text>
      </View>
      <View style={styles.heroBottom}>
        <Text style={styles.heroPercent}>
          {percent}
          <Text style={styles.heroPercentUnit}>%</Text>
        </Text>
        <ProgressBar color={brand.onBlue} trackColor={brand.onBlueSubtle} value={percent} />
        <Text numberOfLines={1} style={styles.heroCaption}>
          {done} de {total} lecciones completadas · cada lección te acerca a tu meta
        </Text>
      </View>
    </LinearGradient>
  );
}

/** «Mi posición»: trofeo, puesto real, variación y acceso a la tarjeta académica. */
export function PositionCard({
  change,
  onOpenCard,
  period,
  position,
  scope,
  total,
}: {
  change?: number;
  onOpenCard: () => void;
  period: string;
  position?: number;
  scope: string;
  total: number;
}) {
  const Trend = change !== undefined && change < 0 ? TrendingDown : TrendingUp;
  const hasChange = position !== undefined && change !== undefined && change !== 0;

  return (
    <View style={styles.position}>
      <SoftScene base={GOLD.base} />
      <View style={styles.positionTop}>
        <View style={styles.flex}>
          <Text numberOfLines={1} style={styles.cardLabel}>
            Mi posición · {scope}
          </Text>
          <Text style={styles.positionValue}>
            {position ? `#${position}` : '—'}
            <Text style={styles.positionTotal}> de {total}</Text>
          </Text>
          <View style={styles.trendRow}>
            {hasChange ? (
              <View style={styles.trend}>
                <Trend color={GOLD.ink} size={14} strokeWidth={2.4} />
                <Text style={styles.trendText}>
                  {change > 0 ? 'Subiste' : 'Bajaste'} {Math.abs(change)}
                </Text>
              </View>
            ) : (
              <Text style={styles.meta}>{rankingMessage(position, total)}</Text>
            )}
            <Text numberOfLines={1} style={[styles.meta, styles.flex]}>
              {period}
            </Text>
          </View>
        </View>
        <Clay3DIcon kind="trophy" palette={GOLD} size={72} />
      </View>
      <Pressable accessibilityRole="button" onPress={onOpenCard}>
        {({ pressed }) => (
          <Raised3D faceStyle={styles.cta} palette={GOLD} pressed={pressed} variant="white">
            <Trophy color={GOLD.ink} size={18} strokeWidth={2.2} />
            <Text style={styles.ctaText}>Ver mi tarjeta académica</Text>
          </Raised3D>
        )}
      </Pressable>
    </View>
  );
}

/**
 * Rendimiento por curso en filas de una línea: avance (lecciones) y promedio (notas) son datos
 * distintos. Si hay más cursos de los que caben, la lista se desplaza por dentro.
 */
export function CoursePerformanceCard({
  rows,
}: {
  rows: { average?: number; course: StudentCourse }[];
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'monitor', palette: BRAND_PALETTE }}
        icon={BarChart3}
        right={<Text style={styles.headerHint}>Avance · Promedio</Text>}
        title="Mi rendimiento por curso"
      />
      {rows.length === 0 && <Text style={styles.empty}>Aún no estás matriculado en cursos.</Text>}
      <ScrollView
        contentContainerStyle={styles.courseList}
        showsVerticalScrollIndicator={false}
        style={styles.fill}
      >
        {rows.map(({ average, course }) => (
          <View
            key={course.id}
            accessibilityLabel={`${course.title}: avance ${course.progress} %, ${
              average === undefined ? 'sin calificar' : `promedio ${formatGrade(average)} de 20`
            }`}
            accessible
            style={styles.courseRow}
          >
            <CourseBanner
              compact
              color={course.color}
              icon={course.icon}
              style={styles.courseThumb}
              uid={`progress-${course.id}`}
            />
            <Text numberOfLines={1} style={styles.courseName}>
              {course.title}
            </Text>
            <View style={styles.courseBar}>
              <ProgressBar trackColor={colors.track} value={course.progress} />
            </View>
            <Text style={styles.coursePercent}>{course.progress}%</Text>
            <View style={styles.grade}>
              {average === undefined ? (
                <Text style={styles.gradeEmpty}>Sin calificar</Text>
              ) : (
                <Text style={styles.gradeValue}>
                  {formatGrade(average)}
                  <Text style={styles.gradeUnit}>/20</Text>
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
}

/** Ranking con vecinos inmediatos (misma fuente y estilo 3D que el Inicio). */
export function RankingDetailCard({
  entries,
  period,
  position,
  scope,
  total,
}: {
  entries: RankingEntry[];
  period: string;
  position?: number;
  scope: string;
  total: number;
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'trophy', palette: GOLD }}
        icon={Trophy}
        title={`Ranking · ${scope}`}
      />
      <Text numberOfLines={1} style={styles.meta}>
        {period} · {rankingMessage(position, total)}
      </Text>
      <View style={styles.rankingList}>
        {rankingWindow(entries, position).map((entry) => (
          <RankingRow3D key={entry.id} entry={entry} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fill: { flex: 1, minHeight: 0 },
  card: { flex: 1, gap: 10, padding: 20 },
  cardLabel: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 14 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  headerHint: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  empty: {
    color: colors.textMuted,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },

  hero: {
    borderRadius: radius.card,
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 20,
    ...shadows.card,
  },
  heroGlow: {
    backgroundColor: brand.onBlueSubtle,
    borderRadius: radius.pill,
    height: 260,
    position: 'absolute',
    right: -50,
    top: -90,
    width: 260,
  },
  heroArt: { bottom: 56, position: 'absolute', right: 20, top: 12, width: 170 },
  heroText: { gap: 2, maxWidth: '62%' },
  heroEyebrow: {
    color: brand.onBlueMuted,
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: brand.onBlue,
    fontFamily: fontFamily.regular,
    fontSize: 28,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  heroBottom: { gap: 6 },
  heroPercent: {
    color: brand.onBlue,
    fontFamily: fontFamily.extrabold,
    fontSize: 40,
    letterSpacing: -1,
    lineHeight: 44,
  },
  heroPercentUnit: { color: brand.onBlueMuted, fontFamily: fontFamily.bold, fontSize: 22 },
  heroCaption: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 13 },

  position: {
    backgroundColor: GOLD.soft,
    borderRadius: radius.card,
    flex: 1,
    gap: 10,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 20,
    ...shadows.card,
  },
  positionTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  positionValue: {
    color: colors.text,
    fontFamily: fontFamily.extrabold,
    fontSize: 40,
    letterSpacing: -1,
    lineHeight: 46,
  },
  positionTotal: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 16 },
  trendRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  trend: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendText: { color: GOLD.ink, fontFamily: fontFamily.bold, fontSize: 12 },
  cta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  ctaText: { color: GOLD.ink, fontFamily: fontFamily.bold, fontSize: 14 },

  courseList: { flexGrow: 1, gap: 4, justifyContent: 'space-between' },
  courseRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, minHeight: 30 },
  courseThumb: { borderRadius: 8, height: 30, width: 30 },
  courseName: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 14, width: 200 },
  courseBar: { flex: 1 },
  coursePercent: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 13,
    textAlign: 'right',
    width: 42,
  },
  grade: { alignItems: 'flex-end', width: 84 },
  gradeValue: { color: colors.text, fontFamily: fontFamily.extrabold, fontSize: 17 },
  gradeUnit: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  gradeEmpty: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },

  /** Las filas se reparten el alto restante. */
  rankingList: { flex: 1, gap: 4, justifyContent: 'space-between', minHeight: 0 },
});
