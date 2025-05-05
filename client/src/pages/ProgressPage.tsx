import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";

const ProgressPage = () => {
  // Mock data for charts
  const sessionsBySubject = [
    { name: "Physics", sessions: 8 },
    { name: "Math", sessions: 12 },
    { name: "Biology", sessions: 5 },
    { name: "Chemistry", sessions: 3 },
    { name: "Computer Science", sessions: 7 }
  ];
  
  const feynmanStepCompletion = [
    { name: "Explain", completed: 15 },
    { name: "Review", completed: 12 },
    { name: "Simplify", completed: 9 },
    { name: "Analogize", completed: 7 }
  ];
  
  const quizScores = [
    { name: "Week 1", score: 70 },
    { name: "Week 2", score: 75 },
    { name: "Week 3", score: 82 },
    { name: "Week 4", score: 88 },
    { name: "Week 5", score: 92 }
  ];
  
  const gapsCoverage = [
    { name: "Covered", value: 72 },
    { name: "Partially Covered", value: 18 },
    { name: "Not Covered", value: 10 }
  ];
  
  const COLORS = ["#34D399", "#F59E0B", "#EF4444"];
  
  const recentTopics = [
    { name: "Newton's Laws of Motion", score: 92, date: "May 15, 2024" },
    { name: "Algebra: Quadratic Equations", score: 88, date: "May 12, 2024" },
    { name: "Cell Biology: Mitosis", score: 78, date: "May 10, 2024" }
  ];

  // Custom tooltip styles to match theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border border-border rounded shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <p className="font-medium">{label}</p>
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Learning Progress</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sessions By Subject */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Teaching Sessions by Subject</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionsBySubject} barSize={30} margin={{ left: 10, right: 10, bottom: 20 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'var(--foreground, #000000)' }} 
                    tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                    className="dark:text-white"
                  />
                  <YAxis tick={{ fill: 'var(--foreground, #000000)' }} className="dark:text-white" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="sessions" 
                    fill="hsl(var(--primary))" 
                    background={{ fill: 'transparent' }}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Feynman Step Completion */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Feynman Steps Completed</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={feynmanStepCompletion} 
                  barSize={30} 
                  margin={{ left: 10, right: 10, bottom: 20 }}
                  layout="vertical"
                >
                  <XAxis type="number" className="dark:text-white" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80} 
                    tick={{ fill: 'var(--foreground, #000000)' }} 
                    className="dark:text-white"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="completed" 
                    fill="hsl(var(--accent))" 
                    background={{ fill: 'transparent' }}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Quiz Scores Over Time */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Quiz Scores Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizScores} margin={{ left: 10, right: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #e5e7eb)" className="dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--foreground, #000000)' }} className="dark:text-white" />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--foreground, #000000)' }} className="dark:text-white" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Gap Coverage */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Concept Coverage</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gapsCoverage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => (
                      <text
                        x={percent < 0.1 ? 250 : "50%"}
                        y={percent < 0.1 ? 50 * (1 + gapsCoverage.findIndex(e => e.name === name)) : "50%"}
                        fill="var(--foreground, #000000)"
                        textAnchor={percent < 0.1 ? "start" : "middle"}
                        dominantBaseline="central"
                        className="dark:fill-white"
                      >
                        {`${name}: ${(percent * 100).toFixed(0)}%`}
                      </text>
                    )}
                    isAnimationActive={false}
                  >
                    {gapsCoverage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Topics */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Recently Taught Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 dark:text-gray-300">Topic</th>
                    <th className="text-left py-3 px-4 dark:text-gray-300">Quiz Score</th>
                    <th className="text-left py-3 px-4 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTopics.map((topic, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 dark:text-white">{topic.name}</td>
                      <td className="py-3 px-4 dark:text-white">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-neutral-200 dark:bg-gray-600 rounded-full mr-2">
                            <div
                              className={`h-full rounded-full ${
                                topic.score >= 90 
                                  ? "bg-green-500" 
                                  : topic.score >= 70 
                                  ? "bg-yellow-500" 
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${topic.score}%` }}
                            ></div>
                          </div>
                          <span>{topic.score}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 dark:text-white">{topic.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-xs text-primary hover:underline">Review</button>
                          <button className="text-xs text-primary hover:underline">Continue</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
