import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { StudentProgressChart } from "./StudentProgressChart.tsx";
import { ProgressDistributionChart } from "./ProgressDistributionChart.tsx";
import { TimeProgressChart } from "./TimeProgressChart.tsx";
import { ContributorActivityChart } from "./ContributorActivityChart.tsx";

interface AnalyticsChartsProps {
  studentProgress: { name: string; verses: number }[];
  qualityDistribution: { quality: string; count: number }[];
  timeProgress: { date: string; count: number }[];
  contributorActivity: { name: string; count: number }[];
  timeRange: "week" | "month" | "year";
}

export const AnalyticsCharts = ({
  studentProgress,
  qualityDistribution,
  timeProgress,
  contributorActivity,
  timeRange,
}: AnalyticsChartsProps) => {
  // Transform data to match the chart component prop types
  const formattedQualityData = qualityDistribution.map((item) => ({
    name: item.quality,
    value: item.count,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
          <CardDescription>
            Average verses memorized per student
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <StudentProgressChart data={studentProgress} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Distribution</CardTitle>
          <CardDescription>
            Distribution of memorization quality
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ProgressDistributionChart data={formattedQualityData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
          <CardDescription>
            Tracking progress trends over {timeRange}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <TimeProgressChart data={timeProgress} />
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Contributor Activity</CardTitle>
          <CardDescription>
            Progress entries by contributor
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ContributorActivityChart data={contributorActivity} />
        </CardContent>
      </Card>
    </div>
  );
};
