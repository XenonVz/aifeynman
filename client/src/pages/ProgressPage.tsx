import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const ProgressPage = () => {
  // Mock data for charts and components
  const feynmanSteps = [
    { name: "Explain", completed: 15, total: 18, percentage: 83 },
    { name: "Review", completed: 12, total: 16, percentage: 75 },
    { name: "Simplify", completed: 9, total: 15, percentage: 60 },
    { name: "Analogize", completed: 7, total: 14, percentage: 50 }
  ];

  const conceptStats = {
    covered: 72,
    partiallyCovered: 18,
    notCovered: 10,
    totalConcepts: 50
  };

  const streakData = {
    currentStreak: 4,
    longestStreak: 7,
    lastActive: "Today"
  };

  const quizScores = [
    { name: "Week 1", score: 70 },
    { name: "Week 2", score: 75 },
    { name: "Week 3", score: 82 },
    { name: "Week 4", score: 88 },
    { name: "Week 5", score: 92 }
  ];

  const subjectProgress = [
    { 
      subject: "Physics", 
      progress: 68, 
      recentTopics: [
        "Newton's Laws of Motion", 
        "Kinematics"
      ],
      sessions: 8
    },
    { 
      subject: "Mathematics", 
      progress: 85, 
      recentTopics: [
        "Quadratic Equations", 
        "Linear Algebra"
      ],
      sessions: 12 
    },
    { 
      subject: "Biology", 
      progress: 42, 
      recentTopics: [
        "Cell Division", 
        "Genetics"
      ],
      sessions: 5 
    }
  ];

  const strengths = ["Explanation Clarity", "Consistent Practice", "Quiz Performance"];
  const areasToImprove = ["Concept Simplification", "Creating Analogies"];

  const recentSessions = [
    { 
      topic: "Newton's Laws of Motion", 
      date: "May 15, 2024", 
      score: 92,
      concepts: 15,
      duration: "32 min" 
    },
    { 
      topic: "Algebra: Quadratic Equations", 
      date: "May 12, 2024", 
      score: 88,
      concepts: 12,
      duration: "28 min"
    },
    { 
      topic: "Cell Biology: Mitosis", 
      date: "May 10, 2024", 
      score: 78,
      concepts: 18,
      duration: "45 min"
    }
  ];

  // Color palette for charts
  const COLORS = {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--accent))",
    muted: "hsl(var(--muted))",
    conceptCovered: "#34D399",
    conceptPartial: "#F59E0B",
    conceptMissing: "#EF4444",
    gray: "hsl(var(--muted-foreground))"
  };

  // Pie chart data for concept coverage
  const conceptCoverageData = [
    { name: "Covered", value: conceptStats.covered },
    { name: "Partially", value: conceptStats.partiallyCovered },
    { name: "Not Covered", value: conceptStats.notCovered }
  ];
  
  const pieColors = [COLORS.conceptCovered, COLORS.conceptPartial, COLORS.conceptMissing];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <h1 className="text-2xl font-bold dark:text-white">Learning Progress</h1>
          
          <div className="flex items-center mt-2 sm:mt-0">
            <Badge variant="outline" className="mr-2 bg-gray-100 dark:bg-gray-800">
              <span className="text-amber-500 mr-1">●</span> Current Streak: {streakData.currentStreak} days
            </Badge>
            <Button variant="outline" size="sm" className="dark:text-white dark:border-gray-700">
              <i className="fas fa-download mr-2"></i> Export Progress
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Concepts Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {conceptStats.covered}%
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  {Math.round(conceptStats.covered / 100 * conceptStats.totalConcepts)} of {conceptStats.totalConcepts} concepts
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Average Quiz Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {quizScores.reduce((acc, item) => acc + item.score, 0) / quizScores.length}%
              </div>
              <div className="text-xs text-green-500 dark:text-green-400 flex items-center mt-2">
                <i className="fas fa-arrow-up mr-1"></i> 
                <span>↑ 6% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {subjectProgress.reduce((sum, item) => sum + item.sessions, 0)}
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  Across {subjectProgress.length} subjects
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Last Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold dark:text-white truncate">
                {recentSessions[0].topic}
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  {recentSessions[0].date} • Score: {recentSessions[0].score}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Feynman Technique Progress */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Feynman Technique Progress</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-400">
              Track your progress through the 4 steps of the Feynman Technique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {feynmanSteps.map((step) => (
                <div key={step.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                      <span className="text-sm font-medium dark:text-white">{step.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground dark:text-gray-400">
                      {step.completed}/{step.total} sessions
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={step.percentage} className="h-2" />
                    <span className="absolute text-xs text-muted-foreground dark:text-gray-400 right-0 -top-6">
                      {step.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Concept Coverage */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Concept Coverage</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Distribution of concept mastery
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conceptCoverageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {conceptCoverageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Coverage']}
                    contentStyle={{
                      background: 'rgba(23, 23, 23, 0.8)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6">
                {conceptCoverageData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: pieColors[index] }}
                    ></div>
                    <span className="text-xs dark:text-gray-300">{entry.name}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Quiz Performance */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Quiz Performance</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Your progress over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                    contentStyle={{
                      background: 'rgba(23, 23, 23, 0.8)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke={COLORS.primary}
                    strokeWidth={3} 
                    dot={{ r: 6, fill: COLORS.primary, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Subject Progress */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Subject Progress</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-400">
              Your performance across different subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectProgress.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="font-medium dark:text-white">{subject.subject}</span>
                      <Badge variant="outline" className="ml-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                        {subject.sessions} sessions
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground dark:text-gray-400">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground dark:text-gray-400">
                    <span>Recent topics:</span>
                    {subject.recentTopics.map((topic, idx) => (
                      <Badge key={idx} variant="secondary" className="font-normal">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths & Improvement Areas */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Learning Profile</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Analysis of your teaching strengths and areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2 dark:text-gray-300">Your Strengths</h3>
                  <ul className="space-y-2">
                    {strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="dark:text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2 dark:text-gray-300">Areas to Improve</h3>
                  <ul className="space-y-2">
                    {areasToImprove.map((area, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-amber-500 mr-2">→</span>
                        <span className="dark:text-gray-300">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Sessions */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Recent Teaching Sessions</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-gray-400">
                Your latest teaching activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 border border-border rounded-lg dark:border-gray-700 hover:bg-accent/50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium dark:text-white">{session.topic}</h3>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {session.date} • {session.duration}
                        </p>
                      </div>
                      <Badge className={`${
                        session.score >= 90 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                          : session.score >= 70 
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {session.score}%
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs dark:border-gray-700 dark:text-gray-400">
                        {session.concepts} concepts
                      </Badge>
                      <div className="flex-1"></div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary dark:text-primary-foreground hover:text-primary-dark">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
